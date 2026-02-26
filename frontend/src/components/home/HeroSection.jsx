"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircleIcon,
  PlayIcon,
  ShieldCheckIcon,
  ClockIcon,
  RocketLaunchIcon,
  SparklesIcon,
  FireIcon,
  TrophyIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import { heroSlides } from "../../data/homeData";

// Helper function to get the appropriate icon component
const getCtaIcon = (iconType) => {
  switch (iconType) {
    case "rocket":
      return RocketLaunchIcon;
    case "sparkles":
      return SparklesIcon;
    case "fire":
      return FireIcon;
    default:
      return RocketLaunchIcon;
  }
};

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const backgroundVideoUrl = "/hero-bg-network.mp4";

  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const attemptPlay = () => {
      const playPromise = videoEl.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(() => {
          videoEl.muted = true;
          videoEl.play().catch(() => undefined);
        });
      }
    };

    attemptPlay();
  }, []);

  const currentSlide = heroSlides[activeSlide];
  const CtaIcon = getCtaIcon(currentSlide.ctaIconType);

  return (
    <section
      ref={heroRef}
      className="relative isolate overflow-hidden text-white"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          controls={false}
          aria-hidden="true"
          crossOrigin="anonymous"
          poster="/images/slide1image.webp"
        >
          <source src={backgroundVideoUrl} type="video/mp4" />
        </video>
        {/* Strong overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#010b1a]/95 via-[#010b1a]/80 to-[#010b1a]/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            className={`transition-all duration-700 ${isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
              }`}
          >
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight">
              {currentSlide.title}
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#00e4fc] via-[#00ffce] to-[#00e4fc]">
                {currentSlide.subtitle}
              </span>
            </h1>

            <p className="text-lg text-white/90 leading-relaxed max-w-xl mb-8 font-light">
              {currentSlide.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-5 mb-10">
              <Link
                href="/Contact-us"
                className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white transition-all duration-200 bg-gradient-to-r from-[#00e4fc] to-[#00ffce] rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00e4fc] hover:shadow-[0_0_30px_rgba(0,255,206,0.5)] hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#00ffce] to-[#00e4fc] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:animate-shine" />

                <CtaIcon className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">{currentSlide.ctaText}</span>
              </Link>
            </div>

            {/* Features Grid */}
            <div className="flex flex-wrap gap-4 border-t border-white/10 pt-6">
              {[
                { icon: CheckCircleIcon, text: "Strategy to Launch" },
                { icon: ClockIcon, text: "Agile Delivery" },
                { icon: TrophyIcon, text: "Outcome Driven" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
                    <item.icon className="w-4 h-4 text-[#00ffce]" />
                  </div>
                  <span className="font-medium text-white/90 text-sm">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Enquiry Form Card */}
          <div className="relative mt-12 lg:mt-0 max-w-lg mx-auto w-full">
            {/* Glow effect behind */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-[#00e4fc]/30 to-[#00ffce]/30 rounded-3xl blur-xl opacity-70"></div>

            <div className="relative bg-[#0B1120]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
              {/* Decorative top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00ffce] to-transparent opacity-60"></div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-white tracking-widest mb-2 font-sans">ENQUIRY NOW</h3>
                <p className="text-white font-medium text-lg">Transform Your Business</p>
                <p className="text-white/70 text-sm mt-1">Get a Custom Quote Today</p>
              </div>

              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/90 uppercase tracking-wider ml-1">Name</label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      className="w-full bg-[#1e293b]/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#00ffce]/60 focus:ring-1 focus:ring-[#00ffce]/50 transition-all text-sm hover:border-[#00e4fc]/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/90 uppercase tracking-wider ml-1">Phone</label>
                    <input
                      type="tel"
                      placeholder="Your phone number"
                      className="w-full bg-[#1e293b]/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#00ffce]/60 focus:ring-1 focus:ring-[#00ffce]/50 transition-all text-sm hover:border-[#00e4fc]/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/90 uppercase tracking-wider ml-1">Email</label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      className="w-full bg-[#1e293b]/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#00ffce]/60 focus:ring-1 focus:ring-[#00ffce]/50 transition-all text-sm hover:border-[#00e4fc]/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/90 uppercase tracking-wider ml-1">Inquiry Type</label>
                    <div className="relative">
                      <select className="w-full bg-[#1e293b]/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ffce]/60 focus:ring-1 focus:ring-[#00ffce]/50 transition-all text-sm appearance-none cursor-pointer hover:border-[#00e4fc]/40">
                        <option className="bg-[#0f172a]">Select inquiry type</option>
                        <option className="bg-[#0f172a]">Web Development</option>
                        <option className="bg-[#0f172a]">Mobile App</option>
                        <option className="bg-[#0f172a]">Digital Marketing</option>
                        <option className="bg-[#0f172a]">Other</option>
                      </select>
                      <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00ffce] pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/90 uppercase tracking-wider ml-1">Message</label>
                  <textarea
                    rows="3"
                    placeholder="Tell us about your project..."
                    className="w-full bg-[#1e293b]/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#00ffce]/60 focus:ring-1 focus:ring-[#00ffce]/50 transition-all text-sm resize-none hover:border-[#00e4fc]/40"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00e4fc] to-[#00ffce] hover:from-[#00d4e8] hover:to-[#00e8c0] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#00ffce]/30 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-[#00ffce]/40 mt-4 text-base tracking-wide"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-3 mt-16 lg:mt-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === activeSlide
                ? "w-12 bg-gradient-to-r from-[#00e4fc] to-[#00ffce]"
                : "w-3 bg-white/20 hover:bg-white/40"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
