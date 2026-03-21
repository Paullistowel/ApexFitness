import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import ContactInfoCard from "../../components/ContactPage/ContactInfoCard";
import SelectField from "../../components/Shared/SelectField";

const SUBJECT_OPTIONS = [
  { label: "Membership Enquiry",  value: "membership" },
  { label: "Personal Training",   value: "training"   },
  { label: "Programs & Classes",  value: "programs"   },
  { label: "Billing & Payments",  value: "billing"    },
  { label: "Other",               value: "other"      },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" },
  }),
};

const contactInfo = [
  {
    icon: MapPin,
    label: "Our Location",
    value: "123 Fitness Ave, Accra, Ghana",
    sub: "Come visit us in person",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Phone,
    label: "Phone Number",
    value: "+233 20 123 4567",
    sub: "Mon–Fri, 6am – 10pm",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Mail,
    label: "Email Address",
    value: "hello@apexfitness.com",
    sub: "We reply within 24 hours",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "24 / 7 Access",
    sub: "Staff: 6am – 10pm weekdays",
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "Youtube" },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="bg-surface">

      {/* ── Hero Banner ── */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        {/* dot grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,165,0,0.35) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* glow blob */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-block text-primary font-semibold text-sm uppercase tracking-widest mb-4"
          >
            Get In Touch
          </motion.span>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
          >
            Contact{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-700">
              Us
            </span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-muted text-lg mt-6 max-w-xl mx-auto leading-relaxed"
          >
            Have a question or ready to start your fitness journey? We'd love to
            hear from you. Drop us a message and we'll get back to you.
          </motion.p>
        </div>
      </section>

      {/* ── Info Cards ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {contactInfo.map((item, i) => (
            <ContactInfoCard key={item.label} {...item} index={i} />
          ))}
        </div>
      </section>

      {/* ── Form + Map ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Form */}
          <motion.div
            className="lg:col-span-3 rounded-2xl bg-overlay/5 border border-border/5 p-8 sm:p-10"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <CheckCircle className="w-16 h-16 text-primary" />
                </motion.div>
                <h3 className="text-2xl font-bold text-foreground">Message Sent!</h3>
                <p className="text-muted max-w-sm">
                  Thanks for reaching out. Our team will get back to you within
                  24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="mt-4 text-primary hover:text-primary text-sm font-medium underline underline-offset-4 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Send a Message
                </h2>
                <p className="text-muted text-sm mb-8">
                  Fill in the form and we'll respond as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-muted text-sm font-medium">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="bg-overlay/5 border border-border/10 focus:border-primary/60 outline-none rounded-xl px-4 py-3 text-foreground placeholder-gray-600 text-sm transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-muted text-sm font-medium">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="bg-overlay/5 border border-border/10 focus:border-primary/60 outline-none rounded-xl px-4 py-3 text-foreground placeholder-gray-600 text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <SelectField
                    label="Subject"
                    options={SUBJECT_OPTIONS}
                    value={form.subject}
                    onChange={(val) => setForm((prev) => ({ ...prev, subject: val }))}
                    required
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      className="bg-overlay/5 border border-border/10 focus:border-primary/60 outline-none rounded-xl px-4 py-3 text-foreground placeholder-gray-600 text-sm transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-blue-700 hover:from-primary hover:to-blue-700 disabled:opacity-60 text-foreground px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            {/* Map embed */}
            <div className="rounded-2xl overflow-hidden border border-border/5 h-56 sm:h-72">
              <iframe
                title="Apex Fitness Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127073.46900629994!2d-0.2698200000000001!3d5.6036987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xbed14ed8650e2dd3!2sAccra%2C%20Ghana!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Social / extra info */}
            <div className="rounded-2xl bg-overlay/5 border border-border/5 p-6 flex flex-col gap-5">
              <div>
                <h3 className="text-foreground font-bold text-lg mb-1">
                  Follow Us
                </h3>
                <p className="text-muted text-sm">
                  Stay up to date with workouts, tips & offers.
                </p>
              </div>
              <div className="flex gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-10 h-10 rounded-full bg-overlay/5 hover:bg-primary border border-border/5 hover:border-primary flex items-center justify-center transition-all duration-300 group"
                  >
                    <s.icon className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
                  </a>
                ))}
              </div>

              <div className="border-t border-border/5 pt-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-muted text-sm">
                    Gym is currently{" "}
                    <span className="text-green-400 font-semibold">Open</span>
                  </span>
                </div>
                <p className="text-muted text-sm leading-relaxed">
                  Walk-ins welcome! Free 3-day trial available for new members —
                  no commitment required.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
