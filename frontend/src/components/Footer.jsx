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
  LightBulbIcon,
  FilmIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CloudIcon,
  HeartIcon,
  AcademicCapIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/solid";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden overflow-x-hidden text-white footer-container">
      {/* Background video */}
      <div className="absolute inset-0 video-wrapper">
        <video
          className="w-full h-full object-cover footer-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src="https://www.pexels.com/download/video/3129671/"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm video-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 footer-content">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12 border-b border-white/15">
          
          {/* Column 1 - About Quore B2B */}
          <div className="flex flex-col space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3 logo-container group">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0 logo-icon hover:bg-[#00e4fc]/20 transition-all duration-300 group-hover:text-[#00ffce]">
                  <FaRocket className="text-white group-hover:text-[#00ffce] logo-rocket transition-colors" size={20} />
                </div>
                <h3 className="font-bold text-2xl text-white whitespace-nowrap logo-text">
                  Quore B2B
                </h3>
              </div>
              <div className="w-20 h-0.5 bg-gradient-to-r from-[#00e4fc] to-[#00ffce] rounded-full mb-6 logo-underline"></div>
            </div>
            
            <div className="flex-grow">
              <p className="text-white/80 leading-relaxed text-sm">
                We craft innovative digital experiences that propel businesses forward. From cutting-edge web development to AI-powered solutions, we're your partner in digital transformation.
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-3 mt-4 social-icons">
              <a 
                href="https://www.linkedin.com/company/quore-b2b" 
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon w-10 h-10 border border-white/20 hover:border-white/60 rounded-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-1 text-white/80 hover:text-white bg-white/5 hover:bg-white/15 hover:shadow-lg hover:shadow-white/20"
              >
                <FaLinkedinIn size={18} />
              </a>
              <a 
                href="https://twitter.com/quoreb2b" 
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon w-10 h-10 border border-white/20 hover:border-white/60 rounded-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-1 text-white/80 hover:text-white bg-white/5 hover:bg-white/15 hover:shadow-lg hover:shadow-white/20"
              >
                <FaTwitter size={18} />
              </a>
              <a 
                href="https://facebook.com/quoreb2b" 
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon w-10 h-10 border border-white/20 hover:border-white/60 rounded-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-1 text-white/80 hover:text-white bg-white/5 hover:bg-white/15 hover:shadow-lg hover:shadow-white/20"
              >
                <FaFacebookF size={18} />
              </a>
              <a 
                href="https://instagram.com/quoreb2b" 
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon w-10 h-10 border border-white/20 hover:border-white/60 rounded-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-1 text-white/80 hover:text-white bg-white/5 hover:bg-white/15 hover:shadow-lg hover:shadow-white/20"
              >
                <FaInstagram size={18} />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="flex flex-col footer-column">
            <div className="mb-4">
              <h3 className="font-bold text-xl text-white whitespace-nowrap mb-4 section-title">
                Quick Links
              </h3>
              <div className="w-16 h-0.5 bg-white/20 rounded-full section-underline"></div>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/" 
                  className="group flex items-center gap-2 text-white/70 hover:text-[#00ffce] transition-all duration-150"
                >
                  <FaArrowRight className="text-white/40 group-hover:text-[#00ffce] group-hover:translate-x-1 transition-all duration-150 shrink-0" size={12} />
                  <span className="group-hover:translate-x-1 transition-transform duration-150 font-semibold">Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/About-us" 
                  className="group flex items-center gap-2 text-white/70 hover:text-[#00ffce] transition-all duration-150"
                >
                  <FaArrowRight className="text-white/40 group-hover:text-[#00ffce] group-hover:translate-x-1 transition-all duration-150 shrink-0" size={12} />
                  <span className="group-hover:translate-x-1 transition-transform duration-150 font-semibold">About Us</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Our-services" 
                  className="group flex items-center gap-2 text-white/70 hover:text-[#00ffce] transition-all duration-150"
                >
                  <FaArrowRight className="text-white/40 group-hover:text-[#00ffce] group-hover:translate-x-1 transition-all duration-150 shrink-0" size={12} />
                  <span className="group-hover:translate-x-1 transition-transform duration-150 font-semibold">Our Services</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Our-solutions" 
                  className="group flex items-center gap-2 text-white/70 hover:text-[#00ffce] transition-all duration-150"
                >
                  <FaArrowRight className="text-white/40 group-hover:text-[#00ffce] group-hover:translate-x-1 transition-all duration-150 shrink-0" size={12} />
                  <span className="group-hover:translate-x-1 transition-transform duration-150 font-semibold">Our Solutions</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Contact-us" 
                  className="group flex items-center gap-2 text-white/70 hover:text-[#00ffce] transition-all duration-150"
                >
                  <FaArrowRight className="text-white/40 group-hover:text-[#00ffce] group-hover:translate-x-1 transition-all duration-150 shrink-0" size={12} />
                  <span className="group-hover:translate-x-1 transition-transform duration-150 font-semibold">Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Our Services */}
          <div className="flex flex-col footer-column">
            <div className="mb-4">
              <h3 className="font-bold text-xl text-white whitespace-nowrap mb-4 section-title">
                Our Services
              </h3>
              <div className="w-16 h-0.5 bg-white/20 rounded-full section-underline"></div>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/Services/Website-Design-Development" 
                  className="group flex items-start gap-2 text-white/70 hover:text-[#00ffce] transition-all duration-150"
                >
                  <ComputerDesktopIcon className="w-4 h-4 text-white/60 group-hover:text-[#00ffce] transition-all duration-150 shrink-0 mt-0.5" />
                  <span className="group-hover:translate-x-1 transition-transform duration-150 font-semibold leading-tight">Website Design & Development</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Services/Mobile-App-Development" 
                  className="group flex items-center gap-2 text-white/70 hover:text-[#00ffce] transition-all duration-150"
                >
                  <DevicePhoneMobileIcon className="w-4 h-4 text-white/60 group-hover:text-[#00ffce] transition-all duration-150 shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-150 font-semibold">Mobile App Development</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Services/Digital-Marketing" 
                  className="group flex items-center gap-2 text-white/70 hover:text-[#00ffce] transition-all duration-150"
                >
                  <MegaphoneIcon className="w-4 h-4 text-white/60 group-hover:text-[#00ffce] transition-all duration-150 shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-150 font-semibold">Digital Marketing</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Services/SaaS-Development" 
                  className="group flex items-center gap-2 text-white/70 hover:text-[#00ffce] transition-all duration-150"
                >
                  <LightBulbIcon className="w-4 h-4 text-white/60 group-hover:text-[#00ffce] transition-all duration-150 shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-150 font-semibold">SaaS Product Development</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Services/Branding-Creative-Design" 
                  className="group flex items-center gap-2 text-white/70 hover:text-[#00ffce] transition-all duration-150"
                >
                  <PaintBrushIcon className="w-4 h-4 text-white/60 group-hover:text-[#00ffce] transition-all duration-150 shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-150 font-semibold">Branding & Design</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Services/Video-Editing-3D-Animation" 
                  className="group flex items-center gap-2 text-white/70 hover:text-[#00ffce] transition-all duration-150"
                >
                  <FilmIcon className="w-4 h-4 text-white/60 group-hover:text-[#00ffce] transition-all duration-150 shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-150 font-semibold">Video Editing & 3D Animation</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Our Solutions */}
          <div className="flex flex-col footer-column">
            <div className="mb-4">
              <h3 className="font-bold text-xl text-white whitespace-nowrap mb-4 section-title">
                Our Solutions
              </h3>
              <div className="w-16 h-0.5 bg-white/20 rounded-full section-underline"></div>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/Solutions/CRM-Solutions" 
                  className="group flex items-center gap-2 text-white/70 hover:text-[#00ffce] transition-all duration-150"
                >
                  <UserGroupIcon className="w-4 h-4 text-white/60 group-hover:text-[#00ffce] transition-all duration-150 shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-150 font-semibold">CRM Solutions</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Solutions/HRMS-Solutions" 
                  className="group flex items-center gap-2 text-white/70 hover:text-[#00ffce] transition-all duration-150"
                >
                  <BuildingOfficeIcon className="w-4 h-4 text-white/60 group-hover:text-[#00ffce] transition-all duration-150 shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-150 font-semibold">HRMS Solutions</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Solutions/Healthcare-Appointment" 
                  className="group flex items-start gap-2 text-white/70 hover:text-[#00ffce] transition-all duration-150"
                >
                  <HeartIcon className="w-4 h-4 text-white/60 group-hover:text-[#00ffce] transition-all duration-150 shrink-0 mt-0.5" />
                  <span className="group-hover:translate-x-1 transition-transform duration-150 font-semibold leading-tight">Healthcare Solutions</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Solutions/Learning-Management-System" 
                  className="group flex items-center gap-2 text-white/70 hover:text-[#00ffce] transition-all duration-150"
                >
                  <AcademicCapIcon className="w-4 h-4 text-white/60 group-hover:text-[#00ffce] transition-all duration-150 shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-150 font-semibold">LMS Solutions</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Solutions/Ecommerce-Solutions" 
                  className="group flex items-center gap-2 text-white/70 hover:text-[#00ffce] transition-all duration-150"
                >
                  <ShoppingCartIcon className="w-4 h-4 text-white/60 group-hover:text-[#00ffce] transition-all duration-150 shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-150 font-semibold">E-commerce Solutions</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/Solutions/Cloud-Hosting-Support" 
                  className="group flex items-center gap-2 text-white/70 hover:text-[#00ffce] transition-all duration-150"
                >
                  <CloudIcon className="w-4 h-4 text-white/60 group-hover:text-[#00ffce] transition-all duration-150 shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-150 font-semibold">Cloud, Hosting & Support</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5 - Connect With Us */}
          <div className="flex flex-col footer-column">
            <div className="mb-4">
              <h3 className="font-bold text-xl text-white whitespace-nowrap mb-4 section-title">
                Connect With Us
              </h3>
              <div className="w-16 h-0.5 bg-white/20 rounded-full section-underline"></div>
            </div>

            {/* Phone Section */}
            <div className="group mb-6">
              <h4 className="font-semibold mb-3 text-xs uppercase tracking-wider text-white/70">Call Us</h4>
              <a 
                href="tel:+15551234567" 
                className="flex items-start gap-3 text-white/80 hover:text-white transition-all duration-150 group"
              >
                <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 group-hover:bg-white/20 transition-all duration-150 shrink-0 mt-0.5">
                  <FaPhone className="text-white/80 group-hover:text-white transition-colors duration-150" size={14} />
                </span>
                <span className="group-hover:translate-x-0.5 transition-transform duration-150 text-sm font-medium leading-tight">
                  +1 (555) 123-4567
                </span>
              </a>
            </div>

            {/* Email Section */}
            <div className="group mb-6">
              <h4 className="font-semibold mb-3 text-xs uppercase tracking-wider text-white/70">Email Us</h4>
              <a 
                href="mailto:info@quoreb2b.com" 
                className="flex items-start gap-3 text-white/80 hover:text-white transition-all duration-150 group"
              >
                <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 group-hover:bg-white/20 transition-all duration-150 shrink-0 mt-0.5">
                  <FaEnvelope className="text-white/80 group-hover:text-white transition-colors duration-150" size={14} />
                </span>
                <span className="group-hover:translate-x-0.5 transition-transform duration-150 text-sm font-medium leading-tight break-all">
                  info@quoreb2b.com
                </span>
              </a>
            </div> 

            {/* Address Section */}
            <div className="group">
              <h4 className="font-semibold mb-3 text-xs uppercase tracking-wider text-white/70">Visit Us</h4>
              <div className="flex items-start gap-3 text-white/80">
                <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 shrink-0 mt-0.5">
                  <FaMapMarkerAlt className="text-white/80" size={14} />
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
        <div className="pt-8 mt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm">
              <Link 
                href="/Privacy-policy" 
                className="text-white/70 hover:text-white transition-colors duration-150 font-medium"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/Terms-of-use" 
                className="text-white/70 hover:text-white transition-colors duration-150 font-medium"
              >
                Terms of Use
              </Link>
              <Link 
                href="/cookies-policy" 
                className="text-white/70 hover:text-white transition-colors duration-150 font-medium"
              >
                Cookies Policy
              </Link>
              <Link 
                href="/sitemap" 
                className="text-white/70 hover:text-white transition-colors duration-150 font-medium"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 pt-8 border-t border-white/10">
          <p className="text-sm text-white/80">
            © {currentYear} <span className="font-bold text-white">Quore B2B</span>. All rights reserved. | 
            <span className="text-white/70 ml-1">Transforming Digital Futures</span>
          </p>
          <p className="text-xs text-white/60 mt-2">
            Empowering businesses through innovative technology solutions and digital transformation.
          </p>
        </div>
      </div>

      {/* Enhanced Custom CSS */}
      <style jsx>{`
        .footer-container {
          position: relative;
          min-height: 100%;
        }

        .video-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .footer-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          animation: videoFadeIn 1s ease-in-out;
        }

        .video-overlay {
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.3) 0%,
            rgba(0, 0, 0, 0.7) 50%,
            rgba(0, 0, 0, 0.8) 100%
          );
          backdrop-filter: blur(2px);
          transition: opacity 0.3s ease;
        }

        .footer-content {
          animation: contentFadeIn 0.8s ease-out;
        }

        .logo-container {
          animation: slideInLeft 0.6s ease-out;
        }

        .logo-icon {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .logo-icon:hover {
          transform: rotate(15deg) scale(1.1);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
        }

        .logo-rocket {
          transition: transform 0.3s ease;
        }

        .logo-icon:hover .logo-rocket {
          transform: translateY(-2px);
        }

        .logo-text {
          background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.3s ease;
        }

        .logo-underline {
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%);
          animation: expandWidth 0.8s ease-out 0.3s both;
        }

        .section-title {
          position: relative;
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
        }

        .section-title:hover {
          transform: translateX(4px);
          text-shadow: 0 2px 8px rgba(255, 255, 255, 0.3);
        }

        .section-underline {
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%);
          transition: all 0.3s ease;
        }

        .section-title:hover + .section-underline {
          width: 100%;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 100%);
        }

        .footer-column {
          animation: fadeInUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .footer-column:nth-child(1) {
          animation-delay: 0.1s;
        }

        .footer-column:nth-child(2) {
          animation-delay: 0.2s;
        }

        .footer-column:nth-child(3) {
          animation-delay: 0.3s;
        }

        .footer-column:nth-child(4) {
          animation-delay: 0.4s;
        }

        .footer-column:nth-child(5) {
          animation-delay: 0.5s;
        }

        .social-icons {
          display: flex;
          gap: 0.75rem;
        }

        .social-icon {
          position: relative;
          overflow: hidden;
        }

        .social-icon::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          transform: translate(-50%, -50%);
          transition: width 0.3s ease, height 0.3s ease;
        }

        .social-icon:hover::before {
          width: 100%;
          height: 100%;
        }

        .social-icon:hover {
          transform: translateY(-4px) scale(1.05);
        }

        .social-icon:active {
          transform: translateY(-2px) scale(1.02);
        }

        /* Link hover effects */
        .footer-column a {
          position: relative;
          display: inline-block;
        }

        .footer-column a::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: rgba(255, 255, 255, 0.6);
          transition: width 0.3s ease;
        }

        .footer-column a:hover::after {
          width: 100%;
        }

        /* Animations */
        @keyframes videoFadeIn {
          from {
            opacity: 0;
            transform: scale(1.1);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes contentFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 80px;
          }
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Responsive enhancements */
        @media (max-width: 768px) {
          .footer-content {
            padding-top: 3rem;
            padding-bottom: 3rem;
          }

          .footer-column {
            margin-bottom: 2rem;
          }

          .section-title {
            font-size: 1.125rem;
          }
        }

        /* Enhanced border effects */
        .footer-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          z-index: 20;
        }

        /* Improved text readability */
        .footer-column p,
        .footer-column span {
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Focus states for accessibility */
        .social-icon:focus,
        .footer-column a:focus {
          outline: 2px solid rgba(255, 255, 255, 0.5);
          outline-offset: 2px;
        }
      `}</style>
    </footer>
  );
}
