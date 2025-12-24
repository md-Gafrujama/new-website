"use client";

import { stats } from "../../data/homeData";

const StatsSection = () => {
  return (
    <section className="py-16 bg-[#0A2540]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Proof in the numbers
          </h2>
          <p className="text-lg text-white/70">
            Delivery discipline with measurable outcomes.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg shadow-black/10">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-xl mb-4">
                <stat.icon className="w-7 h-7 text-[#45ffd0]" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white mb-2">
                {stat.number}
              </div>
              <div className="text-base font-semibold text-white">
                {stat.label}
              </div>
              <div className="text-sm text-white/70 mt-1">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
