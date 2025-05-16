import React from "react";
import CTASection from "./cta-section";
import FeaturesSection from "./features-section";
import HeroSection from "./hero-section";
import MissionSection from "./mission-section";

const HomePage = () => {
  return (
    <main>
      <HeroSection />
      <MissionSection />
      <FeaturesSection />
      <CTASection />
    </main>
  );
};

export default HomePage;
