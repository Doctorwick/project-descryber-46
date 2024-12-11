import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl!, supabaseKey!);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    console.log('Analyzing message:', message);

    // 1. Analyze message with GPT-4
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
            content: `You are a supportive AI assistant analyzing user messages to determine:
              1. The main topics/concerns (e.g., anxiety, depression, crisis)
              2. The urgency level (low, medium, high)
              3. A compassionate response
              4. Relevant resource categories that might help
              
              Respond in JSON format with these fields:
              {
                "topics": string[],
                "urgency": "low" | "medium" | "high",
                "response": string,
                "resourceCategories": string[]
              }
              
              For high urgency situations (mentions of self-harm, suicide, immediate danger),
              always include "crisis" in resourceCategories and set urgency to "high".
              
              Keep responses warm and supportive, acknowledging the person's feelings
              while encouraging them to seek appropriate help.`
          },
          { role: 'user', content: message }
        ],
      }),
    });

    const analysisData = await analysisResponse.json();
    const analysis = JSON.parse(analysisData.choices[0].message.content);
    console.log('AI Analysis:', analysis);

    // 2. Fetch relevant resources based on categories
    const { data: resources } = await supabase
      .from('support_resources')
      .select('*')
      .filter('category', 'in', `(${analysis.resourceCategories.map(c => `'${c}'`).join(',')})`)
      .filter('active', 'eq', true)
      .order('priority', { ascending: false });

    console.log('Found resources:', resources);

    return new Response(
      JSON.stringify({
        analysis,
        resources
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
        error: 'Failed to analyze message',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});