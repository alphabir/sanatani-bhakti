// InsForge Edge Function: delete-account
//
// Google Play requires in-app account deletion for any app that lets users
// create an account. Phase 1B creates one for every install (the silent guest),
// so this is mandatory, not optional.
//
// A client cannot delete its own `auth.users` row, so this runs with the admin
// key — but only ever for the caller's *own* id, which is taken from the
// verified JWT and never from the request body. There is deliberately no
// "delete user X" parameter.
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

export default async function (req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return json(405, { error: "POST only" });

  // Identity. As elsewhere, the SDK always sends something in Authorization —
  // the anon key when nobody is signed in — so reject that explicitly.
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  if (!token || token.startsWith("anon_")) return json(401, { error: "Sign in required" });

  const baseUrl = Deno.env.get("INSFORGE_BASE_URL");
  const asUser = createClient({ baseUrl, accessToken: token });
  const { data: me } = await asUser.auth.getCurrentUser();
  const uid = me?.user?.id;
  if (!uid) return json(401, { error: "Sign in required" });

  // Admin client, used only to remove this one user's data.
  const apiKey = Deno.env.get("API_KEY");
  if (!apiKey) return json(500, { error: "Deletion is not configured" });
  const admin = createClient({ baseUrl, accessToken: apiKey });

  try {
    // Devotional data first. If the auth user were removed first and this
    // failed, the row would be orphaned with no owner able to reach it.
    // bhakti_user_stats.user_id is ON DELETE SET NULL, so it would survive.
    await admin.database.from("bhakti_user_stats").delete().eq("user_id", uid);

    // Per the InsForge auth REST API, deletion is a collection-level call taking
    // a userIds array — not DELETE /api/auth/users/{id}.
    const res = await fetch(`${baseUrl}/api/auth/users`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userIds: [uid] }),
    });
    if (!res.ok && res.status !== 404) {
      const detail = await res.text().catch(() => "");
      return json(502, {
        error: "Devotional data was deleted, but the account could not be removed.",
        detail: detail.slice(0, 200),
      });
    }

    return json(200, { deleted: true });
  } catch (err: any) {
    return json(500, { error: err?.message || "Deletion failed" });
  }
}
