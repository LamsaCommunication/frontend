"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, User, ArrowRight, ShieldCheck, Sparkles, AlertCircle, Fingerprint } from "lucide-react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Veuillez saisir votre identifiant et votre mot de passe.");
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(username.trim(), password.trim());
      if (success) {
        router.push("/admin");
      } else {
        setError("Identifiants incorrects. Veuillez réessayer.");
        setIsLoading(false);
      }
    } catch {
      setError("Erreur de connexion. Vérifiez que le serveur est actif.");
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername("admin");
    setPassword("admin123");
    setError(null);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] font-sans selection:bg-brand-red/30">
      
      {/* Background Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.2, 0.15],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] h-[60vw] w-[60vw] max-h-[800px] max-w-[800px] rounded-full bg-brand-red/20 blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-[20%] -right-[10%] h-[70vw] w-[70vw] max-h-[900px] max-w-[900px] rounded-full bg-brand-red/10 blur-[150px]" 
        />
        {/* Subtle noise texture */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[420px] px-4"
      >
        {/* Glassmorphism Card */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl sm:p-10">
          
          <div className="mb-10 text-center">
            <Link href="/" className="group inline-flex items-center justify-center rounded-full bg-white/5 p-4 ring-1 ring-white/10 transition-all hover:bg-white/10 hover:ring-brand-red/50">
              <Fingerprint className="h-8 w-8 text-white transition-transform group-hover:scale-110 group-hover:text-brand-red" strokeWidth={1.5} />
            </Link>
            <h1 className="mt-6 text-2xl font-light tracking-tight text-white">
              Espace <span className="font-bold">Administrateur</span>
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Accès sécurisé réservé à la direction
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="flex items-center gap-3 overflow-hidden rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-400"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-white/60 ml-1" htmlFor="username">
                  Identifiant
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-red transition-colors">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-brand-red/50 focus:bg-black/60 focus:ring-1 focus:ring-brand-red/50"
                    placeholder="Entrez votre identifiant"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-white/60 ml-1" htmlFor="password">
                  Mot de passe
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-red transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 py-3.5 pl-11 pr-12 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-brand-red/50 focus:bg-black/60 focus:ring-1 focus:ring-brand-red/50 font-mono tracking-wider"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-brand-red py-4 font-bold text-white shadow-[0_0_40px_-10px_rgba(227,6,19,0.4)] transition-all hover:bg-brand-red-hover hover:shadow-[0_0_60px_-15px_rgba(227,6,19,0.6)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : (
                <>
                  <span className="relative z-10">Authentification</span>
                  <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Fill */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleFillDemo}
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/60 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand-red transition-transform group-hover:scale-110" />
              <span>Identifiants de démonstration</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className="flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-widest text-white/40">
            <ShieldCheck className="h-4 w-4 text-emerald-500/80" />
            Lamsa Communication © {new Date().getFullYear()}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <React.Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-red/20 border-t-brand-red" />
      </div>
    }>
      <AdminLoginContent />
    </React.Suspense>
  );
}
