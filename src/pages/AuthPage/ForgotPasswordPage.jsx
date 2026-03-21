import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, CheckCircle, KeyRound } from "lucide-react";
import ApexLogo from "../../Assets/ApexFitness.logo.png";
import AuthImagePanel from "../../components/AuthForm/AuthImagePanel";

// step 1 → enter email
// step 2 → check inbox confirmation
// step 3 → enter new password (simulates arriving from email link)

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({ password: "", confirm: "" });
  const [error, setError] = useState("");

  function handleSendLink(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  }

  function handleReset(e) {
    e.preventDefault();
    if (passwords.password !== passwords.confirm) {
      setError("Passwords don't match.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4); // success
    }, 1500);
  }

  return (
    <main className="min-h-screen bg-surface p-3 md:p-6">
      <section className="relative mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1600px] overflow-hidden rounded-3xl bg-elevated shadow-[0_25px_80px_rgba(0,0,0,0.28)] md:min-h-[calc(100vh-3rem)]">
        <AuthImagePanel quote="The only bad workout is the one that didn't happen." 
        animate />

        {/* ── Right: form panel ── */}
        <div className="relative flex w-full items-center justify-center bg-surface px-4 py-10 sm:px-6 md:max-w-[430px] md:px-8 lg:max-w-[470px] lg:px-10">
          <div className="absolute inset-y-0 -left-20 hidden w-40 skew-x-[-12deg] bg-surface md:block" />

          <div className="relative z-10 w-full max-w-[420px]">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <img src={ApexLogo} alt="Apex Fitness" className="h-[130px] w-auto" />
            </div>

            <AnimatePresence mode="wait">
              {/* ── Step 1: Enter email ── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-3xl border border-border/10 bg-overlay/5 px-8 py-8 shadow-2xl shadow-black/40 sm:px-10"
                >
                  <div className="mb-6 flex flex-col items-center gap-3 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                      <Mail className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-foreground">Forgot Password?</h1>
                      <p className="mt-1 text-sm text-muted">
                        Enter your email and we'll send you a reset link.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSendLink} className="space-y-5">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-sm font-semibold text-foreground/80">Email Address</span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="h-11 w-full rounded-xl border border-border/10 bg-overlay/5 px-4 text-sm text-foreground placeholder:text-subtle outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-primary to-blue-700 hover:from-primary hover:to-blue-700 disabled:opacity-60 text-foreground font-bold text-base shadow-lg hover:shadow-primary/30 transition-all"
                    >
                      {loading ? (
                        <span className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      ) : (
                        "Send Reset Link"
                      )}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <Link
                      to="/auth"
                      className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Login
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Check inbox ── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-3xl border border-border/10 bg-overlay/5 px-8 py-10 shadow-2xl shadow-black/40 sm:px-10 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }}
                    className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
                  >
                    <Mail className="h-8 w-8 text-primary" />
                  </motion.div>

                  <h2 className="text-xl font-bold text-foreground">Check your inbox</h2>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    We sent a password reset link to{" "}
                    <span className="font-semibold text-primary">{email}</span>.
                    <br />It may take a minute to arrive.
                  </p>

                  {/* Simulate clicking the email link */}
                  <button
                    onClick={() => setStep(3)}
                    className="mt-8 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-primary to-blue-700 hover:from-primary hover:to-blue-700 text-foreground font-bold text-base shadow-lg hover:shadow-primary/30 transition-all"
                  >
                    I've clicked the link →
                  </button>

                  <p className="mt-4 text-xs text-subtle">
                    Didn't get it?{" "}
                    <button
                      onClick={() => setStep(1)}
                      className="text-primary hover:text-primary transition-colors"
                    >
                      Resend email
                    </button>
                  </p>

                  <div className="mt-6">
                    <Link
                      to="/auth"
                      className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Login
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: New password ── */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-3xl border border-border/10 bg-overlay/5 px-8 py-8 shadow-2xl shadow-black/40 sm:px-10"
                >
                  <div className="mb-6 flex flex-col items-center gap-3 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                      <KeyRound className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-foreground">Set New Password</h1>
                      <p className="mt-1 text-sm text-muted">
                        Must be at least 8 characters.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleReset} className="space-y-4">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-sm font-semibold text-foreground/80">New Password</span>
                      <input
                        type="password"
                        required
                        minLength={8}
                        placeholder="Create new password"
                        value={passwords.password}
                        onChange={(e) => setPasswords((p) => ({ ...p, password: e.target.value }))}
                        className="h-11 w-full rounded-xl border border-border/10 bg-overlay/5 px-4 text-sm text-foreground placeholder:text-subtle outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-sm font-semibold text-foreground/80">Confirm Password</span>
                      <input
                        type="password"
                        required
                        placeholder="Confirm new password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                        className="h-11 w-full rounded-xl border border-border/10 bg-overlay/5 px-4 text-sm text-foreground placeholder:text-subtle outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                      />
                    </label>

                    {error && (
                      <p className="text-xs text-red-400">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-primary to-blue-700 hover:from-primary hover:to-blue-700 disabled:opacity-60 text-foreground font-bold text-base shadow-lg hover:shadow-primary/30 transition-all"
                    >
                      {loading ? (
                        <span className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      ) : (
                        "Reset Password"
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* ── Step 4: All done ── */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-3xl border border-border/10 bg-overlay/5 px-8 py-12 shadow-2xl shadow-black/40 sm:px-10 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
                    className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
                  >
                    <CheckCircle className="h-9 w-9 text-primary" />
                  </motion.div>

                  <h2 className="text-xl font-bold text-foreground">Password Reset!</h2>
                  <p className="mt-2 text-sm text-muted">
                    Your password has been updated successfully.
                  </p>

                  <Link
                    to="/auth"
                    className="mt-8 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-primary to-blue-700 hover:from-primary hover:to-blue-700 text-foreground font-bold text-base shadow-lg hover:shadow-primary/30 transition-all"
                  >
                    Back to Login
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}
