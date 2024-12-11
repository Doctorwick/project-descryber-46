import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
            content: `You are a compassionate mental health first responder. Your role is to:
              1. Analyze the user's message for signs of crisis or distress
              2. Determine the urgency level
              3. Provide a warm, supportive response
              4. Suggest appropriate resource categories
              
              Respond in JSON format:
              {
                "topics": string[],
                "urgency": "low" | "medium" | "high",
                "response": string,
                "resourceCategories": string[]
              }
              
              Guidelines:
              - For mentions of self-harm or suicide, set urgency to "high" and include "crisis" category
              - For depression or anxiety, include "mental" category
              - For relationship/communication issues, include "communication" category
              - Keep responses warm and supportive
              - Always acknowledge their feelings
              - For high urgency, emphasize immediate professional help
              - Maximum response length: 200 characters`
          },
          { role: 'user', content: message }
        ],
      }),
    });

    if (!analysisResponse.ok) {
      throw new Error('Failed to analyze message with AI');
    }

    const analysisData = await analysisResponse.json();
    const analysis = JSON.parse(analysisData.choices[0].message.content);
    console.log('AI Analysis:', analysis);

    // Fetch relevant resources
    const { data: resources, error: dbError } = await supabase
      .from('support_resources')
      .select('*')
      .in('category', analysis.resourceCategories)
      .eq('active', true)
      .order('priority', { ascending: false });

    if (dbError) throw dbError;

    console.log('Found resources:', resources);

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
    return new Response(
      JSON.stringify({ 
        analysis: {
          topics: ['error'],
          urgency: 'medium',
          response: "I'm having trouble understanding right now, but I want to help. If you're in immediate crisis, please reach out to emergency services or a crisis hotline right away.",
          resourceCategories: ['crisis']
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