"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { site, services } from "@/lib/site";
import {
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/icons/social-icons";
import { cn } from "@/lib/utils";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  website: string;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  service: "",
  message: "",
  website: "",
};

type Status = "idle" | "loading" | "success" | "error";

export function ContactSection() {
  const [form, setForm] = React.useState<FormState>(initialState);
  const [status, setStatus] = React.useState<Status>("idle");
  const [errorMsg, setErrorMsg] = React.useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.message.trim()
    ) {
      setStatus("error");
      setErrorMsg("Merci de remplir tous les champs obligatoires.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Une erreur est survenue.");
      }

      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Impossible d'envoyer le message. Réessayez ou contactez-nous via WhatsApp."
      );
    }
  };

  const whatsappPrefilled = React.useMemo(() => {
    const parts: string[] = [];
    if (form.fullName) parts.push(`Bonjour, je suis ${form.fullName}.`);
    if (form.service) parts.push(`Service souhaité : ${form.service}.`);
    if (form.message) parts.push(form.message);
    const text = parts.join("\n") || "Bonjour, je souhaite un devis.";
    return `${site.whatsapp.link}?text=${encodeURIComponent(text)}`;
  }, [form]);

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden py-20 md:py-28 lg:py-36"
    >
      <Container as="div">
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
        />

        <div className="mt-12 grid grid-cols-1 gap-8 md:mt-16 md:gap-10 lg:grid-cols-12 lg:gap-12">
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            <div className="flex h-full flex-col justify-between gap-8 rounded-3xl bg-brand-charcoal p-7 text-white sm:p-8 md:gap-10 md:p-10">
              <div>
                <p className="label-eyebrow text-brand-red">
                  <span className="block h-px w-8 bg-brand-red" aria-hidden />
                  Coordonnées
                </p>
                <h3 className="mt-4 text-2xl font-bold md:text-3xl">
                  Une question, un projet ? Nous sommes à l&apos;écoute.
                </h3>
              </div>

              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/50">
                      Email
                    </p>
                    <a
                      href={`mailto:${site.email}`}
                      className="text-base font-medium text-white transition-colors hover:text-brand-red"
                    >
                      {site.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/50">
                      Téléphone
                    </p>
                    {site.phones.map((p) => (
                      <a
                        key={p}
                        href={`tel:${p.replace(/\s/g, "")}`}
                        className="block text-base font-medium text-white transition-colors hover:text-brand-red"
                      >
                        {p}
                      </a>
                    ))}
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/50">
                      Localisation
                    </p>
                    <a href="https://maps.app.goo.gl/AThK17GjJpkBr8mr7"><p className="text-base font-medium text-white">Rue Cherif Chalabi, Passage N°E, Blida 09000</p></a>
                  </div>
                </li>
              </ul>

              <div className="space-y-5">
                <a
                  href={site.whatsapp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-brand-red px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-brand-red-hover cursor-pointer"
                >
                  <WhatsAppIcon className="h-5 w-5" title="WhatsApp" />
                  Discutons sur WhatsApp
                </a>

                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wider text-white/50">
                    Suivez-nous
                  </span>
                  <span className="block h-px flex-1 bg-white/15" aria-hidden />
                  <div className="flex items-center gap-2">
                    <a
                      href={site.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand-red cursor-pointer"
                    >
                      <InstagramIcon className="h-4 w-4" title="Instagram" />
                    </a>
                    <a
                      href={site.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand-red cursor-pointer"
                    >
                      <FacebookIcon className="h-4 w-4" title="Facebook" />
                    </a>
                    <a
                      href={site.socials.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="TikTok"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand-red cursor-pointer"
                    >
                      <TikTokIcon className="h-4 w-4" title="TikTok" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-7"
          >
            <form
              onSubmit={handleSubmit}
              className="relative rounded-3xl border border-brand-light-gray bg-white p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.08)] sm:p-8 md:p-10"
              noValidate
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field
                  label="Nom complet"
                  name="fullName"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  placeholder="Votre nom et prénom"
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="vous@exemple.com"
                />
                <Field
                  label="Téléphone"
                  name="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  placeholder="+213 ..."
                />
              </div>

              <TextareaField
                className="mt-5"
                label="Votre projet"
                name="message"
                required
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Décrivez brièvement votre besoin (formats, quantités, délais…)"
              />

              {/* Honeypot — invisible to humans, bots fill it */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={form.website}
                onChange={handleChange}
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
                  role="status"
                  aria-live="polite"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    Votre demande a bien été envoyée. Lamsa Communication vous
                    contactera très bientôt.
                  </div>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                  role="alert"
                  aria-live="assertive"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>{errorMsg}</div>
                </motion.div>
              )}

              <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-red px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-brand-red-hover disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Envoi en cours…
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Envoyer le message
                    </>
                  )}
                </button>
                <a
                  href={whatsappPrefilled}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-brand-charcoal/15 bg-white px-6 py-4 text-base font-semibold text-brand-charcoal transition-all hover:border-brand-red hover:text-brand-red cursor-pointer"
                >
                  <WhatsAppIcon className="h-5 w-5" title="WhatsApp" />
                  Envoyer via WhatsApp
                </a>
              </div>

              <p className="mt-4 text-xs text-brand-dark/50">
                Vos informations sont confidentielles et utilisées uniquement
                pour traiter votre demande.
              </p>
            </form>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

type FieldProps = {
  label: string;
  name: string;
  required?: boolean;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

function Field({
  label,
  name,
  required,
  className,
  ...props
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={name}
        className="text-xs font-semibold uppercase tracking-wider text-brand-dark/70"
      >
        {label}
        {required && <span className="ml-1 text-brand-red">*</span>}
      </label>
      <input
        id={name}
        name={name}
        required={required}
        className="h-12 w-full rounded-xl border border-brand-light-gray bg-brand-soft-white/40 px-4 text-sm text-brand-charcoal placeholder:text-brand-dark/40 transition-all focus:border-brand-red focus:bg-white focus:outline-none focus:ring-3 focus:ring-brand-red/15"
        {...props}
      />
    </div>
  );
}

type SelectProps = {
  label: string;
  name: string;
  className?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

function SelectField({
  label,
  name,
  className,
  children,
  ...props
}: SelectProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={name}
        className="text-xs font-semibold uppercase tracking-wider text-brand-dark/70"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="h-12 w-full appearance-none rounded-xl border border-brand-light-gray bg-brand-soft-white/40 px-4 text-sm text-brand-charcoal transition-all focus:border-brand-red focus:bg-white focus:outline-none focus:ring-3 focus:ring-brand-red/15"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

type TextareaProps = {
  label: string;
  name: string;
  required?: boolean;
  className?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

function TextareaField({
  label,
  name,
  required,
  className,
  ...props
}: TextareaProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={name}
        className="text-xs font-semibold uppercase tracking-wider text-brand-dark/70"
      >
        {label}
        {required && <span className="ml-1 text-brand-red">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        className="w-full resize-none rounded-xl border border-brand-light-gray bg-brand-soft-white/40 px-4 py-3 text-sm text-brand-charcoal placeholder:text-brand-dark/40 transition-all focus:border-brand-red focus:bg-white focus:outline-none focus:ring-3 focus:ring-brand-red/15"
        {...props}
      />
    </div>
  );
}
