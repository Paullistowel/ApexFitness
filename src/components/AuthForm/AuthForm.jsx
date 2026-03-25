import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import ApexLogo from "../../Assets/ApexFitness.logo.png";
import GoogleLogo from "../../Assets/google (1).png";
import OnboardingModal from "./OnboardingModal";
import Field from "../Shared/Field";
import useAuthStore from "../../store/authStore";
import api from "../../lib/api";

/* ─── Validators ─────────────────────────────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PW_RE    = /^(?=.*[0-9!@#$%^&*]).{8,}$/; // min 8 chars + 1 number or special

function validateLogin({ email, password }) {
  const e = {};
  if (!email.trim())             e.email    = "Email is required.";
  else if (!EMAIL_RE.test(email)) e.email   = "Enter a valid email address.";
  if (!password)                  e.password = "Password is required.";
  return e;
}

function validateSignup({ name, email, password, confirmPassword }) {
  const e = {};
  if (!name.trim() || name.trim().length < 2)
    e.name = "Full name must be at least 2 characters.";
  if (!email.trim())              e.email    = "Email is required.";
  else if (!EMAIL_RE.test(email)) e.email    = "Enter a valid email address.";
  if (!password)                  e.password = "Password is required.";
  else if (!PW_RE.test(password)) e.password = "Min 8 chars with a number or special character.";
  if (!confirmPassword)           e.confirmPassword = "Please confirm your password.";
  else if (confirmPassword !== password) e.confirmPassword = "Passwords do not match.";
  return e;
}

/* ─── AuthForm ───────────────────────────────────────────────────────────── */
export default function AuthForm() {
  const [tab,  setTab]  = useState("login");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isGoogleOnboarding, setIsGoogleOnboarding] = useState(false);
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, setUser } = useAuthStore();

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      try {
        const { data } = await api.post("/auth/google", { access_token });
        localStorage.setItem("apex-token", data.accessToken);
        setUser(data.user);
        if (data.isNewUser) {
          setIsGoogleOnboarding(true);
          setShowOnboarding(true);
        } else {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Google login failed", err);
      }
    },
    flow: "implicit",
  });

  /* Login state */
  const [loginFields, setLoginFields] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});

  /* Signup state */
  const [signupFields, setSignupFields] = useState({
    name: "", email: "", password: "", confirmPassword: "",
  });
  const [signupErrors, setSignupErrors] = useState({});

  const setLogin  = (k) => (e) => setLoginFields  ((p) => ({ ...p, [k]: e.target.value }));
  const setSignup = (k) => (e) => setSignupFields ((p) => ({ ...p, [k]: e.target.value }));

  async function handleLoginSubmit(e) {
    e.preventDefault();
    const errs = validateLogin(loginFields);
    if (Object.keys(errs).length) { setLoginErrors(errs); return; }
    setLoginErrors({});
    const result = await login(loginFields.email, loginFields.password);
    if (result.success) navigate("/dashboard");
  }

  function handleSignupSubmit(e) {
    e.preventDefault();
    const errs = validateSignup(signupFields);
    if (Object.keys(errs).length) { setSignupErrors(errs); return; }
    setSignupErrors({});
    setShowOnboarding(true);
  }

  /* Reset errors when switching tabs */
  function switchTab(t) {
    setTab(t);
    setLoginErrors({});
    setSignupErrors({});
    clearError();
  }

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
        className="rounded-3xl border border-border/10 bg-overlay/5 px-8 py-8 shadow-2xl shadow-black/40 sm:px-10 sm:py-9"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
      >
        {/* Tab switcher */}
        <div className="mb-8 flex rounded-xl border border-border/10 bg-black/30 p-1">
          {["login", "signup"].map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
                tab === t
                  ? "bg-gradient-to-r from-primary to-blue-700 text-foreground shadow-md"
                  : "text-muted hover:text-gray-200"
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
              onSubmit={handleLoginSubmit}
              noValidate
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <Field
                label="Email" placeholder="Enter your email" type="email" required
                value={loginFields.email} onChange={setLogin("email")} error={loginErrors.email}
              />
              <Field
                label="Password" placeholder="Enter your password" type="password" required
                value={loginFields.password} onChange={setLogin("password")} error={loginErrors.password}
              />

              <div className="text-right">
                <Link to="/forgot-password" className="text-xs text-primary hover:text-primary transition-colors">
                  Forgot password?
                </Link>
              </div>

              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}

              <div className="space-y-3 pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 w-full rounded-xl bg-gradient-to-r from-primary to-blue-700 hover:from-primary hover:to-blue-700 text-foreground font-bold text-base shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-overlay/10" />
                  <span className="text-sm text-subtle">or</span>
                  <div className="h-px flex-1 bg-overlay/10" />
                </div>

                <button
                  type="button"
                  onClick={googleLogin}
                  className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-border/10 bg-overlay/5 hover:bg-overlay/10 text-foreground/80 hover:text-foreground text-sm font-medium transition-all"
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
              onSubmit={handleSignupSubmit}
              noValidate
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <Field
                label="Full Name" placeholder="Enter your name" required
                value={signupFields.name} onChange={setSignup("name")} error={signupErrors.name}
              />

              <Field
                label="Email" placeholder="Enter your email" type="email" required
                value={signupFields.email} onChange={setSignup("email")} error={signupErrors.email}
              />
              <Field
                label="Password" placeholder="Min 8 chars + number or symbol" type="password" required
                value={signupFields.password} onChange={setSignup("password")} error={signupErrors.password}
              />
              <Field
                label="Confirm Password" placeholder="Confirm your password" type="password" required
                value={signupFields.confirmPassword} onChange={setSignup("confirmPassword")} error={signupErrors.confirmPassword}
              />

              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  className="h-11 w-full rounded-xl bg-gradient-to-r from-primary to-blue-700 hover:from-primary hover:to-blue-700 text-foreground font-bold text-base shadow-lg hover:shadow-primary/30 transition-all"
                >
                  Create Account
                </button>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-overlay/10" />
                  <span className="text-sm text-subtle">or</span>
                  <div className="h-px flex-1 bg-overlay/10" />
                </div>

                <button
                  type="button"
                  onClick={googleLogin}
                  className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-border/10 bg-overlay/5 hover:bg-overlay/10 text-foreground/80 hover:text-foreground text-sm font-medium transition-all"
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
        <OnboardingModal
          signupData={signupFields}
          isGoogleAuth={isGoogleOnboarding}
          onClose={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
}
