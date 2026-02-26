"use client";

import Link from "next/link";
import { ArrowLeftIcon, SparklesIcon } from "@heroicons/react/24/solid";

export default function ComingSoon({ title = "Coming Soon" } = {}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2540] via-[#0A2540] to-[#0d3a5c] flex flex-col items-center justify-center px-6 text-white">
      <div className="max-w-lg w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur mb-8">
          <SparklesIcon className="w-10 h-10 text-[#00ffce]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        <p className="text-white/80 text-lg mb-10">
          This page is under construction. We&apos;re working on something great — stay tuned!
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00ffce] text-[#0A2540] font-semibold hover:bg-[#00e4fc] transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
