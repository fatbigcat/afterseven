import "@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createAuthClient, createServiceClient } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: { user }, error: authError } = await createAuthClient(authHeader).auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createServiceClient();

    // Fetch active event
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("is_active", true)
      .maybeSingle();

    if (eventError) {
      console.error("events query error:", eventError);
      return new Response(
        JSON.stringify({ error: eventError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let reservations: unknown[] = [];
    if (event) {
      const { data, error: resError } = await supabase
        .from("reservations")
        .select("*")
        .eq("event_id", event.id)
        .order("created_at", { ascending: false });
      if (resError) {
        console.error("reservations query error:", resError);
        return new Response(
          JSON.stringify({ error: resError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      reservations = data ?? [];
    }

    return new Response(
      JSON.stringify({ event: event ?? null, reservations }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("admin-get-dashboard error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
