"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CheckCircleIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  LightBulbIcon,
  SparklesIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import { solutions } from "../../data/homeData";

const SolutionsSection = ({ onAiQuoteClick, onCrmQuoteClick, onHrmsQuoteClick, onHealthcareQuoteClick, onEcommerceQuoteClick, onLmsQuoteClick }) => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-[#0A2540]/10 to-[#00BFA6]/10 text-[#0A2540] border border-[#0A2540]/20 mb-6">
            <LightBulbIcon className="w-5 h-5 mr-2 text-[#0A2540]" />
            Our Solutions
          </div>
          <h2 className="text-5xl font-black text-[#0A2540] mb-6">
            Innovative Business
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A2540] to-[#00BFA6] block">
              Solutions
            </span>
          </h2>
          <p className="text-xl text-[#0A2540]/70 max-w-4xl mx-auto leading-relaxed">
            Powerful software solutions tailored to meet your specific business needs
            and drive operational excellence across all industries.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-10">
          {solutions.map((solution, index) => (
            <div key={index} className="group h-full">
              <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-6 border border-gray-100 hover:border-[#0A2540]/20 overflow-hidden h-full flex flex-col min-h-[700px]">
                {/* Industry Badge */}
                <div className="absolute top-6 right-6 z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-[#0A2540] border border-[#0A2540]/20">
                    {solution.industry}
                  </span>
                </div>

                {/* Solution Image */}
                <div className="relative mb-6 overflow-hidden rounded-2xl">
                  <Image
                    src={solution.image}
                    alt={solution.name}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/60 via-transparent to-transparent"></div>

                  {/* Solution Icon Overlay */}
                  <div className="absolute bottom-4 left-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${solution.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <solution.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="flex-grow flex flex-col">
                  <h3 className="text-2xl font-bold text-[#0A2540] mb-4 group-hover:text-[#00BFA6] transition-colors duration-300">
                    {solution.name}
                  </h3>

                  <p className="text-[#0A2540]/70 mb-6 leading-relaxed text-lg flex-grow">
                    {solution.description}
                  </p>

                  {/* Benefits List */}
                  <div className="space-y-3 mb-8">
                    {solution.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center text-[#0A2540]/70">
                        <div className="w-6 h-6 bg-[#0A2540]/10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <CheckCircleIcon className="w-4 h-4 text-[#0A2540]" />
                        </div>
                        <span className="font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-4 mt-auto">
                    {solution.name === "AI Blog / Content Automation Solution" ? (
                      <button
                        onClick={onAiQuoteClick}
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#0A2540] to-[#0A2540]/80 text-white font-bold rounded-2xl hover:from-[#0A2540]/90 hover:to-[#0A2540]/70 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group/quote"
                      >
                        <CurrencyDollarIcon className="w-5 h-5 mr-2 group-hover/quote:animate-pulse" />
                        Get Free Quote
                        <ArrowRightIcon className="w-5 h-5 ml-2 group-hover/quote:translate-x-2 transition-transform duration-300" />
                      </button>
                    ) : solution.name === "CRM Solutions" ? (
                      <button
                        onClick={onCrmQuoteClick}
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#0A2540] to-[#0A2540]/80 text-white font-bold rounded-2xl hover:from-[#0A2540]/90 hover:to-[#0A2540]/70 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group/quote"
                      >
                        <CurrencyDollarIcon className="w-5 h-5 mr-2 group-hover/quote:animate-pulse" />
                        Get Free Quote
                        <ArrowRightIcon className="w-5 h-5 ml-2 group-hover/quote:translate-x-2 transition-transform duration-300" />
                      </button>
                    ) : solution.name === "HRMS Solutions" ? (
                      <button
                        onClick={onHrmsQuoteClick}
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#0A2540] to-[#0A2540]/80 text-white font-bold rounded-2xl hover:from-[#0A2540]/90 hover:to-[#0A2540]/70 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group/quote"
                      >
                        <CurrencyDollarIcon className="w-5 h-5 mr-2 group-hover/quote:animate-pulse" />
                        Get Free Quote
                        <ArrowRightIcon className="w-5 h-5 ml-2 group-hover/quote:translate-x-2 transition-transform duration-300" />
                      </button>
                    ) : solution.name === "Healthcare & Appointment Solutions" ? (
                      <button
                        onClick={onHealthcareQuoteClick}
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#0A2540] to-[#0A2540]/80 text-white font-bold rounded-2xl hover:from-[#0A2540]/90 hover:to-[#0A2540]/70 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group/quote"
                      >
                        <CurrencyDollarIcon className="w-5 h-5 mr-2 group-hover/quote:animate-pulse" />
                        Get Free Quote
                        <ArrowRightIcon className="w-5 h-5 ml-2 group-hover/quote:translate-x-2 transition-transform duration-300" />
                      </button>
                    ) : solution.name === "E-commerce Solutions" ? (
                      <button
                        onClick={onEcommerceQuoteClick}
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#0A2540] to-[#0A2540]/80 text-white font-bold rounded-2xl hover:from-[#0A2540]/90 hover:to-[#0A2540]/70 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group/quote"
                      >
                        <CurrencyDollarIcon className="w-5 h-5 mr-2 group-hover/quote:animate-pulse" />
                        Get Free Quote
                        <ArrowRightIcon className="w-5 h-5 ml-2 group-hover/quote:translate-x-2 transition-transform duration-300" />
                      </button>
                    ) : solution.name === "Learning Management Software (LMS)" ? (
                      <button
                        onClick={onLmsQuoteClick}
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#0A2540] to-[#0A2540]/80 text-white font-bold rounded-2xl hover:from-[#0A2540]/90 hover:to-[#0A2540]/70 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group/quote"
                      >
                        <CurrencyDollarIcon className="w-5 h-5 mr-2 group-hover/quote:animate-pulse" />
                        Get Free Quote
                        <ArrowRightIcon className="w-5 h-5 ml-2 group-hover/quote:translate-x-2 transition-transform duration-300" />
                      </button>
                    ) : (
                      <Link
                        href="/Contact-us"
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#0A2540] to-[#0A2540]/80 text-white font-bold rounded-2xl hover:from-[#0A2540]/90 hover:to-[#0A2540]/70 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group/quote"
                      >
                        <CurrencyDollarIcon className="w-5 h-5 mr-2 group-hover/quote:animate-pulse" />
                        Get Free Quote
                        <ArrowRightIcon className="w-5 h-5 ml-2 group-hover/quote:translate-x-2 transition-transform duration-300" />
                      </Link>
                    )}

                    <Link
                      href={solution.link}
                      className="inline-flex items-center text-[#0A2540] font-bold hover:text-[#00BFA6] transition-colors group/link text-lg"
                    >
                      Explore Solution
                      <ChevronRightIcon className="w-5 h-5 ml-2 group-hover/link:translate-x-2 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/Our-solutions"
            className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-[#0A2540] to-[#0A2540]/80 text-white font-bold text-lg rounded-3xl hover:from-[#0A2540]/90 hover:to-[#0A2540]/70 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl group"
          >
            <SparklesIcon className="w-6 h-6 mr-3 group-hover:animate-pulse" />
            View All Solutions
            <ArrowRightIcon className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
