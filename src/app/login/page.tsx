"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck
} from "lucide-react";

function getFriendlyAuthError(code?: string, fallbackMessage?: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password. Please check your credentials or create an account.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many unsuccessful login attempts. Please try again later or reset your password.";
    case "auth/popup-closed-by-user":
      return "Google sign-in popup was closed before completing.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized in Firebase Console yet. Add 'localhost' under Authentication → Settings → Authorized domains.";
    default:
      return fallbackMessage || "Authentication failed. Please try again.";
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetMessage(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string; message?: string };
      setError(getFriendlyAuthError(firebaseErr.code, firebaseErr.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setResetMessage(null);
    setGoogleLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string; message?: string };
      setError(getFriendlyAuthError(firebaseErr.code, firebaseErr.message));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError(null);
    setResetMessage(null);
    if (!email.trim()) {
      setError("Please enter your email address first to receive a password reset link.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setResetMessage(`Password reset email sent to ${email.trim()}. Check your inbox!`);
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string; message?: string };
      setError(getFriendlyAuthError(firebaseErr.code, firebaseErr.message));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Background Accents */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#9CF2E8]/25 via-[#E6EEFF]/40 to-transparent blur-3xl -z-10" />
        <div className="pointer-events-none absolute bottom-10 right-10 w-80 h-80 bg-[#FFDCC3]/20 rounded-full blur-3xl -z-10" />

        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Left Branding Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#005C55] via-[#0B6B63] to-[#003E39] p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-[#9CF2E8]/10 blur-2xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#9CF2E8] mb-6">
                <ShieldCheck className="w-4 h-4" />
                <span>Ghuri.ai Verified Account</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight">
                Welcome back to smarter Bangladesh travel.
              </h1>
              <p className="text-xs sm:text-sm text-white/80 mt-3 leading-relaxed">
                Sign in to access your saved itineraries, custom room category selections, and deterministic trip budgets across Cox&apos;s Bazar, Sajek Valley, and Sreemangal.
              </p>
            </div>

            <div className="space-y-3 mt-8 pt-6 border-t border-white/15 text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#9CF2E8] shrink-0" />
                <span>Save & export multi-day AI itineraries</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#9CF2E8] shrink-0" />
                <span>Lock verified hotel room category rates</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#9CF2E8] shrink-0" />
                <span>Sync real-time group split budgets</span>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            {/* Log In / Register Tab Switcher */}
            <div className="grid grid-cols-2 p-1 bg-[#EFF4FF] rounded-2xl mb-6 border border-[#DEE9FC]">
              <Link
                href="/login"
                className="py-2.5 rounded-xl bg-[#005C55] text-white text-xs sm:text-sm font-extrabold text-center shadow-xs transition-all"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="py-2.5 rounded-xl text-[#121C2A] hover:text-[#005C55] text-xs sm:text-sm font-bold text-center transition-all"
              >
                Register (Create Account)
              </Link>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-[#121C2A]">Log in to Your Account</h2>
              <p className="text-xs sm:text-sm text-[#3E4947] mt-1">
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/register"
                  className="font-bold text-[#005C55] hover:underline"
                >
                  Create a free account →
                </Link>
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {resetMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-green-50 border border-green-200 flex items-start gap-2.5 text-xs text-[#005F29]">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#005F29]" />
                <span>{resetMessage}</span>
              </div>
            )}

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="w-full py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-[#121C2A] font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-2xs cursor-pointer disabled:opacity-60"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#005C55]" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            <div className="relative my-6 flex items-center justify-center">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Or continue with email
              </span>
              <div className="border-t border-gray-200 w-full" />
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#3E4947] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-[#005C55] absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#EFF4FF] border border-transparent focus:border-[#005C55] focus:bg-white text-sm font-medium text-[#121C2A] focus:outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold text-[#3E4947] uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-bold text-[#005C55] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-[#005C55] absolute left-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#EFF4FF] border border-transparent focus:border-[#005C55] focus:bg-white text-sm font-medium text-[#121C2A] focus:outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-gray-500 hover:text-[#005C55] cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-[#005C55] hover:bg-[#0F766E] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#005C55]/20 transition-all cursor-pointer disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Log In to Ghuri.ai</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

