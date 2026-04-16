import "@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createServiceClient } from "../_shared/supabase.ts";

type EmailStatus = "not_attempted" | "no_api_key" | "sent" | "error" | "exception";

type EmailResult = {
  status: EmailStatus;
  http_status: number | null;
  error: string | null;
  response_raw: string | null;
  response_json: unknown;
};

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

function validateReservationInput(payload: unknown): {
  full_name: string;
  email: string;
  party_size: number;
} | {
  error: string;
} {
  const input = payload as {
    full_name?: unknown;
    email?: unknown;
    party_size?: unknown;
  };

  if (!input.full_name || typeof input.full_name !== "string" || input.full_name.trim().length < 2) {
    return { error: "Full name is required (min 2 characters)" };
  }

  if (!input.email || typeof input.email !== "string" || !isValidEmail(input.email)) {
    return { error: "A valid email is required" };
  }

  if (!input.party_size || typeof input.party_size !== "number" || input.party_size < 1 || input.party_size > 10) {
    return { error: "Party size must be between 1 and 10" };
  }

  return {
    full_name: input.full_name,
    email: input.email,
    party_size: input.party_size,
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildEmailHtml(
  eventTitle: string,
  eventDateDisplay: string,
  partySize: number,
  reservationCode: string,
  customEmailContent: string | null,
): string {
  const customSection = customEmailContent && customEmailContent.trim().length > 0
    ? `
      <div style="border: 1px solid #333; padding: 20px; margin: 0 0 24px; background: #111;">
        <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #e3dfd7;">${escapeHtml(customEmailContent).replaceAll("\n", "<br>")}</p>
      </div>
    `
    : "";

  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0a0a; color: #f0ede6; padding: 48px 32px;">
      <h1 style="font-size: 28px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 32px; border-bottom: 1px solid #333; padding-bottom: 24px;">
        AFTERSEVEN
      </h1>
      <p style="font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #999; margin: 0 0 8px;">Reservation Confirmed</p>
      <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 24px;">${eventTitle}</h2>
      <div style="border: 1px solid #333; padding: 20px; margin: 0 0 24px;">
        <p style="margin: 0 0 12px;"><strong>Date:</strong> ${eventDateDisplay}</p>
        <p style="margin: 0 0 12px;"><strong>Guest${partySize > 1 ? "s" : ""}:</strong> ${partySize}</p>
        <p style="margin: 0;"><strong>Code:</strong> <span style="font-family: monospace; font-size: 18px; letter-spacing: 2px;">${reservationCode}</span></p>
      </div>
      ${customSection}
      <p style="font-size: 13px; color: #666; margin: 0;">Present this code at the door. See you after seven.</p>
    </div>
  `;
}

async function sendBrevoEmail(params: {
  apiKey: string;
  toEmail: string;
  toName: string;
  eventTitle: string;
  eventDateDisplay: string;
  partySize: number;
  reservationCode: string;
  customEmailContent: string | null;
}): Promise<EmailResult> {
  const sender = { name: "Grega @ Afterseven", email: "grega.guld@gmail.com" };
  const recipient = { email: params.toEmail, name: params.toName };
  const subject = `Your reservation is confirmed - ${params.eventTitle}`;
  const htmlContent = buildEmailHtml(
    params.eventTitle,
    params.eventDateDisplay,
    params.partySize,
    params.reservationCode,
    params.customEmailContent,
  );

  const payload = {
    sender,
    to: [recipient],
    subject,
    htmlContent,
  };

  console.log("[BREVO] Checkpoint 1: Prepared payload", {
    sender,
    recipient,
    subject,
  });

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": params.apiKey,
      },
      body: JSON.stringify(payload),
    });

    const responseRaw = await response.text();
    let responseJson: unknown = null;

    try {
      responseJson = responseRaw ? JSON.parse(responseRaw) : null;
    } catch {
      responseJson = null;
    }

    console.log("[BREVO] Checkpoint 2: API response", {
      status: response.status,
      ok: response.ok,
      responseRaw,
      responseJson,
    });

    if (!response.ok) {
      return {
        status: "error",
        http_status: response.status,
        error: `Brevo API error (${response.status})`,
        response_raw: responseRaw,
        response_json: responseJson,
      };
    }

    return {
      status: "sent",
      http_status: response.status,
      error: null,
      response_raw: responseRaw,
      response_json: responseJson,
    };
  } catch (err) {
    return {
      status: "exception",
      http_status: null,
      error: err instanceof Error ? err.message : String(err),
      response_raw: null,
      response_json: null,
    };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const validation = validateReservationInput(payload);

    if ("error" in validation) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { full_name, email, party_size } = validation;

    const supabase = createServiceClient();

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("is_active", true)
      .single();

    if (eventError || !event) {
      return new Response(
        JSON.stringify({ error: "No active event found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const reservationCode = generateReservationCode();

    const { data: reservationId, error: reserveError } = await supabase.rpc("reserve_spots", {
      p_event_id: event.id,
      p_full_name: full_name.trim(),
      p_email: email.trim().toLowerCase(),
      p_party_size: party_size,
      p_reservation_code: reservationCode,
    });

    if (reserveError) {
      if (reserveError.message.includes("Not enough spots")) {
        return new Response(
          JSON.stringify({ error: "Not enough spots remaining" }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      throw reserveError;
    }

    const brevoKey = Deno.env.get("BREVO_API_KEY");
    let emailResult: EmailResult = {
      status: "not_attempted",
      http_status: null,
      error: null,
      response_raw: null,
      response_json: null,
    };

    if (brevoKey) {
      const eventDateDisplay = new Date(event.event_date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });

      emailResult = await sendBrevoEmail({
        apiKey: brevoKey,
        toEmail: email.trim().toLowerCase(),
        toName: full_name.trim(),
        eventTitle: event.title,
        eventDateDisplay,
        partySize: party_size,
        reservationCode,
        customEmailContent: typeof event.email_content === "string" ? event.email_content : null,
      });

      if (emailResult.status === "sent") {
        console.log("[BREVO] Confirmation email sent", {
          reservationCode,
          httpStatus: emailResult.http_status,
          response: emailResult.response_json ?? emailResult.response_raw,
        });
      } else {
        console.error("[BREVO] Failed to send confirmation email", emailResult);
      }
    } else {
      emailResult = {
        status: "no_api_key",
        http_status: null,
        error: "BREVO_API_KEY not set",
        response_raw: null,
        response_json: null,
      };
      console.warn("[BREVO] BREVO_API_KEY not set");
    }

    return new Response(
      JSON.stringify({
        success: true,
        reservation_code: reservationCode,
        reservation_id: reservationId,
        event_title: event.title,
        event_date: event.event_date,
        party_size,
        email: emailResult,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("create-reservation error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
