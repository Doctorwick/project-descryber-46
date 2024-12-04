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
    const { text } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are an AI that analyzes text for harmful content while understanding context.
                     You should consider:
                     1. The overall context (gaming, frustration, etc.)
                     2. The intent behind the message
                     3. Whether profanity is being used appropriately
                     4. The presence of any actual threats or harassment
                     
                     Respond with scores between 0 and 1 for:
                     - toxicity
                     - identity_attack
                     - insult
                     - threat
                     - context_score (higher means more appropriate use of language in context)`
          },
          { role: 'user', content: text }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const analysis = data.choices[0].message.content;
    
    // Parse the AI response into numerical scores
    const scores = {
      toxicity: parseFloat(analysis.match(/toxicity: ([\d.]+)/)?.[1] || "0.5"),
      identity_attack: parseFloat(analysis.match(/identity_attack: ([\d.]+)/)?.[1] || "0"),
      insult: parseFloat(analysis.match(/insult: ([\d.]+)/)?.[1] || "0"),
      threat: parseFloat(analysis.match(/threat: ([\d.]+)/)?.[1] || "0"),
      context_score: parseFloat(analysis.match(/context_score: ([\d.]+)/)?.[1] || "0.5"),
    };

    return new Response(JSON.stringify(scores), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-context function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});