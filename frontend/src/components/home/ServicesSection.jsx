"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CheckCircleIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  StarIcon,
  CogIcon,
  EyeIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import { services } from "../../data/homeData";

const ServicesSection = ({ onWebsiteQuoteClick, onCloudHostingQuoteClick, onMobileQuoteClick, onDigitalMarketingQuoteClick, onBrandingQuoteClick, onSaasQuoteClick }) => {
  return (
    <section className="py-24 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-[#00BFA6]/10 to-[#0A2540]/10 text-[#0A2540] border border-[#00BFA6]/20 mb-6">
            <CogIcon className="w-5 h-5 mr-2 text-[#00BFA6]" />
            Our Services
          </div>
          <h2 className="text-5xl font-black text-[#0A2540] mb-6">
            Professional Services That
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFA6] to-[#0A2540] block">
              Drive Success
            </span>
          </h2>
          <p className="text-xl text-[#0A2540]/70 max-w-4xl mx-auto leading-relaxed">
            Comprehensive technology solutions designed to accelerate your business growth
            and digital transformation journey with cutting-edge innovation.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-10">
          {services.map((service, index) => (
            <div key={index} className="group h-full">
              <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-6 border border-gray-100 hover:border-[#00BFA6]/30 overflow-hidden h-full flex flex-col min-h-[700px]">
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none`}></div>


                {/* Service Icon */}
                <div className="relative mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-[#00BFA6] mb-2">
                    {service.stats}
                  </div>
                </div>

                {/* Service Image */}
                <div className="relative mb-6 overflow-hidden rounded-2xl">
                  <Image
                    src={service.image}
                    alt={service.name}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Floating Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <StarIcon className="w-5 h-5 text-[#00BFA6]" />
                  </div>
                </div>

                <div className="flex-grow flex flex-col">
                  <h3 className="text-2xl font-bold text-[#0A2540] mb-4 group-hover:text-[#00BFA6] transition-colors duration-300">
                    {service.name}
                  </h3>

                  <p className="text-[#0A2540]/70 mb-6 leading-relaxed text-lg flex-grow">
                    {service.description}
                  </p>

                  {/* Feature List */}
                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-[#0A2540]/70">
                        <div className="w-6 h-6 bg-[#00BFA6]/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <CheckCircleIcon className="w-4 h-4 text-[#00BFA6]" />
                        </div>
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-4 mt-auto">
                    {service.name === "Website Design & Development" ? (
                      <button
                        onClick={onWebsiteQuoteClick}
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#00BFA6] to-[#00BFA6]/80 text-white font-bold rounded-2xl hover:from-[#00BFA6]/90 hover:to-[#00BFA6]/70 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group/quote"
                      >
                        <CurrencyDollarIcon className="w-5 h-5 mr-2 group-hover/quote:animate-pulse" />
                        Get Free Quote
                        <ArrowRightIcon className="w-5 h-5 ml-2 group-hover/quote:translate-x-2 transition-transform duration-300" />
                      </button>
                    ) : service.name === "Cloud, Hosting, Maintenance & Support" ? (
                      <button
                        onClick={onCloudHostingQuoteClick}
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#00BFA6] to-[#00BFA6]/80 text-white font-bold rounded-2xl hover:from-[#00BFA6]/90 hover:to-[#00BFA6]/70 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group/quote"
                      >
                        <CurrencyDollarIcon className="w-5 h-5 mr-2 group-hover/quote:animate-pulse" />
                        Get Free Quote
                        <ArrowRightIcon className="w-5 h-5 ml-2 group-hover/quote:translate-x-2 transition-transform duration-300" />
                      </button>
                    ) : service.name === "Mobile Application Development" ? (
                      <button
                        onClick={onMobileQuoteClick}
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#00BFA6] to-[#00BFA6]/80 text-white font-bold rounded-2xl hover:from-[#00BFA6]/90 hover:to-[#00BFA6]/70 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group/quote"
                      >
                        <CurrencyDollarIcon className="w-5 h-5 mr-2 group-hover/quote:animate-pulse" />
                        Get Free Quote
                        <ArrowRightIcon className="w-5 h-5 ml-2 group-hover/quote:translate-x-2 transition-transform duration-300" />
                      </button>
                    ) : service.name === "Digital Marketing" ? (
                      <button
                        onClick={onDigitalMarketingQuoteClick}
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#00BFA6] to-[#00BFA6]/80 text-white font-bold rounded-2xl hover:from-[#00BFA6]/90 hover:to-[#00BFA6]/70 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group/quote"
                      >
                        <CurrencyDollarIcon className="w-5 h-5 mr-2 group-hover/quote:animate-pulse" />
                        Get Free Quote
                        <ArrowRightIcon className="w-5 h-5 ml-2 group-hover/quote:translate-x-2 transition-transform duration-300" />
                      </button>
                    ) : service.name === "Branding & Creative Design" ? (
                      <button
                        onClick={onBrandingQuoteClick}
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#00BFA6] to-[#00BFA6]/80 text-white font-bold rounded-2xl hover:from-[#00BFA6]/90 hover:to-[#00BFA6]/70 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group/quote"
                      >
                        <CurrencyDollarIcon className="w-5 h-5 mr-2 group-hover/quote:animate-pulse" />
                        Get Free Quote
                        <ArrowRightIcon className="w-5 h-5 ml-2 group-hover/quote:translate-x-2 transition-transform duration-300" />
                      </button>
                    ) : service.name === "SaaS Product Development" ? (
                      <button
                        onClick={onSaasQuoteClick}
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#00BFA6] to-[#00BFA6]/80 text-white font-bold rounded-2xl hover:from-[#00BFA6]/90 hover:to-[#00BFA6]/70 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group/quote"
                      >
                        <CurrencyDollarIcon className="w-5 h-5 mr-2 group-hover/quote:animate-pulse" />
                        Get Free Quote
                        <ArrowRightIcon className="w-5 h-5 ml-2 group-hover/quote:translate-x-2 transition-transform duration-300" />
                      </button>
                    ) : (
                      <Link
                        href={service.quoteLink}
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#00BFA6] to-[#00BFA6]/80 text-white font-bold rounded-2xl hover:from-[#00BFA6]/90 hover:to-[#00BFA6]/70 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group/quote"
                      >
                        <CurrencyDollarIcon className="w-5 h-5 mr-2 group-hover/quote:animate-pulse" />
                        Get Free Quote
                        <ArrowRightIcon className="w-5 h-5 ml-2 group-hover/quote:translate-x-2 transition-transform duration-300" />
                      </Link>
                    )}

                    <Link
                      href={service.link}
                      className="inline-flex items-center text-[#00BFA6] font-bold hover:text-[#0A2540] transition-colors group/link text-lg"
                     >
                      Learn More
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
            href="/Our-services"
            className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-[#00BFA6] to-[#00BFA6]/80 text-white font-bold text-lg rounded-3xl hover:from-[#00BFA6]/90 hover:to-[#00BFA6]/70 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl group"
          >
            <EyeIcon className="w-6 h-6 mr-3 group-hover:animate-pulse" />
            View All Services
            <ArrowRightIcon className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
