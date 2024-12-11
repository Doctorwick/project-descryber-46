import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    console.log('Analyzing message:', message);

    // Analyze message with GPT-4
    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a compassionate mental health first responder. Analyze the user's message and respond in JSON format with:
              {
                "topics": string[], // Key themes identified in the message
                "urgency": "low" | "medium" | "high", // Assess risk level
                "response": string, // Warm, supportive response (max 200 chars)
                "resourceCategories": string[] // Relevant resource types: "crisis", "mental", "communication"
              }
              
              Guidelines:
              - Set urgency "high" for self-harm/suicide mentions
              - Include "crisis" category for high urgency
              - Keep responses warm and supportive
              - Acknowledge feelings
              - For high urgency, emphasize immediate help
              - For depression/anxiety, include "mental" category
              - For relationship/social issues, include "communication" category`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!analysisResponse.ok) {
      throw new Error('Failed to analyze message with AI');
    }

    const analysisData = await analysisResponse.json();
    const analysis = JSON.parse(analysisData.choices[0].message.content);
    console.log('AI Analysis:', analysis);

    // Fetch relevant resources based on categories
    const { data: resources, error: dbError } = await supabase
      .from('support_resources')
      .select('*')
      .in('category', analysis.resourceCategories)
      .eq('active', true)
      .order('priority', { ascending: false });

    if (dbError) throw dbError;

    // For high urgency, prioritize crisis resources
    if (analysis.urgency === 'high') {
      const crisisResources = resources?.filter(r => r.category === 'crisis') || [];
      const otherResources = resources?.filter(r => r.category !== 'crisis') || [];
      resources?.sort((a, b) => {
        if (a.category === 'crisis') return -1;
        if (b.category === 'crisis') return 1;
        return 0;
      });
    }

    return new Response(
      JSON.stringify({
        analysis,
        resources: resources || []
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error in analyze-support-message:', error);
    
    // Provide a more helpful fallback response for errors
    return new Response(
      JSON.stringify({ 
        analysis: {
          topics: ['support needed'],
          urgency: 'medium',
          response: "I hear that you're going through a difficult time. While I'm having some technical issues, I want to make sure you get the support you need. Would you like to tell me more?",
          resourceCategories: ['crisis', 'mental']
        },
        resources: []
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});