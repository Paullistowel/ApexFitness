import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What are your gym operating hours?",
      answer:
        "Our gym is open 24/7 for members. Front desk staff are available from 6 AM to 10 PM on weekdays and 8 AM to 8 PM on weekends.",
    },
    {
      question: "Do you offer personal training sessions?",
      answer:
        "Yes! We have certified personal trainers available for one-on-one sessions. Packages start from GHC50 per session, with discounts available for bulk purchases.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Absolutely! We offer a 3-day free trial that includes full access to all gym facilities, group classes, and a complimentary fitness assessment.",
    },
    {
      question: "What membership plans do you offer?",
      answer:
        "We offer flexible membership plans including Monthly (GHC49), Quarterly (GHC129), and Annual (GHC399) options. All plans include unlimited gym access and group classes.",
    },
    {
      question: "Are group fitness classes included in the membership?",
      answer:
        "Yes, all memberships include unlimited access to our group fitness classes including yoga, HIIT, spin, and strength training classes.",
    },
    {
      question: "Do you have locker rooms and showers?",
      answer:
        "Yes, we provide clean, modern locker rooms with secure lockers, showers, and amenities including towels and toiletries.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-32 bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mt-3">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-muted text-lg mt-4">
            Find answers to common questions about our gym and services.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
              className={`bg-overlay/5 border border-border/5 rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === index
                  ? "border-primary/30"
                  : "hover:border-border/10"
              }`}
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      openIndex === index ? "bg-primary" : "bg-primary/10"
                    }`}
                  >
                    <HelpCircle
                      className={`w-5 h-5 transition-colors ${
                        openIndex === index ? "text-foreground" : "text-primary"
                      }`}
                    />
                  </div>
                  <span className="text-foreground font-semibold text-lg">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-muted transition-transform duration-300 ${
                    openIndex === index ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-6 pl-20">
                  <p className="text-muted leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
