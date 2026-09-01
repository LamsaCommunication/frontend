"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2, AlertCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { site } from "@/lib/site";
import { useCatalogStore } from "@/lib/store/useCatalogStore";
import { WhatsAppIcon } from "@/components/icons/social-icons";
import { cn } from "@/lib/utils";

/* ── Types ───────────────────────────────────────────────────────────────── */

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  service: string;
  website: string; // honeypot
};

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  message: "",
  service: "",
  website: "",
};

type Status = "idle" | "loading" | "success" | "error";
type FormErrors = Partial<Record<"fullName" | "email" | "phone" | "message", string>>;

/* ── Validation ──────────────────────────────────────────────────────────── */

function validate(form: FormState, submitType: "email" | "whatsapp"): FormErrors {
  const errors: FormErrors = {};

  if (!form.fullName.trim()) {
    errors.fullName = "Merci de remplir ce champ.";
  } else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(form.fullName.trim())) {
    errors.fullName = "Nom invalide (lettres uniquement)";
  }

  if (!form.email.trim()) {
    errors.email = "Merci de remplir ce champ.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Veuillez entrer un email valide";
  }

  if (!form.phone.trim()) {
    if (submitType === "whatsapp") errors.phone = "Numéro requis pour WhatsApp";
  } else if (!/^[0-9]+$/.test(form.phone.trim())) {
    errors.phone = "Numéro invalide (chiffres uniquement)";
  }

  if (!form.message.trim()) {
    errors.message = "Merci de remplir ce champ.";
  }

  return errors;
}

/* ── Message formatters ──────────────────────────────────────────────────── */

function buildContactBlock(form: FormState): string {
  const lines: string[] = [];
  if (form.fullName.trim()) lines.push(`Nom & Entreprise : ${form.fullName.trim()}`);
  if (form.email.trim())    lines.push(`Email : ${form.email.trim()}`);
  lines.push(`Téléphone : ${form.phone.trim() || "Non renseigné"}`);
  lines.push(`Service : ${form.service.trim() || "Non précisé"}`);
  return lines.join("\n");
}

function buildWhatsAppText(form: FormState): string {
  const parts: string[] = [buildContactBlock(form)];
  if (form.message.trim()) parts.push("", form.message.trim());
  return parts.join("\n");
}


/* ── Section ─────────────────────────────────────────────────────────────── */

