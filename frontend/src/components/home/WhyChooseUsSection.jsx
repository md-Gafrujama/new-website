"use client";

import { whyChooseUs } from "../../data/homeData";

const WhyChooseUsSection = () => {
  return (
    <section className="py-24 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black text-[#0A2540] mb-6">
            Why Choose Quore B2B?
          </h2>
          <p className="text-xl text-[#0A2540]/70 max-w-3xl mx-auto">
            We combine expertise, innovation, and dedication to deliver exceptional results
          </p>
        </div>
        
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {whyChooseUs.map((item, index) => (
            <div key={index} className="group text-center">
              <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-100 hover:border-[#00BFA6]/30 h-80 flex flex-col justify-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${item.color} rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-[#0A2540] mb-4 group-hover:text-[#00BFA6] transition-colors duration-300">
                  {item.title}
                </h3>
                
                <p className="text-[#0A2540]/70 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
