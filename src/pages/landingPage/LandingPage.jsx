import React from "react";
import NavBar from "../../components/LandingComponent/NavBar";
import Footer from "../../components/Shared/Footer";
import Hero from "../../components/LandingComponent/Hero";
import Features from "../../components/LandingComponent/Features";
import Services from "../../components/LandingComponent/Service";
import FAQ from "../../components/LandingComponent/FAQ";

const LandingPage = () => {
  return (
    <section className="min-h-screen ">
      <NavBar />
      <main>
        <Hero />
        <Features />
        <Services />
        <FAQ/>
      </main>
      <Footer />
    </section>
  );
};

export default LandingPage;
