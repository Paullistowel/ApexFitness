import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { KeyRound, CheckCircle, ArrowLeft } from "lucide-react";
import ApexLogo from "../../Assets/ApexFitness.logo.png";
import AuthImagePanel from "../../components/AuthForm/AuthImagePanel";
import api from "../../lib/api";

export default function ResetPasswordPage() {
  const [searchParams]                  = useSearchParams();
  const token                           = searchParams.get("token") ?? "";
  const navigate                        = useNavigate();
  const [passwords, setPasswords]       = useState({ password: "", confirm: "" });
  const [loading,   setLoading]         = useState(false);
  const [error,     setError]           = useState("");
  const [done,      setDone]            = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwords.password !== passwords.confirm) { setError("Passwords don't match."); return; }
    if (passwords.password.length < 8)            { setError("Password must be at least 8 characters."); return; }
    if (!token)                                   { setError("Invalid reset link. Please request a new one."); return; }

    setError("");
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, newPassword: passwords.password });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message ?? "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface p-3 md:p-6">
      <section className="relative mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1600px] overflow-hidden rounded-3xl bg-elevated shadow-[0_25px_80px_rgba(0,0,0,0.28)] md:min-h-[calc(100vh-3rem)]">
        <AuthImagePanel quote="Every rep is a step closer to the best version of you." animate />

        <div className="relative flex w-full items-center justify-center bg-surface px-4 py-10 sm:px-6 md:max-w-[430px] md:px-8 lg:max-w-[470px] lg:px-10">
          <div className="absolute inset-y-0 -left-20 hidden w-40 skew-x-[-12deg] bg-surface md:block" />

          <div className="relative z-10 w-full max-w-[420px]">
            <div className="mb-6 flex justify-center">
              <img src={ApexLogo} alt="Apex Fitness" className="h-[130px] w-auto" />
            </div>

            {!done ? (
              <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="rounded-3xl border border-border/10 bg-overlay/5 px-8 py-8 shadow-2xl shadow-black/40 sm:px-10"
              >
                <div className="mb-6 flex flex-col items-center gap-3 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <KeyRound className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">Set New Password</h1>
                    <p className="mt-1 text-sm text-muted">Must be at least 8 characters.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold text-foreground/80">New Password</span>
                    <input
                      type="password" required minLength={8}
                      placeholder="Create new password"
                      value={passwords.password}
                      onChange={(e) => setPasswords((p) => ({ ...p, password: e.target.value }))}
                      className="h-11 w-full rounded-xl border border-border/10 bg-overlay/5 px-4 text-sm text-foreground placeholder:text-subtle outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold text-foreground/80">Confirm Password</span>
                    <input
                      type="password" required
                      placeholder="Confirm new password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                      className="h-11 w-full rounded-xl border border-border/10 bg-overlay/5 px-4 text-sm text-foreground placeholder:text-subtle outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                    />
                  </label>

                  {error && <p className="text-xs text-red-400">{error}</p>}

                  <button type="submit" disabled={loading}
                    className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-primary to-blue-700 disabled:opacity-60 text-foreground font-bold text-base shadow-lg hover:shadow-primary/30 transition-all">
                    {loading
                      ? <span className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      : "Reset Password"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/auth" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Login
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl border border-border/10 bg-overlay/5 px-8 py-12 shadow-2xl shadow-black/40 sm:px-10 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
                  className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
                >
                  <CheckCircle className="h-9 w-9 text-primary" />
                </motion.div>
                <h2 className="text-xl font-bold text-foreground">Password Reset!</h2>
                <p className="mt-2 text-sm text-muted">Your password has been updated successfully.</p>
                <Link to="/auth"
                  className="mt-8 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-primary to-blue-700 text-foreground font-bold text-base shadow-lg hover:shadow-primary/30 transition-all">
                  Back to Login
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
