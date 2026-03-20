import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import ApexLogo from "../../Assets/ApexFitness.logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="">
            <img src={ApexLogo} alt="ApexFitness" className="h-[100px] w-auto" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-orange-500 transition-colors duration-300 text-sm font-medium uppercase tracking-wide"
              >
                {link.name}
              </a>
            ))}
            <Link
              to="/contact"
              className="text-gray-300 hover:text-orange-500 transition-colors duration-300 text-sm font-medium uppercase tracking-wide"
            >
              Contact Us
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-orange-600/30">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-orange-500 transition-colors duration-300 text-sm font-medium uppercase tracking-wide px-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <Link
                to="/contact"
                className="text-gray-300 hover:text-orange-500 transition-colors duration-300 text-sm font-medium uppercase tracking-wide px-2"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </Link>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 w-fit mx-2">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