export function ContactSection() {
  const [form, setForm] = React.useState<FormState>(initialState);
  const [fieldErrors, setFieldErrors] = React.useState<FormErrors>({});
  const [status, setStatus] = React.useState<Status>("idle");
  const [errorMsg, setErrorMsg] = React.useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    let sanitized = value;
    if (name === "fullName") sanitized = value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
    if (name === "phone") sanitized = value.replace(/[^0-9]/g, "");
    setForm((f) => ({ ...f, [name]: sanitized }));
    if (name in (fieldErrors as object)) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof FormErrors];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validate(form, "email");
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "c3f9d5bc-db41-450a-b8c4-5179d087eb07",
          subject: `${form.fullName.trim()}${form.service ? ` · ${form.service}` : ""}`,
          name: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || "Non renseigné",
          service: form.service || "Non précisé",
          message: form.message.trim(),
          replyto: form.email.trim(),
          from_name: "Lamsa Communication",
        }),
      });

      const data = (await res.json()) as { success: boolean; message?: string };

      if (!data.success) {
        throw new Error(data.message ?? "Une erreur est survenue.");
      }

      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Impossible d'envoyer le message. Réessayez ou contactez-nous via WhatsApp.",
      );
    }
  };

  const whatsappPrefilled = React.useMemo(
    () =>
      `${site.whatsapp.link}?text=${encodeURIComponent(buildWhatsAppText(form))}`,
    [form],
  );

  const handleWhatsApp = () => {
    const errors = validate(form, "whatsapp");
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    window.open(whatsappPrefilled, "_blank", "noopener,noreferrer");
  };

  const taPH = form.service
    ? `Décrivez votre projet de ${form.service.toLowerCase()} (formats, quantités, délais…)`
    : "Décrivez brièvement votre besoin (formats, quantités, délais…)";

  return (
    <section
      id="contact"
      className="relative w-full scroll-mt-16 overflow-hidden pt-8 pb-20 md:pb-28 lg:pb-32 lg:scroll-mt-20"
      style={{
        background: [
          "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(227,6,19,0.03) 0%, transparent 60%)",
          "linear-gradient(180deg, #fdf8f8 0%, #ffffff 100%)",
        ].join(", "),
      }}
    >
      <Container as="div">
        {/* ── Section header ── */}
        <SectionHeader
          eyebrow="Contact"
          align="center"
          title={
            <>
              Parlons de votre prochain{" "}
              <span className="text-brand-red">projet</span>.
            </>
          }
          description="Envoyez-nous votre demande et nous vous répondons rapidement avec une proposition adaptée."
          className="mx-auto max-w-2xl"
        />

        {/* ── 5 / 7 grid ── */}
        <div className="mt-12 grid grid-cols-1 gap-10 md:mt-16 lg:grid-cols-[5fr_7fr]">

          {/* ── Contact aside ── */}
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex h-full flex-col gap-8 rounded-3xl bg-brand-charcoal p-8 text-white md:p-9">
              {/* Aside headline */}
              <div>
                <p className="label-eyebrow mb-4 text-brand-red">
                  Coordonnées
                </p>
                <h3 className="text-2xl font-bold leading-snug tracking-tight text-white md:text-3xl">
                  Une question, un projet&nbsp;?<br />
                  Nous sommes à l&apos;écoute.
                </h3>
              </div>

              {/* Contact rows */}
              <ContactRows />

              {/* WhatsApp CTA + socials */}
              <div className="mt-auto flex flex-col gap-4">
                <a
                  href={site.whatsapp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-red text-sm font-semibold text-white shadow-[0_6px_20px_-4px_rgba(227,6,19,0.4)] transition-all duration-200 hover:-translate-y-px hover:bg-brand-red-hover hover:shadow-[0_12px_28px_-6px_rgba(227,6,19,0.5)]"
                >
                  <WhatsAppIcon className="h-4 w-4" title="WhatsApp" />
                  Discutons sur WhatsApp
                </a>

                <div className="flex items-center gap-3">
                  <span className="label-eyebrow whitespace-nowrap text-white/40">
                    Suivez-nous
                  </span>
                  <span className="h-px flex-1 bg-white/10" aria-hidden />
                  <SocialLinks />
                </div>
              </div>
            </div>
          </motion.aside>

          {/* ── Form card ── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <div className="rounded-3xl border border-brand-light-gray bg-white p-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.08)] md:p-9">
              {status === "success" ? (
                <SuccessPanel onReset={() => setStatus("idle")} />
              ) : (
                <ContactForm
                  form={form}
                  fieldErrors={fieldErrors}
                  status={status}
                  errorMsg={errorMsg}
                  taPH={taPH}
                  onChange={handleChange}
                  onServiceChange={(s) => setForm((f) => ({ ...f, service: s }))}
                  onSubmit={handleSubmit}
                  onWhatsApp={handleWhatsApp}
                />
              )}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/* ── Contact rows (aside) ────────────────────────────────────────────────── */

function ContactRows() {
  const rows = [
    {
      icon: <Mail className="h-4 w-4" />,
      label: "Email",
      items: site.email as readonly string[],
      href: (v: string) => `mailto:${v}`,
    },
    {
      icon: <Phone className="h-4 w-4" />,
      label: "Téléphone",
      items: site.phones as readonly string[],
      href: (v: string) => `tel:${v.replace(/\s/g, "")}`,
    },
    {
      icon: <MapPin className="h-4 w-4" />,
      label: "Localisation",
      items: ["Rue Cherif Chalabi, Passage N°E, Blida 09000"] as string[],
      href: () => "https://maps.app.goo.gl/AThK17GjJpkBr8mr7",
      target: "_blank" as const,
    },
  ];

  return (
    <ul className="flex flex-col gap-5">
      {rows.map(({ icon, label, items, href, target }) => (
        <li key={label} className="flex items-start gap-3.5">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[.08]">
            {icon}
          </span>
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
              {label}
            </p>
            {items.map((v) => (
              <a
                key={v}
                href={href(v)}
                target={target}
                rel={target ? "noopener noreferrer" : undefined}
                className="block text-sm font-medium leading-relaxed text-white transition-all duration-150 hover:translate-x-0.5 hover:text-brand-red"
              >
                {v}
              </a>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ── Social pills (aside) ────────────────────────────────────────────────── */

function SocialLinks() {
  const socials = [
    {
      label: "Instagram",
      href: site.socials.instagram,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden>
          <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
        </svg>
      ),
    },
    {
      label: "Facebook",
      href: site.socials.facebook,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden>
          <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
        </svg>
      ),
    },
    {
      label: "TikTok",
      href: site.socials.tiktok,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden>
          <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {socials.map(({ label, href, icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[.08] text-white/60 transition-all duration-150 hover:bg-white/[.16] hover:text-white"
        >
          {icon}
        </a>
      ))}
    </div>
  );
}

/* ── Success panel ───────────────────────────────────────────────────────── */

function SuccessPanel({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-[360px] flex-col items-center justify-center gap-5 py-8 text-center"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-emerald-500/10"
      >
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <motion.path
            d="M20 6 9 17l-5-5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          />
        </svg>
      </motion.div>

      <div>
        <h4 className="heading-section mb-2 text-xl text-brand-charcoal">
          Message envoyé&nbsp;!
        </h4>
        <p className="mx-auto max-w-[300px] text-sm leading-relaxed text-brand-dark/60">
          Lamsa Communication vous contactera très bientôt avec une
          proposition adaptée à votre projet.
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-2 cursor-pointer rounded-full border border-brand-light-gray bg-transparent px-6 py-2.5 text-sm font-semibold text-brand-charcoal transition-all hover:border-brand-charcoal/40 hover:bg-brand-charcoal/[.04]"
      >
        Nouveau message
      </button>
    </motion.div>
  );
}

/* ── Contact form (inner) ────────────────────────────────────────────────── */

type ContactFormProps = {
  form: FormState;
  fieldErrors: FormErrors;
  status: Status;
  errorMsg: string;
  taPH: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onServiceChange: (service: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onWhatsApp: () => void;
};

function ContactForm({
  form,
  fieldErrors,
  status,
  errorMsg,
  taPH,
  onChange,
  onServiceChange,
  onSubmit,
  onWhatsApp,
}: ContactFormProps) {
  return (
    <form onSubmit={onSubmit} noValidate>
      {/* Honeypot — invisible to humans, bots fill it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={form.website}
        onChange={onChange}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="flex flex-col gap-4">
        {/* Name + Email row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Nom & Entreprise"
            name="fullName"
            required
            value={form.fullName}
            onChange={onChange}
            autoComplete="name"
            placeholder="Votre nom, prénom ou entreprise"
            error={fieldErrors.fullName}
          />
          <Field
            label="Email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={onChange}
            autoComplete="email"
            placeholder="vous@exemple.com"
            error={fieldErrors.email}
          />
        </div>

        {/* Phone */}
        <Field
          label="Téléphone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={onChange}
          autoComplete="tel"
          placeholder="+213 ..."
          error={fieldErrors.phone}
        />

        {/* Service chips */}
        <ServiceChips
          selected={form.service}
          onSelect={onServiceChange}
        />

        {/* Message */}
        <TextareaField
          label="Votre projet"
          name="message"
          required
          value={form.message}
          onChange={onChange}
          rows={4}
          placeholder={taPH}
          error={fieldErrors.message}
        />
      </div>

      {/* Error banner */}
      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      {/* CTA row */}
      <div className="mt-6">
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex h-[52px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-red px-7 text-sm font-semibold text-white shadow-[0_8px_24px_-6px_rgba(227,6,19,0.4)] transition-all duration-200 hover:-translate-y-px hover:bg-brand-red-hover hover:shadow-[0_12px_28px_-6px_rgba(227,6,19,0.5)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Envoi en cours…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Envoyer le message
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onWhatsApp}
            className="inline-flex h-[52px] cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border border-brand-charcoal/20 bg-transparent px-5 text-sm font-semibold text-brand-charcoal transition-all duration-200 hover:border-brand-charcoal/40 hover:bg-brand-charcoal/[.04]"
          >
            <WhatsAppIcon className="h-4 w-4" title="WhatsApp" />
            WhatsApp
          </button>
        </div>

        <p className="mt-4 text-xs text-brand-dark/50">
          Vos informations sont confidentielles et utilisées uniquement pour
          traiter votre demande.
        </p>
      </div>
    </form>
  );
}

/* ── Service chips ───────────────────────────────────────────────────────── */

function ServiceChips({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (s: string) => void;
}) {
  const { categories } = useCatalogStore();

  return (
    <div>
      <label className="label-eyebrow mb-2 block text-brand-charcoal/50">
        Type de projet
      </label>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.slug || cat.id}
            type="button"
            onClick={() => onSelect(selected === cat.name ? "" : cat.name)}
            className={cn(
              "inline-flex cursor-pointer items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-150",
              selected === cat.name
                ? "border-brand-red bg-brand-red text-white"
                : "border-brand-light-gray bg-transparent text-brand-charcoal/50 hover:border-brand-red hover:text-brand-red",
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Field ───────────────────────────────────────────────────────────────── */

type FieldProps = {
  label: string;
  name: string;
  required?: boolean;
  className?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

function Field({ label, name, required, className, error, ...props }: FieldProps) {
  const errorId = `${name}-error`;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={name}
        className="label-eyebrow text-brand-charcoal/50"
      >
        {label}
        {required && <span className="ml-[3px] text-brand-red">*</span>}
      </label>
      <input
        id={name}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "h-[52px] w-full rounded-xl bg-brand-soft-white px-4 text-sm text-brand-charcoal placeholder:text-brand-dark/40 outline-none transition-all duration-200 focus:bg-white focus:ring-3",
          error
            ? "border border-red-400 focus:border-red-400 focus:ring-red-400/15"
            : "border border-brand-light-gray focus:border-brand-red focus:ring-brand-red/15",
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Textarea ────────────────────────────────────────────────────────────── */

type TextareaProps = {
  label: string;
  name: string;
  required?: boolean;
  className?: string;
  error?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

function TextareaField({ label, name, required, className, error, ...props }: TextareaProps) {
  const errorId = `${name}-error`;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={name}
        className="label-eyebrow text-brand-charcoal/50"
      >
        {label}
        {required && <span className="ml-[3px] text-brand-red">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "w-full resize-none rounded-xl bg-brand-soft-white px-4 py-3 text-sm leading-relaxed text-brand-charcoal placeholder:text-brand-dark/40 outline-none transition-all duration-200 focus:bg-white focus:ring-3",
          error
            ? "border border-red-400 focus:border-red-400 focus:ring-red-400/15"
            : "border border-brand-light-gray focus:border-brand-red focus:ring-brand-red/15",
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
