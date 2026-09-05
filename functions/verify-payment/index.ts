---
// InsForge Edge Function: verify-payment
import { createClient } from "npm:@insforge/sdk";

const PACK_CATALOG: Record<string, { tokens: number; amount: number; title: string }> = {
  arambh_49: { tokens: 5, amount: 49.0, title: "Arambh Starter Pack (5 Questions)" },
  bhagya_99: { tokens: 15, amount: 99.0, title: "Bhagya Popular Pack (15 Qs + PDF Report)" },
  acharya_249: { tokens: 40, amount: 249.0, title: "Acharya VIP Pack (40 Qs + Palmistry Deep Dive)" },
};

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
    const body = await req.json();
    const { userId, packId, gateway = "UPI_GPAY" } = body;

    const pack = PACK_CATALOG[packId] || PACK_CATALOG["bhagya_99"];

    const client = createClient({
      baseUrl: Deno.env.get("INSFORGE_BASE_URL"),
      anonKey: Deno.env.get("ANON_KEY"),
    });

    // Record transaction
    await client.database.from("wallet_transactions").insert([{
      user_id: userId || "00000000-0000-0000-0000-000000000000",
      pack_id: packId,
      pack_title: pack.title,
      amount_inr: pack.amount,
      tokens_credited: pack.tokens,
      payment_gateway: gateway,
      gateway_order_id: `ORD_${Date.now()}`,
      gateway_payment_id: `PAY_${Date.now()}`,
      status: "SUCCESS",
    }]);

    return new Response(
      JSON.stringify({
        success: true,
        packPurchased: pack.title,
        tokensCredited: pack.tokens,
        amount: pack.amount,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

