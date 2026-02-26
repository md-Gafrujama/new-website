"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  CogIcon,
  EyeIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import { services } from "../../data/homeData";

const ServicesSection = ({ onWebsiteQuoteClick, onCloudHostingQuoteClick, onMobileQuoteClick, onDigitalMarketingQuoteClick, onBrandingQuoteClick, onSaasQuoteClick }) => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      {/* Section Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
          alt="Abstract Tech Background"
          fill
          className="object-cover opacity-5"
        />
        {/* Soft Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Badge Removed */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0A2540] mb-6 tracking-tight">
            Full-service digital delivery
          </h2>
          <p className="text-xl text-[#0A2540]/60 max-w-3xl mx-auto leading-relaxed font-light">
            From strategy to launch, we design, build, and support products that keep your business moving forward.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative h-[480px] rounded-3xl overflow-hidden shadow-2xl shadow-[#00e4fc]/10 hover:shadow-[#00ffce]/20 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Card Background Image */}
              <Image
                src={service.image}
                alt={service.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-110"
              />

              {/* Stronger, Cleaner Dark Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/70 to-transparent/30 opacity-95 transition-opacity duration-300" />

              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                {/* Header: Icon Only */}
                <div className="flex justify-between items-start">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg transform group-hover:-translate-y-1 transition-transform duration-300`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Content Body */}
                <div className="transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                  <h3 className="text-2xl font-bold text-white mb-3 leading-tight tracking-tight">{service.name}</h3>
                  <p className="text-sm text-gray-300/90 mb-5 font-medium line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2 mb-6 border-b border-white/10 pb-6">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-white/80 font-medium">
                        <CheckCircleIcon className="w-4 h-4 text-[#00ffce] flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex items-center gap-3">
                    {/* Primary White Button */}
                    {service.name === "Website Design & Development" ? (
                      <button onClick={onWebsiteQuoteClick} className="flex-1 inline-flex justify-center items-center px-4 py-3 rounded-full bg-white text-[#0A2540] text-sm font-bold hover:bg-gray-100 transition-colors shadow-lg shadow-black/20">
                        <CurrencyDollarIcon className="w-4 h-4 mr-2" /> Get a Quote
                      </button>
                    ) : service.name === "Cloud, Hosting, Maintenance & Support" ? (
                      <button onClick={onCloudHostingQuoteClick} className="flex-1 inline-flex justify-center items-center px-4 py-3 rounded-full bg-white text-[#0A2540] text-sm font-bold hover:bg-gray-100 transition-colors shadow-lg shadow-black/20">
                        <CurrencyDollarIcon className="w-4 h-4 mr-2" /> Get a Quote
                      </button>
                    ) : service.name === "Mobile Application Development" ? (
                      <button onClick={onMobileQuoteClick} className="flex-1 inline-flex justify-center items-center px-4 py-3 rounded-full bg-white text-[#0A2540] text-sm font-bold hover:bg-gray-100 transition-colors shadow-lg shadow-black/20">
                        <CurrencyDollarIcon className="w-4 h-4 mr-2" /> Get a Quote
                      </button>
                    ) : service.name === "Digital Marketing" ? (
                      <button onClick={onDigitalMarketingQuoteClick} className="flex-1 inline-flex justify-center items-center px-4 py-3 rounded-full bg-white text-[#0A2540] text-sm font-bold hover:bg-gray-100 transition-colors shadow-lg shadow-black/20">
                        <CurrencyDollarIcon className="w-4 h-4 mr-2" /> Get a Quote
                      </button>
                    ) : service.name === "Branding & Creative Design" ? (
                      <button onClick={onBrandingQuoteClick} className="flex-1 inline-flex justify-center items-center px-4 py-3 rounded-full bg-white text-[#0A2540] text-sm font-bold hover:bg-gray-100 transition-colors shadow-lg shadow-black/20">
                        <CurrencyDollarIcon className="w-4 h-4 mr-2" /> Get a Quote
                      </button>
                    ) : service.name === "SaaS Product Development" ? (
                      <button onClick={onSaasQuoteClick} className="flex-1 inline-flex justify-center items-center px-4 py-3 rounded-full bg-white text-[#0A2540] text-sm font-bold hover:bg-gray-100 transition-colors shadow-lg shadow-black/20">
                        <CurrencyDollarIcon className="w-4 h-4 mr-2" /> Get a Quote
                      </button>
                    ) : (
                      <Link href={service.quoteLink} className="flex-1 inline-flex justify-center items-center px-4 py-3 rounded-full bg-white text-[#0A2540] text-sm font-bold hover:bg-gray-100 transition-colors shadow-lg shadow-black/20">
                        <CurrencyDollarIcon className="w-4 h-4 mr-2" /> Get a Quote
                      </Link>
                    )}

                    {/* Circle Arrow Button */}
                    <Link href={service.link} className="inline-flex justify-center items-center w-12 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 backdrop-blur-md">
                      <ChevronRightIcon className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button Removed */}
      </div>
    </section>
  );
};

export default ServicesSection;
