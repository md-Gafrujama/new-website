"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const AboutSection = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const attemptPlay = () => {
      const playPromise = videoEl.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(() => {
          videoEl.muted = true;
          videoEl.play().catch(() => undefined);
        });
      }
    };

    attemptPlay();
  }, []);
  return (
    <section className="relative pt-24 pb-64 bg-[#0B1120]">
      {/* Background Gradients Container - Overflow Hidden to contain blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#00e4fc]/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[#00ffce]/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4 mb-8"
          >
            <span className="text-gray-300 font-medium tracking-[0.15em] uppercase text-sm md:text-base border-b border-gray-700 pb-1">
              Leading Agile Software Development Company
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.1]"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e4fc] to-[#00ffce]">AI-Driven Development</span> <span className="text-white">Excellence</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl font-normal"
          >
            Achieve 5X Results with Cursor AI & GitHub Copilot
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-[#00e4fc] to-[#00ffce] hover:from-[#00d4e8] hover:to-[#00e8c0] text-white text-sm font-bold py-4 px-8 rounded-sm flex items-center gap-2 transition-all uppercase tracking-wider shadow-lg shadow-[#00ffce]/20"
          >
            Build Your Own Team
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/10 group -mb-72 z-20"
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
          >
            <source src="https://videos.pexels.com/video-files/3249672/3249672-hd_1920_1080_25fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Video Overlay Effects */}
          <div className="absolute inset-0 bg-blue-950/20 mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-60 pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
