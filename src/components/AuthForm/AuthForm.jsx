import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApexLogo from "../../Assets/ApexFitness.logo.png";
import GoogleLogo from "../../Assets/google (1).png";
import OnboardingModal from "./OnboardingModal";
import Field from "../Shared/Field";

export default function AuthForm() {
  const [tab, setTab] = useState("login");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[420px]">
      {/* Logo */}
      <motion.div
        className="mb-2 flex justify-center"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <img src={ApexLogo} alt="Apex Fitness" className="h-[140px] w-auto" />
      </motion.div>

      {/* Card */}
      <motion.div
        className="rounded-3xl border border-white/10 bg-white/5 px-8 py-8 shadow-2xl shadow-black/40 sm:px-10 sm:py-9"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
      >
        {/* Tab switcher */}
        <div className="mb-8 flex rounded-xl border border-white/10 bg-black/30 p-1">
          {["login", "signup"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
                tab === t
                  ? "bg-gradient-to-r from-orange-500 to-orange-700 text-white shadow-md"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {t === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── Login ── */}
          {tab === "login" && (
            <motion.form
              key="login"
              className="space-y-5"
              onSubmit={(e) => { e.preventDefault(); navigate("/dashboard"); }}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <Field label="Username / Email" placeholder="Enter your email" />
              <Field label="Password" placeholder="Enter your password" type="password" />

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="space-y-3 pt-1">
                <button
                  type="submit"
                  className="h-11 w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-bold text-base shadow-lg hover:shadow-orange-500/30 transition-all"
                >
                  Sign In
                </button>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-sm text-gray-600">or</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <button
                  type="button"
                  className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm font-medium transition-all"
                >
                  <img src={GoogleLogo} alt="Google" className="h-5 w-5" />
                  Continue with Google
                </button>
              </div>
            </motion.form>
          )}

          {/* ── Sign Up ── */}
          {tab === "signup" && (
            <motion.form
              key="signup"
              className="space-y-4"
              onSubmit={(e) => e.preventDefault()}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <Field label="Full Name" placeholder="Enter your name" />
              <Field label="Email" placeholder="Enter your email" type="email" />
              <Field label="Password" placeholder="Create a password" type="password" />
              <Field label="Confirm Password" placeholder="Confirm your password" type="password" />

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOnboarding(true)}
                  className="h-11 w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-bold text-base shadow-lg hover:shadow-orange-500/30 transition-all"
                >
                  Create Account
                </button>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-sm text-gray-600">or</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <button
                  type="button"
                  className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm font-medium transition-all"
                >
                  <img src={GoogleLogo} alt="Google" className="h-5 w-5" />
                  Continue with Google
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} />
      )}
    </div>
  );
}
