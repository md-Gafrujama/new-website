"use client";

import { whyChooseUs } from "../../data/homeData";

const WhyChooseUsSection = () => {
  return (
    <section className="relative py-24 bg-transparent overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-black text-[#0A2540] tracking-tight">
            Why partner with us
          </h2>
          <p className="text-lg text-[#0A2540]/70 max-w-3xl mx-auto">
            Clear communication, disciplined delivery, and measurable impact—backed by people you can actually reach and a process that keeps you in the loop at every milestone.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {whyChooseUs.map((item, index) => (
            <div key={index} className="group text-center">
              <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-[#00BFA6]/35 via-white to-[#0A2540]/12 shadow-[0_25px_80px_rgba(10,37,64,0.08)] hover:shadow-[0_30px_90px_rgba(10,37,64,0.14)] transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.01]">
                <div className="relative bg-white/70 backdrop-blur-2xl rounded-2xl p-8 h-80 flex flex-col justify-center border border-white/60 overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0.1)_35%,transparent_60%)] opacity-70" />
                  <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                  <div className="relative w-16 h-16 mx-auto mb-5">
                    <div className="absolute inset-0 blur-2xl bg-[radial-gradient(circle,rgba(0,191,166,0.28),transparent_60%)] opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className={`relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl group-hover:scale-110 transition-transform duration-200 shadow-lg ring-1 ring-white/40`}>
                      <item.icon className="w-8 h-8 text-white drop-shadow-sm" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-[#0A2540] mb-3 group-hover:text-[#00BFA6] transition-colors duration-200">
                    {item.title}
                  </h3>
                  
                  <p className="text-[#0A2540]/70 leading-relaxed text-sm">
                    {item.description}
                  </p>
                  
                  <div className="absolute -right-6 bottom-10 w-16 h-16 rounded-full bg-[#00BFA6]/10 blur-2xl" />
                  <div className="absolute -left-8 top-12 w-20 h-20 rounded-full bg-[#0A2540]/6 blur-3xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
