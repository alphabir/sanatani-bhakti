// InsForge Edge Function: gemini-astrologer
//
// Phase 0 lockdown. Before this, an empty anonymous POST returned a full paid
// Gemini reading, and when Gemini failed the function fabricated a reading from
// a template and presented it as the answer. Now:
//   1. a real signed-in user is required (the anon key is explicitly rejected),
//   2. a server-owned quota is consumed before the paid call — guest 3 lifetime,
//      member 10/day — and released if Gemini fails,
//   3. no fabricated fallback: if Gemini cannot answer, the caller gets 503 and
//      is not charged. The client shows its own "unavailable" state.
import { createClient } from "npm:@insforge/sdk";
declare const Deno: any;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

function getRashiLord(signNameOrId: string | number): string {
  const lords = [
    "Mars (Mangal)", "Venus (Shukra)", "Mercury (Budha)", "Moon (Chandra)",
    "Sun (Surya)", "Mercury (Budha)", "Venus (Shukra)", "Mars (Mangal)",
    "Jupiter (Guru)", "Saturn (Shani)", "Saturn (Shani)", "Jupiter (Guru)",
  ];
  if (typeof signNameOrId === "number") {
    return lords[(signNameOrId - 1 + 12) % 12] || "Mars (Mangal)";
  }
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
  ];
  const sanskrit = [
    "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
    "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena",
  ];
  const sStr = String(signNameOrId).toLowerCase();
  let idx = signs.findIndex((s) => s.toLowerCase() === sStr);
  if (idx === -1) idx = sanskrit.findIndex((s) => s.toLowerCase() === sStr);
  return idx !== -1 ? lords[idx] : "Jupiter (Guru)";
}

