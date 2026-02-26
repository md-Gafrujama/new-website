"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { FaLinkedinIn, FaInstagram, FaFacebookF } from "react-icons/fa";

const services = [
  {
    name: "Website Design & Development",
    image: "/images/service1.jpg",
    link: "/Services/Website-Design-Development",
    description: "Custom web solutions",
  },
  {
    name: "Mobile Application Development",
    image: "/images/service2.png",
    link: "/Services/Mobile-App-Development",
    description: "iOS & Android apps",
  },
  {
    name: "Digital Marketing",
    image: "/images/service3.jpeg",
    link: "/Services/Digital-Marketing",
    description: "Growth strategies",
  },
  {
    name: "Branding & Creative Design",
    image: "/images/service4.webp",
    link: "/Services/Branding-Creative-Design",
    description: "Visual identity",
  },
  {
    name: "Cloud, Hosting, Maintenance & Support",
    image: "/images/service5.jpg",
    link: "/Services/Cloud-Hosting-Support",
    description: "Infrastructure management",
  },
  {
    name: "SaaS Product Development",
    image: "/images/service5.jpg", // Using service5.jpg as placeholder
    link: "/Services/SaaS-Development",
    description: "End-to-end SaaS builds",
  },
];

const solutions = [
  {
    name: "CRM Solutions",
    image: "/images/solution1.png",
    link: "/Solutions/CRM-Solutions",
    description: "Customer management",
  },
  {
    name: "HRMS Solutions",
    image: "/images/solution2.jpg",
    link: "/Solutions/HRMS-Solutions",
    description: "Human resources",
  },
  {
    name: "AI Blog / Content Automation Solution",
    image: "/images/solution3.jpg",
    link: "/Solutions/AI-Content-Automation",
    description: "Automated content",
  },
  {
    name: "Healthcare & Appointment Solutions",
    image: "/images/solution4.webp",
    link: "/Solutions/Healthcare-Appointment",
    description: "Medical systems",
  },
  {
    name: "Learning Management Software (LMS)",
    image: "/images/solution3.jpg", // Using solution3.jpg as placeholder
    link: "/Solutions/Learning-Management-System",
    description: "Educational platforms",
  },
  {
    name: "E-commerce Solutions",
    image: "/images/solution4.webp", // Using solution4.webp as placeholder
    link: "/Solutions/Ecommerce-Solutions",
    description: "Online stores",
  },
];

// All searchable content
const allContent = [
  ...services.map(item => ({ ...item, type: 'service' })),
  ...solutions.map(item => ({ ...item, type: 'solution' })),
  { name: "Home", link: "/", type: "page", description: "Homepage" },
  { name: "About Us", link: "/About-us", type: "page", description: "About our company" },
  { name: "Contact Us", link: "/Contact-us", type: "page", description: "Get in touch" },
  { name: "Tech Blogs", link: "https://final-ai-blogs-qsug.vercel.app/", type: "blog", description: "Latest tech insights" },
];

