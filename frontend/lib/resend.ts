import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

export const emailConfig = {
  to: process.env.CONTACT_EMAIL ?? "contact@lamsadz.com",
  from:
    process.env.RESEND_FROM_EMAIL ?? "Lamsa Communication <onboarding@resend.dev>",
  brand: "Lamsa Communication",
} as const;

type ContactPayload = {
  fullName: string;
  email: string;
  phone: string;
  service?: string;
  message: string;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export function buildStudioEmail(payload: ContactPayload) {
  const subject = `Nouvelle demande — ${payload.fullName}${
    payload.service ? ` · ${payload.service}` : ""
  }`;

  const text = [
    "Nouvelle demande reçue depuis le site Lamsa Communication.",
    "",
    `Nom complet : ${payload.fullName}`,
    `Email       : ${payload.email}`,
    `Téléphone   : ${payload.phone}`,
    `Service     : ${payload.service ?? "Non précisé"}`,
    "",
    "Message :",
    payload.message,
  ].join("\n");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; max-width:560px; margin:0 auto; padding:32px 24px; color:#141414; background:#F7F5F2;">
      <div style="background:#000; border-radius:16px; padding:24px 28px; color:#fff;">
        <div style="font-size:11px; letter-spacing:.2em; text-transform:uppercase; color:#E30613; font-weight:600;">Nouvelle demande</div>
        <h1 style="margin:8px 0 0; font-size:24px; line-height:1.2;">${escapeHtml(payload.fullName)}</h1>
        ${payload.service ? `<p style="margin:6px 0 0; font-size:13px; color:rgba(255,255,255,.7);">${escapeHtml(payload.service)}</p>` : ""}
      </div>

      <div style="background:#fff; border:1px solid #E8E5E0; border-radius:16px; padding:24px 28px; margin-top:16px;">
        <table style="width:100%; border-collapse:collapse; font-size:14px;">
          <tr>
            <td style="padding:8px 0; color:#5C5852; width:120px;">Email</td>
            <td style="padding:8px 0;"><a href="mailto:${escapeHtml(payload.email)}" style="color:#E30613; text-decoration:none;">${escapeHtml(payload.email)}</a></td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#5C5852;">Téléphone</td>
            <td style="padding:8px 0;"><a href="tel:${escapeHtml(payload.phone.replace(/\s/g, ""))}" style="color:#141414; text-decoration:none;">${escapeHtml(payload.phone)}</a></td>
          </tr>
        </table>

        <div style="margin-top:16px; padding-top:16px; border-top:1px solid #E8E5E0;">
          <div style="font-size:11px; letter-spacing:.15em; text-transform:uppercase; color:#5C5852; font-weight:600;">Message</div>
          <p style="margin:8px 0 0; white-space:pre-wrap; font-size:14px; line-height:1.6; color:#141414;">${escapeHtml(payload.message)}</p>
        </div>
      </div>

      <p style="margin:16px 0 0; font-size:12px; color:#A7A29A; text-align:center;">
        Envoyé depuis lamsadz.com
      </p>
    </div>
  `;

  return { subject, text, html };
}

export function buildAutoReplyEmail(payload: ContactPayload) {
  const subject = "Votre demande a bien été reçue — Lamsa Communication";

  const text = [
    `Bonjour ${payload.fullName},`,
    "",
    "Merci pour votre demande. Nous avons bien reçu votre message et l'équipe Lamsa Communication vous contactera très bientôt.",
    "",
    "Pour une réponse plus rapide, vous pouvez aussi nous joindre sur WhatsApp : https://wa.me/213554776283",
    "",
    "À très vite,",
    "Lamsa Communication",
    "C'est aussi simple que ça.",
  ].join("\n");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; max-width:560px; margin:0 auto; padding:32px 24px; color:#141414; background:#F7F5F2;">
      <div style="background:#fff; border:1px solid #E8E5E0; border-radius:16px; padding:32px 28px;">
        <div style="font-size:11px; letter-spacing:.2em; text-transform:uppercase; color:#E30613; font-weight:600;">Lamsa Communication</div>
        <h1 style="margin:12px 0 0; font-size:26px; line-height:1.2; color:#141414;">Merci, ${escapeHtml(payload.fullName)} !</h1>

        <p style="margin:20px 0 0; font-size:15px; line-height:1.7; color:#141414;">
          Votre demande a bien été reçue. Notre équipe l'étudie et vous reviendra avec une proposition adaptée dans les plus brefs délais.
        </p>

        <p style="margin:16px 0 0; font-size:15px; line-height:1.7; color:#141414;">
          Besoin d'une réponse plus rapide ? Joignez-nous directement sur WhatsApp :
        </p>

        <a href="https://wa.me/213554776283" style="display:inline-block; margin:20px 0 0; background:#E30613; color:#fff; text-decoration:none; font-weight:600; padding:12px 22px; border-radius:9999px; font-size:14px;">
          Discuter sur WhatsApp
        </a>

        <p style="margin:32px 0 0; font-style:italic; color:#E30613; font-size:18px;">
          « C'est aussi simple que ça »
        </p>
      </div>

      <p style="margin:16px 0 0; font-size:12px; color:#A7A29A; text-align:center;">
        Lamsa Communication · contact@lamsadz.com · +213 554 776 283
      </p>
    </div>
  `;

  return { subject, text, html };
}
