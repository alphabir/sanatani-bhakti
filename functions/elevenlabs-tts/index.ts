// InsForge Edge Function: elevenlabs-tts
// Securely proxies text-to-speech requests to ElevenLabs using the backend secret ELEVENLABS_API_KEY
declare const Deno: any;

export default async function(req: Request): Promise<Response> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    let body: any = {};
    if (req.method === "POST") {
      body = await req.json().catch(() => ({}));
    } else {
      const url = new URL(req.url);
      body = {
        text: url.searchParams.get("text"),
        voice_id: url.searchParams.get("voice_id"),
      };
    }

    const text = (body.text || "").trim();
    if (!text) {
      return new Response(
        JSON.stringify({ error: "Missing 'text' parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = typeof Deno !== "undefined" ? Deno.env.get("ELEVENLABS_API_KEY") : null;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "ELEVENLABS_API_KEY secret is not configured in backend" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    // Voice ID: defaults to 'pNInz6obpgDQGcFmaJgB' (Adam / Deep Vedic Recitation)
    const voiceId = body.voice_id || "pNInz6obpgDQGcFmaJgB";
    const modelId = body.model_id || "eleven_multilingual_v2";

    const elevenResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability: 0.65,
          similarity_boost: 0.8,
          style: 0.2,
          use_speaker_boost: true,
        },
      }),
    });

    if (!elevenResponse.ok) {
      const errText = await elevenResponse.text().catch(() => "");
      return new Response(
        JSON.stringify({ error: `ElevenLabs error: ${elevenResponse.status}`, details: errText }),
        { status: elevenResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const arrayBuffer = await elevenResponse.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Convert to binary string chunk by chunk to avoid stack overflow
    let binary = "";
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, chunk as any);
    }
    const base64 = btoa(binary);

    return new Response(
      JSON.stringify({
        format: "mp3",
        byteLength: bytes.length,
        audioBase64: base64,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}
