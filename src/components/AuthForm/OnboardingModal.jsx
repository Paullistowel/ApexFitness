import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import img1 from "../../Assets/image1.jpeg";
import img2 from "../../Assets/image2.jpeg";
import img5 from "../../Assets/image5.jpeg";
import Field from "../Shared/Field";
import SelectField from "../Shared/SelectField";
import ProgressDots from "../Shared/ProgressDots";

const goals = [
  { title: "Weight Loss", image: img1 },
  { title: "Muscle Gain", image: img2 },
  { title: "Maintain Fitness", image: img5 },
];

const GENDER_OPTIONS    = ["Male", "Female", "Non-binary", "Prefer not to say"];
const ACTIVITY_OPTIONS  = ["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Athlete"];
const TRAINING_OPTIONS  = ["Strength Training", "Cardio", "HIIT", "Yoga", "Mixed Routine"];
const DIETARY_OPTIONS   = ["None", "Vegetarian", "Vegan", "Gluten-Free", "Keto"];

export default function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const [age, setAge]                   = useState("");
  const [gender, setGender]             = useState("");
  const [height, setHeight]             = useState("");
  const [weight, setWeight]             = useState("");
  const [activityLevel, setActivityLevel] = useState("");

  const [selectedGoal, setSelectedGoal]         = useState("Weight Loss");
  const [targetWeight, setTargetWeight]         = useState("");
  const [trainingStyle, setTrainingStyle]       = useState("");
  const [dietaryRestriction, setDietaryRestriction] = useState("");

  const [errors, setErrors] = useState({});

  function validateStep1() {
    const e = {};
    if (!age.trim()) e.age = "Age is required.";
    else if (isNaN(age) || +age < 10 || +age > 100) e.age = "Enter a valid age.";
    if (!gender) e.gender = "Please select a gender.";
    if (!height.trim()) e.height = "Height is required.";
    else if (isNaN(height) || +height <= 0) e.height = "Enter a valid height.";
    if (!weight.trim()) e.weight = "Weight is required.";
    else if (isNaN(weight) || +weight <= 0) e.weight = "Enter a valid weight.";
    if (!activityLevel) e.activityLevel = "Please select an activity level.";
    return e;
  }

  function validateStep2() {
    const e = {};
    if (!targetWeight.trim()) e.targetWeight = "Target weight is required.";
    else if (isNaN(targetWeight) || +targetWeight <= 0) e.targetWeight = "Enter a valid weight.";
    if (!trainingStyle) e.trainingStyle = "Please select a training style.";
    if (!dietaryRestriction) e.dietaryRestriction = "Please select a dietary restriction.";
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

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit:  (d) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
  };

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
          className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#1a0f08] shadow-2xl shadow-black/60 overflow-hidden"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-orange-700" />

          <div className="px-8 py-8 sm:px-10">
            {/* Header */}
            <div className="mb-7 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-1">
                  Step {step} of 2
                </p>
                <h2 className="text-2xl font-bold text-white">
                  {step === 1 ? "Tell Us About You" : "Define Your Goals"}
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  {step === 1 ? "We'll personalize your fitness journey." : "Tailor your workout and diet plans."}
                </p>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors mt-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps */}
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                {step === 1 && (
                  <motion.div key="step1" custom={direction} variants={variants}
                    initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Age" placeholder="Enter age" required
                        value={age} onChange={(e) => setAge(e.target.value)} error={errors.age} />
                      <SelectField label="Gender" required
                        options={GENDER_OPTIONS} value={gender}
                        onChange={setGender} error={errors.gender} />
                      <Field label="Height" placeholder="Enter height" suffix="cm" required
                        value={height} onChange={(e) => setHeight(e.target.value)} error={errors.height} />
                      <Field label="Weight" placeholder="Enter weight" suffix="kg" required
                        value={weight} onChange={(e) => setWeight(e.target.value)} error={errors.weight} />
                    </div>
                    <SelectField label="Activity Level" required
                      options={ACTIVITY_OPTIONS} value={activityLevel}
                      onChange={setActivityLevel} error={errors.activityLevel} />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" custom={direction} variants={variants}
                    initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="space-y-5"
                  >
                    <div>
                      <p className="mb-3 text-sm font-semibold text-gray-300">Goal Type</p>
                      <div className="grid grid-cols-3 gap-3">
                        {goals.map((goal) => (
                          <button key={goal.title} type="button"
                            onClick={() => setSelectedGoal(goal.title)}
                            className={`group relative overflow-hidden rounded-xl border transition-all duration-200 hover:-translate-y-0.5 ${
                              selectedGoal === goal.title
                                ? "border-orange-500 ring-1 ring-orange-500/40"
                                : "border-white/10 hover:border-white/20"
                            }`}
                          >
                            <img src={goal.image} alt={goal.title}
                              className="h-20 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <span className={`absolute inset-x-0 bottom-1.5 text-center text-xs font-bold transition-colors ${
                              selectedGoal === goal.title ? "text-orange-400" : "text-white"
                            }`}>
                              {goal.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Target Weight" placeholder="Target weight" suffix="kg" required
                        value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} error={errors.targetWeight} />
                      <SelectField label="Training Style" required
                        options={TRAINING_OPTIONS} value={trainingStyle}
                        onChange={setTrainingStyle} error={errors.trainingStyle} />
                    </div>

                    <SelectField label="Dietary Restriction" required
                      options={DIETARY_OPTIONS} value={dietaryRestriction}
                      onChange={setDietaryRestriction} error={errors.dietaryRestriction} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="mt-8 flex items-center justify-between">
              <ProgressDots active={step} />
              <div className="flex items-center gap-3">
                {step === 2 && (
                  <button type="button"
                    onClick={() => { setErrors({}); setDirection(-1); setStep(1); }}
                    className="h-11 px-5 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm font-medium transition-all hover:bg-white/5"
                  >
                    Back
                  </button>
                )}
                <button type="button"
                  onClick={step === 1 ? goNext : goFinish}
                  className="h-11 px-7 rounded-xl bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-bold text-sm shadow-lg hover:shadow-orange-500/30 transition-all"
                >
                  {step === 1 ? "Continue →" : "Finish →"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
