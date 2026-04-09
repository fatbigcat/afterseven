import "@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createServiceClient } from "../_shared/supabase.ts";

function generateReservationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "AS7-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { full_name, email, party_size } = await req.json();

    // Validate input
    if (!full_name || typeof full_name !== "string" || full_name.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: "Full name is required (min 2 characters)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!email || !isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: "A valid email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!party_size || typeof party_size !== "number" || party_size < 1 || party_size > 10) {
      return new Response(
        JSON.stringify({ error: "Party size must be between 1 and 10" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createServiceClient();

    // Fetch active event
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("is_active", true)
      .single();

    if (eventError || !event) {
      return new Response(
        JSON.stringify({ error: "No active event found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate unique reservation code
    const reservationCode = generateReservationCode();

    // Call atomic reserve_spots function
    const { data: reservationId, error: reserveError } = await supabase.rpc(
      "reserve_spots",
      {
        p_event_id: event.id,
        p_full_name: full_name.trim(),
        p_email: email.trim().toLowerCase(),
        p_party_size: party_size,
        p_reservation_code: reservationCode,
      }
    );

    if (reserveError) {
      if (reserveError.message.includes("Not enough spots")) {
        return new Response(
          JSON.stringify({ error: "Not enough spots remaining" }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw reserveError;
    }

    // Send confirmation email via Resend
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      try {
        const eventDate = new Date(event.event_date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });

        const fromAddress = Deno.env.get("RESEND_FROM_ADDRESS") || "Afterseven <onboarding@resend.dev>";

        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [email.trim().toLowerCase()],
            subject: `Your reservation is confirmed — ${event.title}`,
            html: `
              <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0a0a; color: #f0ede6; padding: 48px 32px;">
                <h1 style="font-size: 28px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 32px; border-bottom: 1px solid #333; padding-bottom: 24px;">
                  AFTERSEVEN
                </h1>
                <p style="font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #999; margin: 0 0 8px;">Reservation Confirmed</p>
                <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 24px;">${event.title}</h2>
                <div style="border: 1px solid #333; padding: 20px; margin: 0 0 24px;">
                  <p style="margin: 0 0 12px;"><strong>Date:</strong> ${eventDate}</p>
                  <p style="margin: 0 0 12px;"><strong>Guest${party_size > 1 ? "s" : ""}:</strong> ${party_size}</p>
                  <p style="margin: 0;"><strong>Code:</strong> <span style="font-family: monospace; font-size: 18px; letter-spacing: 2px;">${reservationCode}</span></p>
                </div>
                <p style="font-size: 13px; color: #666; margin: 0;">Present this code at the door. See you after seven.</p>
              </div>
            `,
          }),
        });

        const emailResBody = await emailRes.text();
        if (!emailRes.ok) {
          console.error(`Resend API error (${emailRes.status}):`, emailResBody);
        } else {
          console.log("Confirmation email sent:", emailResBody);
        }
      } catch (emailErr) {
        console.error("Email send failed:", emailErr);
        // Don't fail the reservation if email fails
      }
    } else {
      console.warn("RESEND_API_KEY not set — skipping confirmation email");
    }

    return new Response(
      JSON.stringify({
        success: true,
        reservation_code: reservationCode,
        reservation_id: reservationId,
        event_title: event.title,
        event_date: event.event_date,
        party_size: party_size,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("create-reservation error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
