import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { imageBase64, mimeType = 'image/jpeg', menuCatalog = [] } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: 'imageBase64 required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const catalogList = Array.isArray(menuCatalog) ? menuCatalog : [];
    const menuBlock = catalogList.length
      ? catalogList.join('\n')
      : 'All American Cheeseburger, Peri-Peri Chicken Burger, Death by Chocolate Cake, Iced Latte';

    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `You are a precision OCR engine for Truffles restaurant receipts (Bangalore).

CRITICAL RULES — READ CAREFULLY:
1. Copy item names EXACTLY as printed on the bill. Character-for-character.
2. Do NOT shorten, rename, paraphrase, or "correct" dish names.
3. If the bill says "All American Cheeseburger", output exactly "All American Cheeseburger".
4. Do NOT merge lines. Each line item is separate.
5. Extract quantity, unit price, subtotal, GST, and grand total when visible.
6. Prices in INR integers (no ₹ symbol in JSON).

OFFICIAL MENU (for spelling reference ONLY — still prefer bill text):
${menuBlock}

Return ONLY valid JSON:
{
  "items": [{"name": "exact text from bill", "qty": 1, "price": 250}],
  "subtotal": 0,
  "gst": 0,
  "total": 0,
  "paymentMethod": "upi"
}

qty defaults to 1. paymentMethod: upi|card|cash|swiggy|zomato`,
              },
              {
                type: 'image_url',
                image_url: { url: `data:${mimeType};base64,${imageBase64}` },
              },
            ],
          },
        ],
        max_tokens: 2048,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AI gateway ${res.status}: ${text}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Could not parse OCR response');

    const parsed = JSON.parse(jsonMatch[0]);
    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
