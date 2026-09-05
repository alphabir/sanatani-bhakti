// InsForge Edge Function: elevenlabs-tts
//
// Phase 0 lockdown. Before this, the function ran for anyone who knew the URL,
// with no Authorization header at all, and passed caller-chosen text, voice and
// model straight to a paid API. Now:
//   1. a real signed-in user is required (the anon key is explicitly rejected),
//   2. only the app's own mantras can be synthesised — the client sends an id,
//      never text,
//   3. voice and model are fixed here,
//   4. a server-owned quota is consumed atomically before the paid call and
//      released if that call fails — nobody is charged for silence.
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

// The only texts this function will ever send to ElevenLabs, keyed by the ids in
// src/data/mantras.ts. Keep the two in step when a mantra is added.
const MANTRAS: Record<string, string> = {
  "gayatri": "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥",
  "mahamrityunjaya": "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय माऽमृतात् ॥",
  "hanuman-beej": "ॐ हं हनुमते नमः ॥",
  "ganesh": "ॐ गं गणपतये नमः ॥",
  "durga": "ॐ दुं दुर्गायै नमः ॥",
  "lakshmi": "ॐ श्रीं महालक्ष्म्यै नमः ॥",
  "krishna": "ॐ नमो भगवते वासुदेवाय ॥",
  "ram": "ॐ श्री रामाय नमः ॥",
  "shiv-panchakshar": "ॐ नमः शिवाय ॥",
  "saraswati": "ॐ ऐं सरस्वत्यै नमः ॥",
  "shani": "ॐ प्राँ प्रीं प्रौं सः शनैश्चराय नमः ॥",
  "vishnu-sahasranama-opening": "शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम् । प्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये ॥",
};

// Fixed server-side. The client used to be able to pick the most expensive
// voice and model; it cannot any more.
const VOICE_ID = "pNInz6obpgDQGcFmaJgB"; // Adam — deep Vedic recitation
const MODEL_ID = "eleven_multilingual_v2";

export default async function (req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return json(405, { error: "POST only" });

  // 1. Identity. The SDK always sends *something* in Authorization — the anon
  //    key when nobody is signed in — so "header present" is not "user present".
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  if (!token || token.startsWith("anon_")) {
    return json(401, { error: "Sign in required" });
  }

  const client = createClient({
    baseUrl: Deno.env.get("INSFORGE_BASE_URL"),
    accessToken: token,
  });
  const { data: me } = await client.auth.getCurrentUser();
  if (!me?.user?.id) return json(401, { error: "Sign in required" });

  // 2. Input — a known mantra id, nothing else.
  const body = await req.json().catch(() => ({}));
  const mantraId = String(body?.mantra_id ?? "");
  const text = MANTRAS[mantraId];
  if (!text) return json(400, { error: "Unknown mantra_id" });

  // 3. Quota — guest 3 lifetime, member 20/day (India time). Runs as the user, so
  //    RLS + the SECURITY DEFINER RPC decide; this function holds no admin key.
  const { data: q, error: qErr } = await client.database.rpc("consume_quota", { p_kind: "tts" });
  const quota = Array.isArray(q) ? q[0] : q;
  if (qErr || !quota) return json(500, { error: "Quota check failed" });
  if (!quota.allowed) {
    return json(429, {
      error: quota.is_guest
        ? "Free recitations used — sign in for more"
        : "Daily recitation limit reached",
      is_guest: quota.is_guest,
      remaining: 0,
    });
  }

  const release = () => client.database.rpc("release_quota", { p_kind: "tts" }).catch(() => {});

  // 4. Synthesise. Any failure gives the unit back.
  const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
  if (!apiKey) {
    await release();
    return json(500, { error: "TTS is not configured" });
  }

  try {
    const eleven = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: "POST",
      headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.65,
          similarity_boost: 0.8,
          style: 0.2,
          use_speaker_boost: true,
        },
      }),
    });

    if (!eleven.ok) {
      await release();
      return json(502, { error: `ElevenLabs error: ${eleven.status}` });
    }

    const bytes = new Uint8Array(await eleven.arrayBuffer());
    // Chunked so a long recitation cannot overflow the argument list.
    let binary = "";
    for (let i = 0; i < bytes.length; i += 8192) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192) as any);
    }

    return json(200, {
      format: "mp3",
      byteLength: bytes.length,
      audioBase64: btoa(binary),
      remaining: quota.remaining,
      is_guest: quota.is_guest,
    });
  } catch (err: any) {
    await release();
    return json(500, { error: err?.message || "TTS failed" });
  }
}
