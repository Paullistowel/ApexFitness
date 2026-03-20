import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import Beginner_blast from '../../Assets/image3.jpeg'
import Quick_burn from '../../Assets/image1.jpeg'
import Weight_Lifting from '../../Assets/image2.jpeg'
import Body_balancing from '../../Assets/image4.jpeg'
import MuScle_Stretch from '../../Assets/image6.jpeg'

const Services = () => {
  const programs = [
    {
      title: "Quick Burn",
      description:
        "High-intensity 30-minute workouts perfect for busy schedules.",
      image: Quick_burn,
      fallbackImage:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&auto=format&fit=crop",
    },
    {
      title: "Weight Lifting",
      description:
        "Build strength and muscle with expert-guided lifting programs.",
      image: Weight_Lifting,
      fallbackImage:
        "https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=600&auto=format&fit=crop",
    },
    {
      title: "Beginner Blast",
      description:
        "Start your fitness journey with foundational exercises and guidance.",
      image: Beginner_blast,
      fallbackImage:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop",
    },
    {
      title: "Body Balance",
      description:
        "Improve flexibility and core strength with yoga and pilates.",
      image: Body_balancing,
      fallbackImage:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop",
    },
    {
      title: "Daily Strength",
      description:
        "Consistent daily workouts to build lasting strength and endurance.",
      image: "/assets/daily-strength.jpg",
      fallbackImage:
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop",
    },
    {
      title: "Muscle Shredding",
      description:
        "Advanced programs for maximum muscle definition and conditioning.",
      image: MuScle_Stretch,
      fallbackImage:
        "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=600&auto=format&fit=crop",
    },
  ];

  return (
    <section id="programs" className="py-20 lg:py-32 bg-[#1a0f08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mt-3">
            Training <span className="text-orange-500">Programs</span>
          </h2>
          <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
            Choose from our variety of specialized programs designed to help you
            achieve your specific fitness goals.
          </p>
        </motion.div>

        {/* Programs Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/5 hover:border-orange-500/30 transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.55,
                delay: (index % 3) * 0.12,
                ease: "easeOut",
              }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = program.fallbackImage;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f08] via-[#1a0f08]/50 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-500 transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {program.description}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center flex-shrink-0 ml-4 group-hover:bg-orange-500 transition-colors">
                    <ArrowUpRight className="w-5 h-5 text-orange-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
