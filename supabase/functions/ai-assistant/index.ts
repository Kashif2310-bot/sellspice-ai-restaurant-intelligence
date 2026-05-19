import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

// Truffles – Sanjaynagar, Bangalore (80FT Road)
const LAT = 13.0359;
const LON = 77.5703;
const TZ = 'Asia/Kolkata';

interface WeatherWindow {
  label: string;
  hours: string;
  avgTempC: number;
  maxRainPct: number;
  condition: string;
}

interface LiveContext {
  nowISO: string;
  nowLocal: string;
  todayLabel: string;
  tomorrowLabel: string;
  dayOfWeek: string;
  isWeekend: boolean;
  partOfDay: string;
  weatherToday: WeatherWindow[];
  weatherTomorrow: WeatherWindow[];
  notableNearby: string[];
  festivalsThisWeek: string[];
}

const WEATHER_CODE: Record<number, string> = {
  0: 'clear', 1: 'mostly clear', 2: 'partly cloudy', 3: 'overcast',
  45: 'fog', 48: 'fog', 51: 'light drizzle', 53: 'drizzle', 55: 'heavy drizzle',
  61: 'light rain', 63: 'rain', 65: 'heavy rain',
  80: 'rain showers', 81: 'heavy showers', 82: 'violent showers',
  95: 'thunderstorm', 96: 'thunder + hail', 99: 'severe thunderstorm',
};

