"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, User, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { useAdminStore } from "@/lib/store/useAdminStore";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAdminStore();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Veuillez saisir votre identifiant et votre mot de passe.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const success = login(username.trim(), password.trim());
      if (success) {
        router.push("/admin");
      } else {
        setError("Identifiants incorrects. Veuillez utiliser admin / admin123.");
        setIsLoading(false);
      }
    }, 400);
  };

  const handleFillDemo = () => {
    setUsername("admin");
    setPassword("admin123");
    setError(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#141414] p-4 sm:p-6 lg:p-8">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e30613_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#1c1c1c] p-8 shadow-2xl sm:p-10"
      >
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2 shadow-lg">
            <div className="relative h-full w-full">
              <Image
                src="/lamsa2.png"
                alt="Lamsa Studio"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <h1 className="heading-display mt-6 text-2xl font-black text-white sm:text-3xl">
            LAMSA <span className="text-brand-red">ADMIN</span>
          </h1>
          <p className="mt-2 text-xs text-brand-warm-gray">
            Espace d&apos;administration & Gestion SaaS TailAdmin
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-2 rounded-xl border border-brand-red/30 bg-brand-red/10 p-3 text-xs font-semibold text-brand-red"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-brand-warm-gray block mb-1.5">
              Identifiant
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-warm-gray" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-white/30 focus:border-brand-red focus:bg-white/10 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-brand-warm-gray block mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-warm-gray" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-xs font-semibold text-white placeholder-white/30 focus:border-brand-red focus:bg-white/10 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-warm-gray hover:text-white"
                aria-label="Basculer la visibilité du mot de passe"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-red py-3 text-xs font-extrabold text-white transition-all duration-200 hover:bg-brand-red-hover hover:shadow-[0_8px_25px_-6px_rgba(227,6,19,0.7)] cursor-pointer"
          >
            <span>{isLoading ? "Connexion en cours..." : "Se connecter"}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        {/* Demo Helper Button */}
        <div className="mt-6 border-t border-white/10 pt-4 text-center">
          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-red hover:underline cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Remplir avec identifiants démo (admin / admin123)
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-brand-warm-gray">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          Session sécurisée avec RBAC & DevSecOps
        </div>
      </motion.div>
    </div>
  );
}