export default function LowNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServiceOpen, setMobileServiceOpen] = useState(false);
  const [mobileSolutionOpen, setMobileSolutionOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const router = useRouter();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const filtered = allContent.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(filtered);
    setShowSearchResults(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      router.push(searchResults[0].link);
      setShowSearchResults(false);
      setSearchQuery("");
    }
  };

  const handleSearchResultClick = (link) => {
    router.push(link);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* MAIN NAVIGATION BAR */}
      <nav
        className={`bg-white transition-all duration-500 ${
          scrolled
            ? "shadow-lg border-b border-gray-200"
            : "shadow-sm border-b border-gray-100"
        }`}
      >
        <div className="w-full max-w-6xl mx-auto pl-0 pr-4 sm:pr-5 lg:pr-6 overflow-visible">
          <div className="flex items-center justify-between gap-3 h-20 lg:h-24 min-w-0">
            {/* Logo - more length, shifted further left */}
            <Link
              href="/"
              className="flex-shrink-0 flex items-center py-1 -ml-6 sm:-ml-8 lg:-ml-10 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#0A2540]/20 focus:ring-offset-2 rounded-lg max-w-[260px] sm:max-w-[300px] lg:max-w-[360px]"
            >
              <Image
                src="/images/qlab.png"
                alt="QuoreLab Logo"
                width={420}
                height={120}
                className="h-[4.25rem] sm:h-[4.75rem] lg:h-[5.25rem] w-auto object-contain object-left"
                priority
              />
            </Link>

            {/* Desktop Navigation - clear gap so HOME never overlaps logo */}
            <div className="hidden lg:flex items-center space-x-8 min-w-0 flex-1 justify-end ml-8 lg:ml-12">
              {/* Home */}
              <Link
                href="/"
                className="relative text-gray-800 hover:text-[#0A2540] font-semibold text-sm tracking-wide transition-all duration-300 group py-2"
              >
                HOME
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#0A2540] group-hover:w-full transition-all duration-400 rounded-full"></span>
              </Link>

              {/* About */}
              <Link
                href="/About-us"
                className="relative text-gray-800 hover:text-[#0A2540] font-semibold text-sm tracking-wide transition-all duration-300 group py-2"
              >
                ABOUT
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#0A2540] group-hover:w-full transition-all duration-400 rounded-full"></span>
              </Link>

              {/* Services Dropdown */}
              <div className="relative group">
                <Link
                  href="/Our-services"
                  className="flex items-center text-gray-800 hover:text-[#0A2540] font-semibold text-sm tracking-wide transition-all duration-300 py-2"
                >
                  SERVICES
                  <ChevronDownIcon className="w-4 h-4 ml-2 group-hover:rotate-180 transition-transform duration-400 text-gray-600" />
                </Link>

                {/* Enhanced Dropdown Menu - center open, smooth */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 pt-2 opacity-0 invisible scale-95 translate-y-[-6px] group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 ease-out origin-top">
                  <div className="bg-white rounded-3xl shadow-2xl border border-[#0A2540]/10 p-8 w-[950px] max-w-6xl">
                    <div className="mb-6">
                      <h3 className="text-[#0A2540] font-bold text-lg mb-2 flex items-center">
                        <SparklesIcon className="w-5 h-5 mr-2 text-[#0A2540]" />
                        Our Services
                      </h3>
                      <p className="text-[#0A2540]/70 text-sm">Comprehensive solutions for your business needs</p>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      {services.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.link}
                          className="group/item block"
                        >
                          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white hover:from-[#0A2540]/5 hover:to-[#0A2540]/10 transition-all duration-400 transform hover:scale-105 hover:shadow-xl border border-[#0A2540]/10 hover:border-[#0A2540]/30">
                            <div
                              className="h-36 bg-cover bg-center relative"
                              style={{
                                backgroundImage: `url(${item.image})`,
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/90 via-[#0A2540]/30 to-transparent"></div>
                              <div className="absolute top-3 right-3">
                                <div className="w-8 h-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                                  <StarIcon className="w-4 h-4 text-white" />
                                </div>
                              </div>
                              <div className="absolute bottom-4 left-4 right-4">
                                <h4 className="text-white font-semibold text-sm mb-1">{item.name}</h4>
                                <p className="text-white/80 text-xs">{item.description}</p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Solutions Dropdown */}
              <div className="relative group">
                <Link
                  href="/Our-solutions"
                  className="flex items-center text-gray-800 hover:text-[#0A2540] font-semibold text-sm tracking-wide transition-all duration-300 py-2"
                >
                  SOLUTIONS
                  <ChevronDownIcon className="w-4 h-4 ml-2 group-hover:rotate-180 transition-transform duration-400 text-gray-600" />
                </Link>

                {/* Enhanced Dropdown Menu - center open, smooth */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 pt-2 opacity-0 invisible scale-95 translate-y-[-6px] group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 ease-out origin-top">
                  <div className="bg-white rounded-3xl shadow-2xl border border-[#0A2540]/10 p-8 w-[950px] max-w-6xl">
                    <div className="mb-6">
                      <h3 className="text-[#0A2540] font-bold text-lg mb-2 flex items-center">
                        <SparklesIcon className="w-5 h-5 mr-2 text-[#0A2540]" />
                        Our Solutions
                      </h3>
                      <p className="text-[#0A2540]/70 text-sm">Innovative technology solutions for modern businesses</p>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      {solutions.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.link}
                          className="group/item block"
                        >
                          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white hover:from-[#0A2540]/5 hover:to-[#0A2540]/10 transition-all duration-400 transform hover:scale-105 hover:shadow-xl border border-[#0A2540]/10 hover:border-[#0A2540]/30">
                            <div
                              className="h-36 bg-cover bg-center relative"
                              style={{ backgroundImage: `url(${item.image})` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/90 via-[#0A2540]/30 to-transparent"></div>
                              <div className="absolute top-3 right-3">
                                <div className="w-8 h-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                                  <StarIcon className="w-4 h-4 text-white" />
                                </div>
                              </div>
                              <div className="absolute bottom-4 left-4 right-4">
                                <h4 className="text-white font-semibold text-sm mb-1">{item.name}</h4>
                                <p className="text-white/80 text-xs">{item.description}</p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech Blogs */}
              <Link
                href="https://final-ai-blogs-qsug.vercel.app/"
                className="relative text-gray-800 hover:text-[#0A2540] font-semibold text-sm tracking-wide transition-all duration-300 group py-2 whitespace-nowrap"
              >
                TECH BLOGS
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#0A2540] group-hover:w-full transition-all duration-400 rounded-full"></span>
              </Link>

              {/* Contact */}
              <Link
                href="/Contact-us"
                className="relative text-gray-800 hover:text-[#0A2540] font-semibold text-sm tracking-wide transition-all duration-300 group py-2"
              >
                CONTACT
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#0A2540] group-hover:w-full transition-all duration-400 rounded-full"></span>
              </Link>

              {/* Social Icons - proper brand icons + official colors */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md hover:shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A66C2]/60 transition-all duration-300 ease-out"
                  style={{ backgroundColor: "#0A66C2" }}
                >
                  <FaLinkedinIn className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md hover:shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DD2A7B]/50 transition-all duration-300 ease-out"
                  style={{ background: "linear-gradient(135deg, #F58529 0%, #DD2A7B 100%)" }}
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md hover:shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1877F2]/60 transition-all duration-300 ease-out"
                  style={{ backgroundColor: "#1877F2" }}
                >
                  <FaFacebookF className="w-4 h-4" />
                </a>
              </div>

              {/* Search Bar - right shift so nav links (HOME) have room */}
              <div className="relative search-container flex-shrink-0 ml-4 lg:ml-6">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search services, solutions..."
                      className="w-44 sm:w-52 lg:w-48 px-3 py-2 pl-9 pr-3 text-sm bg-gray-100 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0A2540]/20 focus:border-[#0A2540]/40 transition-all duration-300"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                </form>

                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#0A2540]/10 overflow-hidden z-50">
                    <div className="max-h-80 overflow-y-auto">
                      {searchResults.slice(0, 8).map((result, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSearchResultClick(result.link)}
                          className="px-4 py-3 hover:bg-[#0A2540]/5 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-[#0A2540]/10 rounded-full flex items-center justify-center">
                              <StarIcon className="w-4 h-4 text-[#0A2540]" />
                            </div>
                            <div>
                              <h4 className="text-[#0A2540] font-semibold text-sm">{result.name}</h4>
                              <p className="text-[#0A2540]/60 text-xs">{result.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {showSearchResults && searchQuery && searchResults.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#0A2540]/10 p-4 z-50">
                    <p className="text-[#0A2540]/60 text-sm text-center">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 rounded-2xl hover:bg-gray-100 transition-all duration-300 border border-gray-200"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-800" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-800" />
              )}
            </button>
          </div>

          {/* Enhanced Mobile Menu */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-500 ${
              mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="py-6 space-y-3 border-t border-gray-200 mt-4 bg-gray-50 rounded-2xl mx-2 px-4">
              {/* Mobile Search Bar */}
              <div className="px-2 mb-4 search-container">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search services, solutions..."
                      className="w-full px-4 py-3 pl-10 pr-4 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0A2540]/20 focus:border-[#0A2540]/40 transition-all duration-300"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                </form>

                {/* Mobile Search Results */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="mt-2 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
                    <div className="max-h-60 overflow-y-auto">
                      {searchResults.slice(0, 5).map((result, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            handleSearchResultClick(result.link);
                            setMobileMenuOpen(false);
                          }}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                        >
                          <h4 className="text-gray-800 font-semibold text-sm">{result.name}</h4>
                          <p className="text-gray-500 text-xs">{result.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/"
                className="block px-6 py-4 text-gray-800 hover:text-[#0A2540] hover:bg-white rounded-xl font-bold transition-all duration-300 border border-transparent hover:border-gray-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                HOME
              </Link>

              <Link
                href="/About-us"
                className="block px-6 py-4 text-gray-800 hover:text-[#0A2540] hover:bg-white rounded-xl font-bold transition-all duration-300 border border-transparent hover:border-gray-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                ABOUT
              </Link>

              {/* Enhanced Mobile Services */}
              <div className="space-y-2">
                <div
                  className="flex items-center justify-between px-6 py-4 text-gray-800 hover:text-[#0A2540] hover:bg-white rounded-xl font-bold cursor-pointer transition-all duration-300 border border-transparent hover:border-gray-200"
                  onClick={() => setMobileServiceOpen(!mobileServiceOpen)}
                >
                  <span>SERVICES</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform duration-300 text-gray-600 ${
                      mobileServiceOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                <div
                  className={`overflow-hidden transition-all duration-400 ${
                    mobileServiceOpen
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="ml-6 space-y-2 border-l-2 border-gray-200 pl-6 py-2">
                    {services.map((service, i) => (
                      <Link
                        key={i}
                        href={service.link}
                        className="block py-3 px-4 text-sm text-gray-600 hover:text-[#0A2540] hover:bg-white rounded-lg transition-all duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enhanced Mobile Solutions */}
              <div className="space-y-2">
                <div
                  className="flex items-center justify-between px-6 py-4 text-gray-800 hover:text-[#0A2540] hover:bg-white rounded-xl font-bold cursor-pointer transition-all duration-300 border border-transparent hover:border-gray-200"
                  onClick={() => setMobileSolutionOpen(!mobileSolutionOpen)}
                >
                  <span>SOLUTIONS</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform duration-300 text-gray-600 ${
                      mobileSolutionOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                <div
                  className={`overflow-hidden transition-all duration-400 ${
                    mobileSolutionOpen
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="ml-6 space-y-2 border-l-2 border-gray-200 pl-6 py-2">
                    {solutions.map((solution, i) => (
                      <Link
                        key={i}
                        href={solution.link}
                        className="block py-3 px-4 text-sm text-gray-600 hover:text-[#0A2540] hover:bg-white rounded-lg transition-all duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {solution.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href="https://final-ai-blogs-qsug.vercel.app/"
                className="block px-6 py-4 text-gray-800 hover:text-[#0A2540] hover:bg-white rounded-xl font-bold transition-all duration-300 border border-transparent hover:border-gray-200 whitespace-nowrap"
                onClick={() => setMobileMenuOpen(false)}
              >
                TECH BLOGS
              </Link>

              <Link
                href="/Contact-us"
                className="block px-6 py-4 text-gray-800 hover:text-[#0A2540] hover:bg-white rounded-xl font-bold transition-all duration-300 border border-transparent hover:border-gray-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                CONTACT
              </Link>

              {/* Enhanced Mobile CTA */}
              <div className="px-2 pt-4">
                <Link
                  href="/Contact-us"
                  className="block w-full text-center bg-[#0A2540] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#0A2540]/90 transition-all duration-400 shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
