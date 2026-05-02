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
import { site } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons/social-icons";
import { cn } from "@/lib/utils";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  website: string;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  message: "",
  website: "",
};

type Status = "idle" | "loading" | "success" | "error";

type FormErrors = Partial<Record<keyof Omit<FormState, "website">, string>>;

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
          : "Impossible d'envoyer le message. Réessayez ou contactez-nous via WhatsApp.",
      );
    }
  };

  const whatsappPrefilled = React.useMemo(() => {
    const parts: string[] = [];
    if (form.fullName) parts.push(`Bonjour, je suis ${form.fullName}.`);
    if (form.message) parts.push(form.message);
    const text = parts.join("\n") || "Bonjour, je souhaite un devis.";
    return `${site.whatsapp.link}?text=${encodeURIComponent(text)}`;
  }, [form]);

  const handleWhatsApp = () => {
    const errors = validate(form, "whatsapp");
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    window.open(whatsappPrefilled, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="contact"
      className="relative w-full scroll-mt-16 overflow-hidden py-20 md:py-28 lg:py-36 lg:scroll-mt-20"
      style={{
        background:
          "linear-gradient(180deg, #fdf8f8 0%, #fdf8f8 65%, #ffffff 100%)",
      }}
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
                <p className="label-eyebrow text-brand-red">Coordonnées</p>
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
                      target="_blank"
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
                    <a
                      href="https://maps.app.goo.gl/AThK17GjJpkBr8mr7"
                      target="_blank"
                    >
                      <p className="text-base font-medium text-white transition-colors hover:text-brand-red">
                        Rue Cherif Chalabi, Passage N°E, Blida 09000
                      </p>
                    </a>
                  </div>
                </li>
              </ul>

              <div className="space-y-5">
                <a
                  href={site.whatsapp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_28px_-8px_rgba(227,6,19,0.4)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
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
                      className="f-icon"
                      href={site.socials.instagram}
                      target="_blank"
                      rel="noopener"
                      aria-label="Instagram"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="currentColor"
                        className="bi bi-instagram"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                      </svg>
                    </a>
                    <a
                      className="f-icon"
                      href={site.socials.facebook}
                      target="_blank"
                      rel="noopener"
                      aria-label="Facebook"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-facebook"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                      </svg>
                    </a>
                    <a
                      className="f-icon"
                      href={site.socials.tiktok}
                      target="_blank"
                      rel="noopener"
                      aria-label="TikTok"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-tiktok"
                        viewBox="0 0 16 16"
                      >
                        <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                      </svg>
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
                  error={fieldErrors.fullName}
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
                  error={fieldErrors.email}
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
                  className="md:col-span-2"
                  error={fieldErrors.phone}
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
                error={fieldErrors.message}
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
                  className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_28px_-8px_rgba(227,6,19,0.4)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
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
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-brand-charcoal/20 bg-transparent px-6 py-3 text-sm font-semibold text-brand-charcoal transition-all duration-200 hover:border-brand-charcoal/45 hover:bg-brand-charcoal/[0.04] cursor-pointer"
                >
                  <WhatsAppIcon className="h-5 w-5" title="WhatsApp" />
                  Envoyer via WhatsApp
                </button>
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
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

function Field({ label, name, required, className, error, ...props }: FieldProps) {
  const errorId = `${name}-error`;
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
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "h-12 w-full rounded-xl border bg-brand-soft-white/40 px-4 text-sm text-brand-charcoal placeholder:text-brand-dark/40 transition-all focus:bg-white focus:outline-none focus:ring-3",
          error
            ? "border-red-400 focus:border-red-400 focus:ring-red-400/15"
            : "border-brand-light-gray focus:border-brand-red focus:ring-brand-red/15",
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

type TextareaProps = {
  label: string;
  name: string;
  required?: boolean;
  className?: string;
  error?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

function TextareaField({
  label,
  name,
  required,
  className,
  error,
  ...props
}: TextareaProps) {
  const errorId = `${name}-error`;
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
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "w-full resize-none rounded-xl border bg-brand-soft-white/40 px-4 py-3 text-sm text-brand-charcoal placeholder:text-brand-dark/40 transition-all focus:bg-white focus:outline-none focus:ring-3",
          error
            ? "border-red-400 focus:border-red-400 focus:ring-red-400/15"
            : "border-brand-light-gray focus:border-brand-red focus:ring-brand-red/15",
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
