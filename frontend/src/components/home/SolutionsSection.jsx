"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { solutions } from "../../data/homeData";

const SolutionsSection = ({ onAiQuoteClick, onCrmQuoteClick, onHrmsQuoteClick, onHealthcareQuoteClick, onEcommerceQuoteClick, onLmsQuoteClick }) => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Section Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
          alt="Office Background"
          fill
          className="object-cover opacity-10"
        />
        {/* Soft Gradient Overlay to blend with white/content */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/90" />
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
            Productized solutions that scale
          </h2>
          <p className="text-xl text-[#0A2540]/60 max-w-3xl mx-auto leading-relaxed font-light">
            Ready-to-launch platforms tailored to CRM, HR, healthcare, learning, commerce, and AI content workflows.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative h-[480px] rounded-3xl overflow-hidden shadow-2xl shadow-[#00e4fc]/10 hover:shadow-[#00ffce]/20 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Card Background Image (Full Cover) */}
              <Image
                src={solution.image}
                alt={solution.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-110"
              />

              {/* Dark Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/70 to-transparent/30 opacity-95 transition-opacity duration-300" />

              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                {/* Header: Icon & Industry Badge */}
                <div className="flex justify-between items-start">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${solution.color} flex items-center justify-center shadow-lg transform group-hover:-translate-y-1 transition-transform duration-300`}>
                    <solution.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/90 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                    {solution.industry}
                  </span>
                </div>

                {/* Content Body */}
                <div className="transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                  <h3 className="text-2xl font-bold text-white mb-3 leading-tight tracking-tight">{solution.name}</h3>
                  <p className="text-sm text-gray-300/90 mb-6 font-medium line-clamp-2 leading-relaxed">
                    {solution.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2 mb-6 border-b border-white/10 pb-6">
                    {solution.benefits.slice(0, 2).map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-white/80 font-medium">
                        <CheckCircleIcon className="w-4 h-4 text-[#00ffce] flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex items-center gap-3">
                    {solution.name === "AI Blog / Content Automation Solution" ? (
                      <button onClick={onAiQuoteClick} className="flex-1 inline-flex justify-center items-center px-4 py-3 rounded-full bg-white text-[#0A2540] text-sm font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-black/20">
                        Get Quote
                      </button>
                    ) : solution.name === "CRM Solutions" ? (
                      <button onClick={onCrmQuoteClick} className="flex-1 inline-flex justify-center items-center px-4 py-3 rounded-full bg-white text-[#0A2540] text-sm font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-black/20">
                        Get Quote
                      </button>
                    ) : solution.name === "HRMS Solutions" ? (
                      <button onClick={onHrmsQuoteClick} className="flex-1 inline-flex justify-center items-center px-4 py-3 rounded-full bg-white text-[#0A2540] text-sm font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-black/20">
                        Get Quote
                      </button>
                    ) : solution.name === "Healthcare & Appointment Solutions" ? (
                      <button onClick={onHealthcareQuoteClick} className="flex-1 inline-flex justify-center items-center px-4 py-3 rounded-full bg-white text-[#0A2540] text-sm font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-black/20">
                        Get Quote
                      </button>
                    ) : solution.name === "E-commerce Solutions" ? (
                      <button onClick={onEcommerceQuoteClick} className="flex-1 inline-flex justify-center items-center px-4 py-3 rounded-full bg-white text-[#0A2540] text-sm font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-black/20">
                        Get Quote
                      </button>
                    ) : solution.name === "Learning Management Software (LMS)" ? (
                      <button onClick={onLmsQuoteClick} className="flex-1 inline-flex justify-center items-center px-4 py-3 rounded-full bg-white text-[#0A2540] text-sm font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-black/20">
                        Get Quote
                      </button>
                    ) : (
                      <Link href="/Contact-us" className="flex-1 inline-flex justify-center items-center px-4 py-3 rounded-full bg-white text-[#0A2540] text-sm font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-black/20">
                        Get Quote
                      </Link>
                    )}

                    <Link href={solution.link} className="inline-flex justify-center items-center w-12 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 backdrop-blur-md">
                      <ChevronRightIcon className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Start Project Button Removed */}
      </div>
    </section>
  );
};

export default SolutionsSection;
