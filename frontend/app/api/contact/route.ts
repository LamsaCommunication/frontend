import { NextResponse, type NextRequest } from "next/server";
import {
  resend,
  emailConfig,
  buildStudioEmail,
  buildAutoReplyEmail,
} from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  fullName?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  website?: string; // honeypot
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+0-9\s().-]{6,30}$/;

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

const rateBucket = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateBucket.get(ip);

  if (!entry || entry.resetAt < now) {
    rateBucket.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) return false;

  entry.count += 1;
  return true;
}

function sanitizeString(value: unknown, max = 2000): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function POST(req: NextRequest) {
  let payload: Payload;
  try {
    payload = (await req.json()) as Payload;
  } catch {
    return NextResponse.json(
      { error: "Requête invalide." },
      { status: 400 }
    );
  }

  // Honeypot — bots fill this hidden field. Reject silently with 200 to not
  // hint that we detected them.
  if (payload.website && payload.website.trim().length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const fullName = sanitizeString(payload.fullName, 120);
  const email = sanitizeString(payload.email, 200).toLowerCase();
  const phone = sanitizeString(payload.phone, 40);
  const service = sanitizeString(payload.service, 120);
  const message = sanitizeString(payload.message, 4000);

  if (!fullName || !email || !phone || !message) {
    return NextResponse.json(
      { error: "Merci de remplir tous les champs obligatoires." },
      { status: 400 }
    );
  }
  if (fullName.length < 2) {
    return NextResponse.json(
      { error: "Veuillez saisir un nom valide." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Adresse email invalide." },
      { status: 400 }
    );
  }
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json(
      { error: "Numéro de téléphone invalide." },
      { status: 400 }
    );
  }
  if (message.length < 10) {
    return NextResponse.json(
      { error: "Votre message est trop court." },
      { status: 400 }
    );
  }

  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      {
        error:
          "Vous avez atteint la limite d'envois. Réessayez plus tard ou contactez-nous via WhatsApp.",
      },
      { status: 429 }
    );
  }

  if (!resend) {
    console.error("[contact] RESEND_API_KEY is not configured.");
    return NextResponse.json(
      {
        error:
          "Service indisponible pour le moment. Merci de nous contacter via WhatsApp.",
      },
      { status: 503 }
    );
  }

  const safePayload = { fullName, email, phone, service, message };

  try {
    const studio = buildStudioEmail(safePayload);
    const studioRes = await resend.emails.send({
      from: emailConfig.from,
      to: emailConfig.to,
      replyTo: email,
      subject: studio.subject,
      text: studio.text,
      html: studio.html,
    });

    if (studioRes.error) {
      console.error("[contact] resend studio send error:", studioRes.error);
      return NextResponse.json(
        {
          error:
            "Une erreur est survenue lors de l'envoi. Réessayez ou contactez-nous via WhatsApp.",
        },
        { status: 502 }
      );
    }

    // Auto-reply (best effort — never block on this)
    try {
      const reply = buildAutoReplyEmail(safePayload);
      await resend.emails.send({
        from: emailConfig.from,
        to: email,
        subject: reply.subject,
        text: reply.text,
        html: reply.html,
      });
    } catch (err) {
      console.warn("[contact] auto-reply failed:", err);
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[contact] unexpected error:", err);
    return NextResponse.json(
      {
        error:
          "Une erreur inattendue est survenue. Réessayez ou contactez-nous via WhatsApp.",
      },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json(
    { error: "Méthode non autorisée." },
    { status: 405, headers: { Allow: "POST" } }
  );
}
