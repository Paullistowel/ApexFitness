import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import Field from "../Shared/Field";
import SelectField from "../Shared/SelectField";
import ProgressDots from "../Shared/ProgressDots";

const SPECIALTY_OPTIONS = [
  "Strength Training",
  "Cardio & Endurance",
  "HIIT",
  "Yoga & Flexibility",
  "Weight Loss",
  "Muscle Building",
  "Sports Performance",
  "Rehabilitation",
];

const CERT_OPTIONS = [
  "NASM-CPT",
  "ACE-CPT",
  "ISSA-CPT",
  "NSCA-CSCS",
  "CrossFit L1",
  "RYT-200 (Yoga)",
  "Other",
];

const AVAILABILITY_OPTIONS = [
  "Weekdays (Mon–Fri)",
  "Weekends Only",
  "Full Week",
  "Flexible",
];

const MAX_CLIENTS_OPTIONS = ["1–5", "6–10", "11–20", "20+"];

const variants = {
  enter: (d) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit:  (d) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
};

export default function TrainerOnboardingModal({ onClose }) {
  const [step, setStep]           = useState(1);
  const [direction, setDirection] = useState(1);

  /* Step 1 */
  const [experience,   setExperience]   = useState("");
  const [specialties,  setSpecialties]  = useState([]);
  const [certification, setCertification] = useState("");

  /* Step 2 */
  const [availability, setAvailability] = useState("");
  const [maxClients,   setMaxClients]   = useState("");
  const [bio,          setBio]          = useState("");

  const [errors, setErrors] = useState({});

  const toggleSpecialty = (s) =>
    setSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  function validateStep1() {
    const e = {};
    if (!experience.trim()) e.experience = "Years of experience is required.";
    else if (isNaN(experience) || +experience < 0 || +experience > 50) e.experience = "Enter a valid number.";
    if (specialties.length === 0) e.specialties = "Select at least one specialty.";
    if (!certification) e.certification = "Please select a certification.";
    return e;
  }

  function validateStep2() {
    const e = {};
    if (!availability) e.availability = "Please select your availability.";
    if (!maxClients)   e.maxClients   = "Please select a client capacity.";
    if (!bio.trim())   e.bio          = "A short bio is required.";
    return e;
  }

  function goNext() {
    const e = validateStep1();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setDirection(1);
    setStep(2);
  }

  function goFinish() {
    const e = validateStep2();
    if (Object.keys(e).length) { setErrors(e); return; }
    onClose();
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-lg rounded-3xl border border-border/10 bg-surface shadow-2xl shadow-black/60 overflow-hidden"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-1 w-full bg-gradient-to-r from-primary to-blue-700" />

          <div className="px-8 py-8 sm:px-10">
            {/* Header */}
            <div className="mb-7 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
                  Step {step} of 2
                </p>
                <h2 className="text-2xl font-bold text-foreground">
                  {step === 1 ? "Your Trainer Profile" : "Availability & Bio"}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {step === 1
                    ? "Tell us about your experience and specialties."
                    : "Set your capacity and introduce yourself to clients."}
                </p>
              </div>
              <button onClick={onClose} className="text-muted hover:text-foreground transition-colors mt-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps */}
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>

                {/* ── Step 1 ── */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={variants}
                    initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <Field
                        label="Years of Experience" placeholder="e.g. 5" required
                        value={experience} onChange={(e) => setExperience(e.target.value)}
                        error={errors.experience}
                      />
                      <SelectField
                        label="Certification" required
                        options={CERT_OPTIONS} value={certification}
                        onChange={setCertification} error={errors.certification}
                      />
                    </div>

                    {/* Specialties multi-select */}
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground/80">
                        Specialties <span className="text-primary">*</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {SPECIALTY_OPTIONS.map((s) => {
                          const active = specialties.includes(s);
                          return (
                            <button
                              type="button"
                              key={s}
                              onClick={() => toggleSpecialty(s)}
                              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                                active
                                  ? "bg-primary/15 border-primary/40 text-primary"
                                  : "bg-overlay/5 border-border/10 text-muted hover:border-border/20 hover:text-gray-200"
                              }`}
                            >
                              {active && <Check size={11} />}
                              {s}
                            </button>
                          );
                        })}
                      </div>
                      {errors.specialties && (
                        <p className="text-xs text-red-400">{errors.specialties}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ── Step 2 ── */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={variants}
                    initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <SelectField
                        label="Availability" required
                        options={AVAILABILITY_OPTIONS} value={availability}
                        onChange={setAvailability} error={errors.availability}
                      />
                      <SelectField
                        label="Max Clients" required
                        options={MAX_CLIENTS_OPTIONS} value={maxClients}
                        onChange={setMaxClients} error={errors.maxClients}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-semibold text-foreground/80">
                        Short Bio <span className="text-primary">*</span>
                      </span>
                      <textarea
                        rows={4}
                        placeholder="Tell clients a bit about yourself, your coaching style, and what to expect…"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className={`w-full rounded-xl border bg-overlay/5 px-4 py-3 text-sm text-foreground placeholder:text-subtle outline-none resize-none transition-colors focus:ring-2 ${
                          errors.bio
                            ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20"
                            : "border-border/10 focus:border-primary/60 focus:ring-primary/20"
                        }`}
                      />
                      {errors.bio && <p className="text-xs text-red-400">{errors.bio}</p>}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="mt-8 flex items-center justify-between">
              <ProgressDots active={step} />
              <div className="flex items-center gap-3">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => { setErrors({}); setDirection(-1); setStep(1); }}
                    className="h-11 px-5 rounded-xl border border-border/10 text-muted hover:text-foreground text-sm font-medium transition-all hover:bg-overlay/5"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={step === 1 ? goNext : goFinish}
                  className="h-11 px-7 rounded-xl bg-gradient-to-r from-primary to-blue-700 hover:from-primary hover:to-blue-700 text-foreground font-bold text-sm shadow-lg hover:shadow-primary/30 transition-all"
                >
                  {step === 1 ? "Continue →" : "Submit for Review →"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
