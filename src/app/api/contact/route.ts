import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

// Backs the contact form in the Front Page's #contact-me channel (see the
// ContactForm component). Delivers submissions as email via Resend's REST
// API — plain fetch, no SDK dependency.
//
// Env vars:
//   RESEND_API_KEY     required — from https://resend.com/api-keys
//   CONTACT_TO_EMAIL   optional — defaults to Jorge's address below
//   CONTACT_FROM_EMAIL optional — must be a sender Resend accepts. The
//                      default onboarding@resend.dev works without any
//                      domain verification, but Resend only delivers it to
//                      the account owner's own inbox — which is exactly
//                      this form's use case. Swap in an address on a
//                      verified domain if that ever changes.
export const runtime = "nodejs";

const RESEND_URL = "https://api.resend.com/emails";
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "jorgemendez42994@gmail.com";
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

const MAX_EMAIL_LENGTH = 200;
const MAX_SUBJECT_LENGTH = 150;
const MAX_MESSAGE_LENGTH = 3000;

// Deliberately loose — real validation is the reply bouncing. This only
// catches obvious typos before an email goes out with a broken reply-to.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The contact form isn't configured yet — email Jorge directly instead." },
      { status: 500 }
    );
  }

  // Prefixed key so this shares the limiter's Map with the chat route
  // without sharing its bucket — chatting with GeoBot shouldn't eat into
  // someone's ability to send a contact message, or vice versa.
  const ip = getClientIp(req);
  if (!checkRateLimit(`contact:${ip}`).allowed) {
    return NextResponse.json(
      { error: "Too many messages — please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: a visually hidden "company" field humans never see. Bots that
  // fill every input give themselves away — answer with a fake success so
  // they don't learn anything, and send nothing.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!email || !EMAIL_PATTERN.test(email) || email.length > MAX_EMAIL_LENGTH) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (!subject || subject.length > MAX_SUBJECT_LENGTH) {
    return NextResponse.json(
      { error: `Subject is required (max ${MAX_SUBJECT_LENGTH} characters).` },
      { status: 400 }
    );
  }
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message is required (max ${MAX_MESSAGE_LENGTH} characters).` },
      { status: 400 }
    );
  }

  try {
    const resendResponse = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `[Portfolio] ${subject}`,
        text: `From: ${email}\n\n${message}`,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Resend error:", resendResponse.status, errorText);
      return NextResponse.json(
        { error: "Couldn't send your message right now — try again later, or email Jorge directly." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact handler error:", err);
    return NextResponse.json(
      { error: "Something went wrong sending your message." },
      { status: 500 }
    );
  }
}
