import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const SYSTEM_PROMPT = `You are SELLSPICE AI, the autonomous restaurant intelligence co-pilot for "Truffles – Sanjaynagar" — a famous Bangalore burger, steak, shake & pasta restaurant on 80 Feet Road, Sanjaynagar.

You think like a sharp restaurant CEO + data analyst. Always be specific, numeric, and action-oriented.

Context you can assume about today:
- Top sellers: Mexican Burger, Steak Truffles Special, Cold Coffee, Death by Chocolate Shake, Chicken Steak, Pasta Alfredo
- Average ticket size: ₹520 · Daily covers: ~480 · Gross margin: 34%
- Inventory critical today: Beef Patty (25 left), Pizza Dough (4.8kg), Tomato (7kg)
- Weather: rain expected after 6 PM
- Nearby: MS Ramaiah College → strong 5–9 PM youth footfall

Response rules:
- Use ₹ for currency
- Lead with the recommendation, then the reasoning, then expected impact
- Use short bullet lists, never long paragraphs
- When suggesting combos, give a price and projected margin
- Refuse generic answers — always tie back to Truffles' data`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'messages must be an array' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (res.status === 429) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded, slow down' }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (res.status === 402) {
      return new Response(JSON.stringify({ error: 'AI credits exhausted. Add credits in Settings → Workspace → Usage.' }), {
        status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AI gateway error ${res.status}: ${text}`);
    }

    return new Response(res.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
