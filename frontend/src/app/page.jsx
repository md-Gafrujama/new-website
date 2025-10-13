"use client";

import { useState, useEffect } from "react";
import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import ServicesSection from "../components/home/ServicesSection";
import SolutionsSection from "../components/home/SolutionsSection";
import WhyChooseUsSection from "../components/home/WhyChooseUsSection";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA] overflow-x-hidden">
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <SolutionsSection />
      <WhyChooseUsSection />
    </div>
  );
}
