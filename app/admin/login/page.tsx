"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, User, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { useAdminStore } from "@/lib/store/useAdminStore";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, logout, isAuthenticated } = useAdminStore();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    // If the URL tells us to clear the state (e.g. from middleware or API interceptor)
    const shouldClear = searchParams.get("clearState") === "true" || searchParams.get("sessionExpired") === "true";
    
    if (shouldClear && isAuthenticated) {
      logout();
      // Remove query params to clean up URL
      router.replace("/admin/login");
    } else if (isAuthenticated && !shouldClear) {
      router.push("/admin");
    }
  }, [isAuthenticated, router, searchParams, logout]);

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
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Top Accent Line */}
        <div className="absolute left-0 top-0 h-1.5 w-full bg-brand-red" />

        <div className="p-8 sm:p-10">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Image
                src="/images/lamsa-black.png"
                alt="Lamsa Logo"
                width={140}
                height={50}
                className="mx-auto"
                priority
              />
            </Link>
            <h1 className="mt-6 text-2xl font-black uppercase tracking-tight text-brand-charcoal">
              Espace Administrateur
            </h1>
            <p className="mt-2 text-sm text-brand-warm-gray font-medium">
              Authentification requise pour l'accès
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm font-medium text-brand-red border border-red-100"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal" htmlFor="username">
                  Identifiant
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-warm-gray">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-brand-light-gray bg-brand-soft-white/50 py-2.5 pl-10 pr-4 text-sm font-medium text-brand-charcoal placeholder-brand-warm-gray/60 focus:border-brand-red focus:bg-white focus:outline-none transition-colors"
                    placeholder="Saisissez votre identifiant"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal" htmlFor="password">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-warm-gray">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-brand-light-gray bg-brand-soft-white/50 py-2.5 pl-10 pr-10 text-sm font-medium text-brand-charcoal placeholder-brand-warm-gray/60 focus:border-brand-red focus:bg-white focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-warm-gray hover:text-brand-charcoal transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-brand-charcoal py-3 font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : (
                <>
                  <span className="relative z-10">Connexion Sécurisée</span>
                  <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Fill */}
          <div className="mt-8 pt-6 border-t border-brand-light-gray text-center">
            <button
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-warm-gray hover:text-brand-red transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Remplir les identifiants démo
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-brand-soft-white px-8 py-4 text-center">
          <p className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-warm-gray">
            <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
            Accès Protégé et Restreint
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <React.Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-red border-t-transparent" /></div>}>
      <AdminLoginContent />
    </React.Suspense>
  );
}
