"use client";

import { stats } from "../../data/homeData";

const StatsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-white to-gray-50/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A2540]/5 to-[#00BFA6]/5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0A2540] mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-[#0A2540]/70">
            Our track record speaks for itself
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="group text-center">
              <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-100 hover:border-[#00BFA6]/30 h-80 flex flex-col justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00BFA6]/10 to-[#0A2540]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#00BFA6]/20 to-[#0A2540]/20 rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-10 h-10 text-[#00BFA6] group-hover:animate-pulse" />
                  </div>
                  
                  <div className="text-4xl lg:text-5xl font-black text-[#0A2540] mb-3 group-hover:text-[#00BFA6] transition-colors duration-300">
                    {stat.number}
                  </div>
                  
                  <div className="text-lg font-bold text-[#0A2540] mb-2">
                    {stat.label}
                  </div>
                  
                  <div className="text-sm text-[#0A2540]/70">
                    {stat.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
