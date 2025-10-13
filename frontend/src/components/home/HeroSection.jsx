"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircleIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  PlayIcon,
  ShieldCheckIcon,
  ClockIcon,
  RocketLaunchIcon,
  SparklesIcon,
  FireIcon,
  BoltIcon,
  TrophyIcon,
  UsersIcon,
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
  const [scrollY, setScrollY] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const parallaxOffset = scrollY * 0.5;

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Get current slide data
  const currentSlide = heroSlides[activeSlide];
  const CtaIcon = getCtaIcon(currentSlide.ctaIconType);

  return (
    <section ref={heroRef} className="relative pt-32 pb-24 overflow-hidden min-h-screen flex items-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            transform: `translateY(${parallaxOffset}px)`,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${encodeURIComponent('0A2540')}' fill-opacity='0.03'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Dynamic Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentSlide.bgGradient} transition-all duration-1000`} />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-[#00BFA6]/20 to-[#0A2540]/20 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}} />
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-[#0A2540]/20 to-[#00BFA6]/20 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}} />
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-[#00BFA6]/30 to-[#0A2540]/30 rounded-full animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}} />
      </div>

      {/* Hero Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 group"
      >
        <ChevronLeftIcon className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 group"
      >
        <ChevronRightIcon className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Dynamic Hero Content */}
          <div className={`transition-all duration-1500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <h1 className="text-5xl lg:text-7xl font-black text-[#0A2540] mb-8 leading-tight">
              {currentSlide.title}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFA6] to-[#0A2540] block animate-pulse">
                {currentSlide.subtitle}
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-[#0A2540]/80 mb-10 leading-relaxed font-medium">
              {currentSlide.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 mb-12">
              <Link
                href="/Contact-us"
                className="group relative inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-[#00BFA6] to-[#00BFA6]/80 text-white font-bold text-lg rounded-3xl hover:from-[#00BFA6]/90 hover:to-[#00BFA6]/70 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CtaIcon className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                {currentSlide.ctaText}
                <ArrowRightIcon className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              
              <Link
                href="/Our-services"
                className="group inline-flex items-center justify-center px-10 py-5 bg-white/90 backdrop-blur-sm text-[#0A2540] font-bold text-lg rounded-3xl hover:bg-white transition-all duration-300 shadow-xl hover:shadow-2xl border border-[#0A2540]/10 hover:border-[#00BFA6]/30"
              >
                <PlayIcon className="w-6 h-6 mr-3 text-[#00BFA6] group-hover:animate-pulse" />
                Watch Demo
                <BoltIcon className="w-6 h-6 ml-3 text-[#00BFA6] group-hover:animate-spin" />
              </Link>
            </div>
            
            {/* Enhanced Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              {[
                { icon: CheckCircleIcon, text: "Free Consultation", color: "text-green-500" },
                { icon: ClockIcon, text: "24/7 Support", color: "text-blue-500" },
                { icon: ShieldCheckIcon, text: "Guaranteed Results", color: "text-purple-500" },
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50">
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                  <span className="font-semibold text-[#0A2540]">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Dynamic Hero Visual */}
          <div className={`relative transition-all duration-1500 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div className="relative">
              {/* Animated Rings */}
              <div className="absolute inset-0 animate-spin" style={{animationDuration: '20s'}}>
                <div className="w-full h-full border-4 border-dashed border-[#00BFA6]/30 rounded-full"></div>
              </div>
              <div className="absolute inset-4 animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}>
                <div className="w-full h-full border-4 border-dashed border-[#0A2540]/20 rounded-full"></div>
              </div>
              
              {/* Main Image Container with Dynamic Image */}
              <div className="relative bg-gradient-to-r from-white via-white to-white/90 rounded-3xl p-8 shadow-2xl backdrop-blur-sm border border-white/50">
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src={currentSlide.image}
                    alt="Dynamic Solutions"
                    width={700}
                    height={500}
                    className="w-full h-auto transform hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#00BFA6]/20 via-transparent to-[#0A2540]/20 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {/* Floating Stats Cards */}
                <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 animate-float">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#00BFA6] to-[#0A2540] rounded-xl flex items-center justify-center">
                      <TrophyIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#0A2540]">500+</div>
                      <div className="text-sm text-[#0A2540]/70">Projects</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 animate-float" style={{animationDelay: '1s'}}>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#0A2540] to-[#00BFA6] rounded-xl flex items-center justify-center">
                      <UsersIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#0A2540]">200+</div>
                      <div className="text-sm text-[#0A2540]/70">Clients</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Slide Indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === activeSlide 
                ? 'bg-[#00BFA6] scale-125' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-[#0A2540]/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[#00BFA6] rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float:nth-child(2) {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
