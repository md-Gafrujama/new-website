'use client';
import React from "react";
import Link from "next/link";
import { 
  FaLinkedinIn, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaArrowRight, 
  FaRocket,
  FaPhone,
  FaTwitter,
  FaFacebookF,
  FaInstagram
} from "react-icons/fa";
import {
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  MegaphoneIcon,
  PaintBrushIcon,
  CloudIcon,
  LightBulbIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  HeartIcon,
  AcademicCapIcon,
  ShoppingCartIcon
} from "@heroicons/react/24/solid";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A2540] text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#00BFA6] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#00BFA6] rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#00BFA6] rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Decorative Top Border */}
      <div className="h-1 bg-gradient-to-r from-[#00BFA6] via-[#0A2540] to-[#00BFA6]"></div>

      <div className="relative z-10 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12 border-b-2 border-white/20">
          
          {/* Column 1 - About Quore B2B */}
          <div className="flex flex-col space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00BFA6] to-[#0A2540] rounded-lg flex items-center justify-center shrink-0">
                  <FaRocket className="text-white" size={20} />
                </div>
                <h3 className="font-bold text-2xl bg-gradient-to-r from-[#00BFA6] to-white bg-clip-text text-transparent whitespace-nowrap">
                  Quore B2B
                </h3>
              </div>
              <div className="w-20 h-1 bg-gradient-to-r from-[#00BFA6] to-[#0A2540] rounded-full mb-6"></div>
            </div>
            
            <div className="flex-grow">
              <p className="text-white/80 leading-relaxed text-sm hover:text-white transition-colors duration-300 font-medium">
                We craft innovative digital experiences that propel businesses forward. From cutting-edge web development to AI-powered solutions, we're your partner in digital transformation.
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4 mt-6">
              <a 
                href="https://www.linkedin.com/company/quore-b2b" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-[#00BFA6] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <FaLinkedinIn size={18} />
              </a>
              <a 
                href="https://twitter.com/quoreb2b" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-[#00BFA6] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <FaTwitter size={18} />
              </a>
              <a 
                href="https://facebook.com/quoreb2b" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-[#00BFA6] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <FaFacebookF size={18} />
              </a>
              <a 
                href="https://instagram.com/quoreb2b" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-[#00BFA6] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <FaInstagram size={18} />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="flex flex-col">
            <div className="mb-6">
              <h3 className="font-bold text-xl text-white hover:text-[#00BFA6] transition-colors duration-300 cursor-pointer whitespace-nowrap mb-5">
                Quick Links
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-[#00BFA6] to-[#0A2540] rounded-full"></div>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/" 
                  className="group flex items-center gap-2 text-white/80 hover:text-[#00BFA6] transition-all duration-300"
                >
                  <FaArrowRight className="text-[#00BFA6] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 shrink-0" size={12} />
                  <span className="group-hover:translate-x-2 transition-transform duration-300 font-semibold">Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/About-us" 
                  className="group flex items-center gap-2 text-white/80 hover:text-[#00BFA6] transition-all duration-300"
                >
                  <FaArrowRight className="text-[#00BFA6] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 shrink-0" size={12} />
                  <span className="group-hover:translate-x-2 transition-transform duration-300 font-semibold">About Us</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Our-services" 
                  className="group flex items-center gap-2 text-white/80 hover:text-[#00BFA6] transition-all duration-300"
                >
                  <FaArrowRight className="text-[#00BFA6] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 shrink-0" size={12} />
                  <span className="group-hover:translate-x-2 transition-transform duration-300 font-semibold">Our Services</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Our-solutions" 
                  className="group flex items-center gap-2 text-white/80 hover:text-[#00BFA6] transition-all duration-300"
                >
                  <FaArrowRight className="text-[#00BFA6] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 shrink-0" size={12} />
                  <span className="group-hover:translate-x-2 transition-transform duration-300 font-semibold">Our Solutions</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Contact-us" 
                  className="group flex items-center gap-2 text-white/80 hover:text-[#00BFA6] transition-all duration-300"
                >
                  <FaArrowRight className="text-[#00BFA6] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 shrink-0" size={12} />
                  <span className="group-hover:translate-x-2 transition-transform duration-300 font-semibold">Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Our Services */}
          <div className="flex flex-col">
            <div className="mb-6">
              <h3 className="font-bold text-xl text-white hover:text-[#00BFA6] transition-colors duration-300 cursor-pointer whitespace-nowrap mb-5">
                Our Services
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-[#00BFA6] to-[#0A2540] rounded-full"></div>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/Services/Website-Design-Development" 
                  className="group flex items-start gap-2 text-white/80 hover:text-[#00BFA6] transition-all duration-300"
                >
                  <ComputerDesktopIcon className="w-4 h-4 text-[#00BFA6] opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shrink-0 mt-0.5" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300 font-semibold leading-tight">Website Design & Development</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Services/Mobile-App-Development" 
                  className="group flex items-center gap-2 text-white/80 hover:text-[#00BFA6] transition-all duration-300"
                >
                  <DevicePhoneMobileIcon className="w-4 h-4 text-[#00BFA6] opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300 font-semibold">Mobile App Development</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Services/Digital-Marketing" 
                  className="group flex items-center gap-2 text-white/80 hover:text-[#00BFA6] transition-all duration-300"
                >
                  <MegaphoneIcon className="w-4 h-4 text-[#00BFA6] opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300 font-semibold">Digital Marketing</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Services/Branding-Creative-Design" 
                  className="group flex items-center gap-2 text-white/80 hover:text-[#00BFA6] transition-all duration-300"
                >
                  <PaintBrushIcon className="w-4 h-4 text-[#00BFA6] opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300 font-semibold">Branding & Design</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Services/Cloud-Hosting-Support" 
                  className="group flex items-center gap-2 text-white/80 hover:text-[#00BFA6] transition-all duration-300"
                >
                  <CloudIcon className="w-4 h-4 text-[#00BFA6] opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300 font-semibold">Cloud & Support</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Services/Tech-Consulting" 
                  className="group flex items-center gap-2 text-white/80 hover:text-[#00BFA6] transition-all duration-300"
                >
                  <LightBulbIcon className="w-4 h-4 text-[#00BFA6] opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300 font-semibold">Tech Consulting</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Our Solutions */}
          <div className="flex flex-col">
            <div className="mb-6">
              <h3 className="font-bold text-xl text-white hover:text-[#00BFA6] transition-colors duration-300 cursor-pointer whitespace-nowrap mb-5">
                Our Solutions
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-[#00BFA6] to-[#0A2540] rounded-full"></div>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/Solutions/CRM-Solutions" 
                  className="group flex items-center gap-2 text-white/80 hover:text-[#00BFA6] transition-all duration-300"
                >
                  <UserGroupIcon className="w-4 h-4 text-[#00BFA6] opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300 font-semibold">CRM Solutions</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Solutions/HRMS-Solutions" 
                  className="group flex items-center gap-2 text-white/80 hover:text-[#00BFA6] transition-all duration-300"
                >
                  <BuildingOfficeIcon className="w-4 h-4 text-[#00BFA6] opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300 font-semibold">HRMS Solutions</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Solutions/AI-Content-Automation" 
                  className="group flex items-start gap-2 text-white/80 hover:text-[#00BFA6] transition-all duration-300"
                >
                  <SparklesIcon className="w-4 h-4 text-[#00BFA6] opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shrink-0 mt-0.5" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300 font-semibold leading-tight">AI Content Automation</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Solutions/Healthcare-Appointment" 
                  className="group flex items-start gap-2 text-white/80 hover:text-[#00BFA6] transition-all duration-300"
                >
                  <HeartIcon className="w-4 h-4 text-[#00BFA6] opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shrink-0 mt-0.5" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300 font-semibold leading-tight">Healthcare Solutions</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Solutions/Learning-Management-System" 
                  className="group flex items-center gap-2 text-white/80 hover:text-[#00BFA6] transition-all duration-300"
                >
                  <AcademicCapIcon className="w-4 h-4 text-[#00BFA6] opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300 font-semibold">LMS Solutions</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Solutions/Ecommerce-Solutions" 
                  className="group flex items-center gap-2 text-white/80 hover:text-[#00BFA6] transition-all duration-300"
                >
                  <ShoppingCartIcon className="w-4 h-4 text-[#00BFA6] opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300 font-semibold">E-commerce Solutions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5 - Connect With Us */}
          <div className="flex flex-col">
            <div className="mb-6">
              <h3 className="font-bold text-xl text-white hover:text-[#00BFA6] transition-colors duration-300 cursor-pointer whitespace-nowrap mb-5">
                Connect With Us
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-[#00BFA6] to-[#0A2540] rounded-full"></div>
            </div>

            {/* Phone Section */}
            <div className="group mb-6">
              <h4 className="font-semibold mb-3 text-xs uppercase tracking-wider text-white/90">Call Us</h4>
              <a 
                href="tel:+15551234567" 
                className="flex items-start gap-3 text-[#00BFA6] hover:text-white transition-all duration-300 group"
              >
                <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#00BFA6]/20 group-hover:bg-gradient-to-br group-hover:from-[#00BFA6] group-hover:to-[#0A2540] transition-all duration-300 shrink-0 mt-0.5">
                  <FaPhone className="text-[#00BFA6] group-hover:text-white transition-colors duration-300" size={14} />
                </span>
                <span className="group-hover:translate-x-1 transition-transform duration-300 text-sm font-medium leading-tight">
                  +1 (555) 123-4567
                </span>
              </a>
            </div>

            {/* Email Section */}
            <div className="group mb-8">
              <h4 className="font-semibold mb-3 text-xs uppercase tracking-wider text-white/90">Email Us</h4>
              <a 
                href="mailto:info@quoreb2b.com" 
                className="flex items-start gap-3 text-[#00BFA6] hover:text-white transition-all duration-300 group"
              >
                <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#00BFA6]/20 group-hover:bg-gradient-to-br group-hover:from-[#00BFA6] group-hover:to-[#0A2540] transition-all duration-300 shrink-0 mt-0.5">
                  <FaEnvelope className="text-[#00BFA6] group-hover:text-white transition-colors duration-300" size={14} />
                </span>
                <span className="group-hover:translate-x-1 transition-transform duration-300 text-sm font-medium leading-tight break-all">
                  info@quoreb2b.com
                </span>
              </a>
            </div> 

            {/* Address Section */}
            <div className="group">
              <h4 className="font-semibold mb-3 text-xs uppercase tracking-wider text-white/90">Visit Us</h4>
              <div className="flex items-start gap-3 text-white/70">
                <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 shrink-0 mt-0.5">
                  <FaMapMarkerAlt className="text-[#00BFA6]" size={14} />
                </span>
                <span className="text-white/80 leading-relaxed text-sm font-medium">
                  123 Digital Avenue<br />
                  Tech District, CA 94105<br />
                  United States
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section with Legal Links */}
        <div className="border-t border-white/20 pt-8 mt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm">
              <Link 
                href="/Privacy-policy" 
                className="text-white/70 hover:text-[#00BFA6] transition-colors duration-300 font-medium"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/Terms-of-use" 
                className="text-white/70 hover:text-[#00BFA6] transition-colors duration-300 font-medium"
              >
                Terms of Use
              </Link>
              <Link 
                href="/cookies-policy" 
                className="text-white/70 hover:text-[#00BFA6] transition-colors duration-300 font-medium"
              >
                Cookies Policy
              </Link>
              <Link 
                href="/sitemap" 
                className="text-white/70 hover:text-[#00BFA6] transition-colors duration-300 font-medium"
              >
                Sitemap
              </Link>
            </div>

           
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 pt-8 border-t border-white/10">
          <p className="text-sm text-white/70">
            © {currentYear} <span className="text-[#00BFA6] font-bold">Quore B2B</span>. All rights reserved. | 
            <span className="text-white/60 ml-1">Transforming Digital Futures</span>
          </p>
          <p className="text-xs text-white/50 mt-2">
            Empowering businesses through innovative technology solutions and digital transformation.
          </p>
        </div>
      </div>

      {/* Custom CSS for enhanced animations */}
      <style jsx>{`
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(0, 191, 166, 0.3);
          }
          50% { 
            box-shadow: 0 0 30px rgba(0, 191, 166, 0.6);
          }
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
}