export default async function (req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return json(405, { error: "POST only" });

  // 1. Identity — a real user, not the anon key the SDK sends for guests-of-nobody.
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  if (!token || token.startsWith("anon_")) return json(401, { error: "Sign in required" });

  const client = createClient({
    baseUrl: Deno.env.get("INSFORGE_BASE_URL"),
    accessToken: token,
  });
  const { data: me } = await client.auth.getCurrentUser();
  if (!me?.user?.id) return json(401, { error: "Sign in required" });

  // 2. Input.
  const body = await req.json().catch(() => ({}));
  const message = String(body?.message ?? "").trim();
  if (!message) return json(400, { error: "Missing 'message'" });
  if (message.length > 600) return json(400, { error: "Question too long" });
  // The app sends session_id; older callers sent sessionId. Accept both.
  const sessionId = body?.session_id ?? body?.sessionId;
  const kundliContext = body?.kundliContext;

  // 3. Quota — before the paid call, atomically, as the user.
  const { data: q, error: qErr } = await client.database.rpc("consume_quota", { p_kind: "astro" });
  const quota = Array.isArray(q) ? q[0] : q;
  if (qErr || !quota) return json(500, { error: "Quota check failed" });
  if (!quota.allowed) {
    return json(429, {
      error: quota.is_guest
        ? "Free consultations used — sign in for more"
        : "Daily consultation limit reached",
      is_guest: quota.is_guest,
      remaining: 0,
    });
  }
  const release = () => client.database.rpc("release_quota", { p_kind: "astro" }).catch(() => {});

  const geminiApiKey = Deno.env.get("GEMINI_API_KEY") || "";
  if (!geminiApiKey) {
    await release();
    return json(503, { error: "Astrologer is not configured" });
  }

  // 4. Build the prompt from whatever chart context the client supplied.
  const userName = kundliContext?.user_name || "Seeker";

  let lagnaName = "Aries";
  let lagnaSanskrit = "Mesha";
  let lagnaDms = "14° 22'";
  if (typeof kundliContext?.lagna === "string") {
    lagnaName = kundliContext.lagna;
    lagnaSanskrit = kundliContext.lagna.split(" ")[0];
  } else if (kundliContext?.lagna) {
    lagnaName = kundliContext.lagna.rashi_name || "Aries";
    lagnaSanskrit = kundliContext.lagna.rashi_sanskrit || lagnaName;
    lagnaDms = kundliContext.lagna.dms || "14° 22'";
  }

  let moonName = "Scorpio";
  let moonSanskrit = "Vrishchika";
  if (typeof kundliContext?.moon_sign === "string") {
    moonName = kundliContext.moon_sign;
    moonSanskrit = kundliContext.moon_sign.split(" ")[0];
  } else if (kundliContext?.moon_sign) {
    moonName = kundliContext.moon_sign.rashi_name || "Scorpio";
    moonSanskrit = kundliContext.moon_sign.rashi_sanskrit || moonName;
  }

  let sunName = "Taurus";
  let sunSanskrit = "Vrishabha";
  if (typeof kundliContext?.sun_sign === "string") {
    sunName = kundliContext.sun_sign;
    sunSanskrit = kundliContext.sun_sign.split(" ")[0];
  } else if (kundliContext?.sun_sign) {
    sunName = kundliContext.sun_sign.rashi_name || "Taurus";
    sunSanskrit = kundliContext.sun_sign.rashi_sanskrit || sunName;
  }

  const nakName = kundliContext?.birth_nakshatra?.name || kundliContext?.nakshatra || "Jyeshtha";
  const nakPada = kundliContext?.birth_nakshatra?.pada || 1;
  const mahadasha = kundliContext?.current_mahadasha || kundliContext?.mahadasha || "Venus";
  const antardasha = kundliContext?.current_antardasha || kundliContext?.antardasha || "Jupiter";
  const doshas = kundliContext?.doshas || {};
  const planets = kundliContext?.planets || [];
  const houses = kundliContext?.houses || [];
  const lagnaLord = getRashiLord(lagnaName);

  const houseSummary = houses.map((h: any) => {
    const pList = (h.planets || []).join(", ") || "None";
    return `  • House ${h.house_num} (${h.sign_sanskrit || h.sign_name}): Planets [${pList}] — Significations: ${h.significations || ""}`;
  }).join("\n");

  const planetSummary = planets.map((p: any) =>
    `  • ${p.name}: in House ${p.house} (${p.rashi_sanskrit || p.rashi_name} at ${p.dms || ""}) in ${p.nakshatra_name || ""} (Pada ${p.nakshatra_pada || 1}) [Dignity: ${p.dignity || "Neutral"}]`
  ).join("\n");

  const systemPrompt = `You are Acharya JyotishAI, a revered, compassionate, and deeply learned Vedic Astrologer (Pandit / Jyotish Acharya) providing personal consultation.

### SACRED PRINCIPLES & ASTROLOGICAL RULES:
1. **STRICT CHART FIDELITY (NO HALLUCINATIONS):**
   - You MUST ONLY use the seeker's real computed chart details provided below.
   - NEVER contradict the seeker's Lagna, Moon sign, Nakshatra, House lords, or planetary placements.
   - The seeker's Lagna is ${lagnaSanskrit} (${lagnaName}). Their 1st House Lord is ${lagnaLord}.
   - The seeker's Moon Sign is ${moonSanskrit} (${moonName}) in ${nakName} Nakshatra (Pada ${nakPada}).
   - Their active Mahadasha is ${mahadasha} and Antardasha is ${antardasha}.

2. **QUERY-SPECIFIC VEDIC BHAVA & GRAHA ANALYSIS:**
   Analyze the specific Vedic houses and lords corresponding to the seeker's question:
   - **Marriage / Love / Relationships / Shaadi / Vivah:** Focus on **7th House (Kalatra Bhava)**, 7th Lord, 2nd House (family), 4th House (domestic harmony), natural Karakas **Venus (Shukra)** and **Jupiter (Guru)**, Manglik status, and timing in current Dasha.
   - **Career / Job / Business / Naukri / Promotion / Vyapar:** Focus on **10th House (Karma Bhava)**, 10th Lord, 6th House (Daily service/competition), 11th House (Labha/Gains), **Saturn (Shani - Karma Karaka)**, **Sun (Surya - authority)**, and **Mercury (Budha - intellect/trade)**.
   - **Wealth / Money / Finance / Dhan / Investment:** Focus on **2nd House (Dhana Bhava)**, **11th House (Labha Bhava)**, 9th House (Bhagya), 5th House (Purva Punya Lakshmi Sthana), **Jupiter (Brihaspati)**, and active Dhana Yogas.
   - **Health / Vitality / Rog / Anxiety / Mental Peace:** Focus on **1st House / Lagna Lord (Tanu Bhava/Vitality)**, **6th House (Roga Bhava)**, **8th House (Ayur Bhava)**, **Moon (Manas/Mind)**, and **Sun (Atma/Prana)**.
   - **Education / Higher Wisdom / Spiritual Path / Moksha:** Focus on **5th House (Buddhi)**, **9th House (Dharma)**, and **12th House (Moksha)**.

3. **NATURAL, COMPASSIONATE VEDIC CONVERSATIONAL STYLE:**
   - Speak warmly like a respected family Acharya / Pandit ji speaking directly to the seeker in engaging Indian English (with heartfelt Sanskrit terms).
   - DO NOT use rigid robotic numbered headings like "1. Planetary Strengths" or "2. Current Timing". Write in fluid, authentic, beautifully phrased paragraphs.
   - Address the seeker respectfully as "${userName} ji".
   - Ground your reading in their exact chart facts: mention the specific House numbers, sign names, planetary dignities, and active Mahadasha timing.
   - End with 2–3 bespoke, actionable Vedic Upayas (Remedies) — such as a daily mantra with count & direction, a recommended gemstone/metal, and a specific act of Daan (charity) on a specific day of the week.

=== SEEKER'S EXACT VEDIC (SIDEREAL LAHIRI) KUNDLI PROFILE ===
Seeker Name: ${userName}
• Lagna (Ascendant / 1st House): ${lagnaSanskrit} (${lagnaName}) at ${lagnaDms} — Lagna Lord: ${lagnaLord}
• Moon Sign (Chandra Rashi): ${moonSanskrit} (${moonName}) in ${nakName} Nakshatra (Pada ${nakPada})
• Sun Sign (Surya Rashi): ${sunSanskrit} (${sunName})
• Active Vimshottari Mahadasha: ${mahadasha} Mahadasha
• Active Antardasha: ${antardasha} Antardasha
• Manglik Dosha: ${doshas.manglik_severity || (doshas.is_manglik ? "Present" : "None")}
• Sade Sati Phase: ${doshas.sade_sati_status || "Not Active"}
• Key Yogas: ${(kundliContext?.yogas || []).map((y: any) => y.name).join(", ") || "Budhaditya Yoga, Gaj Kesari Yoga"}

All Planetary Placements & Dignities (Graha Spashta):
${planetSummary || "  • Grahas properly configured across houses."}

12 Houses (Bhavas) & Significations:
${houseSummary || "  • Bhavas 1 through 12 mapped to Sidereal signs."}
=============================================================

Seeker's Question: "${message}"`;

  // 5. Ask Gemini. Try a few models; the first that answers wins.
  const candidateModels = ["gemini-1.5-flash", "gemini-2.5-flash", "gemini-flash-latest", "gemini-1.5-pro"];
  let replyText = "";
  for (const model of candidateModels) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1200 },
          }),
        },
      );
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw && raw.trim().length > 0) {
          replyText = raw.trim();
          break;
        }
      }
    } catch (_) {
      // try the next model
    }
  }

  // 6. No answer → no charge, and no fabricated reading in its place.
  if (!replyText) {
    await release();
    return json(503, { error: "The astrologer is unavailable right now. Please try again shortly." });
  }

  return json(200, {
    reply: replyText,
    session_id: sessionId || `sess_${Date.now()}`,
    recommended_topics: [
      `How will ${mahadasha} Mahadasha affect my career & status?`,
      `What does the 7th House indicate about my life partner?`,
      `Which gemstone is most auspicious for my ${lagnaSanskrit} Lagna?`,
      `What are the best financial investment yogas in my chart?`,
    ],
    vedic_remedy_highlight: "Chant the Gayatri Mantra 27 times every morning facing East.",
    remaining: quota.remaining,
    is_guest: quota.is_guest,
  });
}
