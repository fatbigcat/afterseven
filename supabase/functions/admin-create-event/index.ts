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

    const { title, event_date, capacity } = await req.json();

    // Validate input
    if (!title || typeof title !== "string" || title.trim().length < 1) {
      return new Response(
        JSON.stringify({ error: "Event title is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!event_date || isNaN(Date.parse(event_date))) {
      return new Response(
        JSON.stringify({ error: "A valid event date is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!capacity || typeof capacity !== "number" || capacity < 1) {
      return new Response(
        JSON.stringify({ error: "Capacity must be at least 1" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Deactivate all current events
    const { error: deactivateError } = await supabase
      .from("events")
      .update({ is_active: false })
      .eq("is_active", true);

    if (deactivateError) {
      console.error("deactivate error:", deactivateError);
      return new Response(
        JSON.stringify({ error: deactivateError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create new active event
    const { data: event, error: insertError } = await supabase
      .from("events")
      .insert({
        title: title.trim(),
        event_date: event_date,
        capacity: capacity,
        spots_remaining: capacity,
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error("insert error:", insertError);
      return new Response(
        JSON.stringify({ error: insertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, event }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("admin-create-event error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