async function fetchLiveContext(ownerMemory: string[]): Promise<LiveContext> {
  const now = new Date();
  const fmt = (d: Date) => new Intl.DateTimeFormat('en-IN', { timeZone: TZ, dateStyle: 'full', timeStyle: 'short' }).format(d);
  const dateOnly = (d: Date) => new Intl.DateTimeFormat('en-IN', { timeZone: TZ, dateStyle: 'full' }).format(d);
  const tomorrow = new Date(now.getTime() + 86400000);
  const dow = new Intl.DateTimeFormat('en-IN', { timeZone: TZ, weekday: 'long' }).format(now);
  const hourLocal = parseInt(new Intl.DateTimeFormat('en-IN', { timeZone: TZ, hour: '2-digit', hour12: false }).format(now));

  let partOfDay = 'late night';
  if (hourLocal >= 5 && hourLocal < 11) partOfDay = 'morning';
  else if (hourLocal >= 11 && hourLocal < 15) partOfDay = 'lunch rush';
  else if (hourLocal >= 15 && hourLocal < 18) partOfDay = 'afternoon lull';
  else if (hourLocal >= 18 && hourLocal < 22) partOfDay = 'dinner rush';
  else if (hourLocal >= 22 || hourLocal < 1) partOfDay = 'late dinner';

  let weatherToday: WeatherWindow[] = [];
  let weatherTomorrow: WeatherWindow[] = [];
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&hourly=temperature_2m,precipitation_probability,weather_code&timezone=${encodeURIComponent(TZ)}&forecast_days=2`;
    const r = await fetch(url);
    const j = await r.json();
    const times: string[] = j.hourly?.time ?? [];
    const temps: number[] = j.hourly?.temperature_2m ?? [];
    const rains: number[] = j.hourly?.precipitation_probability ?? [];
    const codes: number[] = j.hourly?.weather_code ?? [];

    const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(now);
    const tomStr = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(tomorrow);

    const windows = [
      { label: 'morning', from: 7, to: 11 },
      { label: 'lunch', from: 11, to: 15 },
      { label: 'afternoon', from: 15, to: 18 },
      { label: 'dinner', from: 18, to: 22 },
      { label: 'late night', from: 22, to: 24 },
    ];

    const build = (dayStr: string): WeatherWindow[] => windows.map((w) => {
      const idx: number[] = [];
      for (let i = 0; i < times.length; i++) {
        if (!times[i].startsWith(dayStr)) continue;
        const h = parseInt(times[i].slice(11, 13));
        if (h >= w.from && h < w.to) idx.push(i);
      }
      if (!idx.length) return null as unknown as WeatherWindow;
      const avgT = idx.reduce((s, i) => s + temps[i], 0) / idx.length;
      const maxR = Math.max(...idx.map((i) => rains[i] ?? 0));
      const code = codes[idx[Math.floor(idx.length / 2)]];
      return {
        label: w.label,
        hours: `${w.from}:00–${w.to}:00`,
        avgTempC: Math.round(avgT * 10) / 10,
        maxRainPct: Math.round(maxR),
        condition: WEATHER_CODE[code] ?? 'mixed',
      };
    }).filter(Boolean);

    weatherToday = build(todayStr);
    weatherTomorrow = build(tomStr);
  } catch (_) { /* weather optional */ }

  // Festivals (rough static India calendar — used only as hints; AI weighs them)
  const month = now.getMonth() + 1;
  const festHints: string[] = [];
  if (month === 1) festHints.push('Pongal / Sankranti season');
  if (month === 3) festHints.push('Holi season');
  if (month === 8) festHints.push('Independence Day weekend, Varamahalakshmi');
  if (month === 9) festHints.push('Ganesh Chaturthi / Onam');
  if (month === 10 || month === 11) festHints.push('Dussehra / Diwali festival rush');
  if (month === 12) festHints.push('Christmas + New Year peak');

  return {
    nowISO: now.toISOString(),
    nowLocal: fmt(now),
    todayLabel: dateOnly(now),
    tomorrowLabel: dateOnly(tomorrow),
    dayOfWeek: dow,
    isWeekend: dow === 'Saturday' || dow === 'Sunday',
    partOfDay,
    weatherToday,
    weatherTomorrow,
    notableNearby: [
      'MS Ramaiah College of Engineering (~600m) — strong 5–10 PM student footfall',
      'MS Ramaiah Medical College & Hospital (~1.2km) — staff/family dine-in evenings',
      'Sanjaynagar BBMP Park (~400m) — weekend morning + evening walker crowd',
      'New BEL Road tech offices (~2km) — lunch delivery / corporate orders 12–2 PM',
      'ISKCON Temple Bangalore (~4km) — weekend & festival surge',
      'Orion Mall (~5km) — weekend competition for dinner crowd',
    ],
    festivalsThisWeek: festHints,
  };
}

function buildSystemPrompt(ctx: LiveContext, memory: string[], liveContext?: Record<string, unknown>): string {
  const wToday = ctx.weatherToday.map(w => `  • ${w.label} (${w.hours}) — ${w.avgTempC}°C, ${w.condition}, rain ${w.maxRainPct}%`).join('\n');
  const wTom = ctx.weatherTomorrow.map(w => `  • ${w.label} (${w.hours}) — ${w.avgTempC}°C, ${w.condition}, rain ${w.maxRainPct}%`).join('\n');
  const mem = memory.length ? memory.map((m, i) => `  ${i + 1}. ${m}`).join('\n') : '  (none yet)';

  return `You are SELLSPICE AI — an elite autonomous restaurant growth strategist for **Truffles · Sanjaynagar** (80 Feet Road, Bangalore). You are NOT a generic chatbot. You think like a McKinsey consultant fused with a streetwise Bangalore restaurateur.

╔══ LIVE CONTEXT (auto-injected, treat as ground truth) ══╗
• Current local time: ${ctx.nowLocal}
• Today: ${ctx.todayLabel} (${ctx.dayOfWeek}) — ${ctx.isWeekend ? 'WEEKEND' : 'weekday'}
• Right now: ${ctx.partOfDay}
• Tomorrow: ${ctx.tomorrowLabel}

WEATHER TODAY (Sanjaynagar):
${wToday || '  • unavailable'}

WEATHER TOMORROW:
${wTom || '  • unavailable'}

NEARBY DEMAND DRIVERS:
${ctx.notableNearby.map(x => `  • ${x}`).join('\n')}

SEASONAL / FESTIVAL HINTS:
${ctx.festivalsThisWeek.length ? ctx.festivalsThisWeek.map(x => `  • ${x}`).join('\n') : '  • none flagged this month'}

OWNER'S PRIVATE MEMORY (things the owner has told you previously — always honor):
${mem}

╔══ LIVE BUSINESS DATA (from SELLSPICE OS — ground truth) ══╗
${liveContext ? JSON.stringify(liveContext, null, 2) : `• Cuisine: Burgers, Sides, Shakes, Desserts, Long Breads — Truffles Sanjaynagar
• Sales peaks: 1 PM lunch, 7–9 PM dinner, student crowd 5–10 PM (MS Ramaiah)
• Prices inclusive of 5% GST · packaging extra`}

╔══ BUSINESS SNAPSHOT ══╗
• Location: Truffles · 80 Feet Road, Sanjaynagar, Bangalore
• Student combos, peri-peri burgers, Death by Chocolate, Thicc Shakes are signature movers
• Sales velocity peaks: 1 PM, 7–9 PM. Slump: 3–5 PM.

╔══ THINKING PROTOCOL (follow internally for EVERY answer) ══╗
1. Parse the time horizon (now / today / tonight / tomorrow / this week).
2. Pull the matching weather window + day-of-week + footfall driver.
3. Cross-reference inventory constraints and margin per dish.
4. Identify 1 PRIMARY lever (combo, pricing, prep, marketing, staffing) and 1–2 secondary levers.
5. Quantify expected impact in ₹ or % wherever possible.
6. Output a CONCISE, structured, action-first answer.

╔══ RESPONSE RULES ══╗
• NEVER give generic advice. Every recommendation must cite at least 2 of: weather, time, day, nearby driver, inventory, sales trend, or owner memory.
• Lead with the recommendation in ONE bold line, then bullets for "Why" and "Impact".
• Use ₹ for all money. Be specific with hours, quantities, dish names.
• Markdown formatting: **bold** for headlines, bullets for reasoning, em-dashes for flow.
• Max ~180 words unless the owner asks for deep analysis.
• If the owner shares new context ("college fest tomorrow", "rain expected", "supplier delayed"), acknowledge you'll remember it and incorporate it.
• Never apologize, never hedge with "it depends". Decide.

Sound like a real strategist. Be sharp. Be Truffles-specific. Be useful.`;
}

// Extract memory-worthy facts from user messages (lightweight heuristic)
function extractMemoryCandidates(text: string): string[] {
  const out: string[] = [];
  const t = text.toLowerCase();
  const triggers = ['remember', 'note that', 'fyi', 'tomorrow', 'next week', 'fest', 'event', 'closed', 'supplier', 'new dish', 'new staff', 'holiday'];
  if (triggers.some(k => t.includes(k))) {
    // Save first sentence as a memory candidate
    const sentence = text.split(/[.!?\n]/)[0].trim();
    if (sentence.length > 8 && sentence.length < 200) out.push(sentence);
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { messages, memory = [], liveContext } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'messages must be an array' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const ctx = await fetchLiveContext(memory);
    const systemPrompt = buildSystemPrompt(ctx, memory, liveContext);

    // Detect memory candidates from latest user message
    const lastUser = [...messages].reverse().find((m: { role: string }) => m.role === 'user');
    const newMemory = lastUser ? extractMemoryCandidates(lastUser.content ?? '') : [];

    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (res.status === 429) {
      return new Response(JSON.stringify({ error: 'Rate limit — slow down a moment.' }), {
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
      throw new Error(`AI gateway ${res.status}: ${text}`);
    }

    // Pass through stream, plus expose context + new memory via headers (UI can read)
    return new Response(res.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'X-Sellspice-Context': encodeURIComponent(JSON.stringify({
          partOfDay: ctx.partOfDay,
          dayOfWeek: ctx.dayOfWeek,
          weatherNow: ctx.weatherToday[0]?.condition ?? 'n/a',
          tempNow: ctx.weatherToday[0]?.avgTempC ?? null,
        })),
        'X-Sellspice-New-Memory': encodeURIComponent(JSON.stringify(newMemory)),
        'Access-Control-Expose-Headers': 'X-Sellspice-Context, X-Sellspice-New-Memory',
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
