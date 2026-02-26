"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Code2, Cpu, Database, Globe, Layers, Layout, Smartphone, Terminal, Workflow, Zap } from "lucide-react";
import {
  SiPython, SiDotnet, SiNodedotjs, SiPhp, SiGo, SiReact, SiAngular, SiVuedotjs,
  SiNextdotjs, SiTailwindcss, SiMongodb, SiGooglecloud, SiGithub, SiOpenai,
  SiGoogle, SiVercel, SiZapier, SiN8N, SiRubyonrails, SiCplusplus,
  SiNestjs, SiLaravel, SiTypescript, SiTensorflow, SiPytorch, SiPandas,
  SiScikitlearn, SiAmazon, SiDocker, SiKubernetes,
  SiTerraform, SiSelenium, SiCypress, SiJest, SiFigma, SiAdobexd, SiSketch,
  SiCanva, SiPostgresql, SiMysql, SiRedis
} from "react-icons/si";
import { VscAzure } from "react-icons/vsc";
import { FaJava } from "react-icons/fa";

// Mock Data for AI Tools
const aiToolsData = [
  {
    category: "AI-Powered Coding Assistants",
    items: [
      { name: "Cursor AI", progress: 98, icon: Terminal, color: "#000000" },
      { name: "Github Copilot", progress: 95, icon: SiGithub, color: "#181717" },
      { name: "Claude Code", progress: 92, icon: Bot, color: "#D97757" },
    ],
  },
  {
    category: "Agents for MVPs",
    items: [
      { name: "Lovable.dev", progress: 85, icon: "https://github.com/lovable-dev.png", color: "#FF5A5F" },
      { name: "Bolt.new", progress: 88, icon: Cpu, color: "#000000" },
      { name: "Vercel", progress: 87, icon: SiVercel, color: "#000000" },
    ],
  },
  {
    category: "AI Productivity Tools",
    items: [
      { name: "ChatGPT", progress: 90, icon: SiOpenai, color: "#10A37F" },
      { name: "Claude", progress: 89, icon: Bot, color: "#D97757" },
      { name: "Gemini", progress: 85, icon: SiGoogle, color: "#4285F4" },
    ],
  },
  {
    category: "AI Automation Tools",
    items: [
      { name: "n8n", progress: 83, icon: SiN8N, color: "#FF6584" },
      { name: "Make (Integromat)", progress: 80, icon: Layers, color: "#6C5CE7" },
      { name: "Zapier AI Actions", progress: 86, icon: SiZapier, color: "#FF4F00" },
      { name: "LangChain / CrewAI", progress: 81, icon: Workflow, color: "#1C1C1C" },
    ],
  },
];

// Mock Data for Tech Stack
const techStackCategories = ["Software Engineering", "AI & Data", "Cloud & Infrastructure", "Quality Assurance", "Design"];

const techStackSubCategories = {
  "Software Engineering": ["Backend", "Frontend", "Fullstack", "Mobile"],
  "AI & Data": ["AI & ML", "Data Science", "Generative AI"],
  "Cloud & Infrastructure": ["Cloud Platforms", "DevOps", "Database"],
  "Quality Assurance": ["Automation", "Manual"],
  "Design": ["UI/UX", "Graphic Design"],
};

const techData = {
  // Software Engineering
  Backend: [
    { name: "Python", icon: SiPython, color: "#3776AB" },
    { name: ".NET", icon: SiDotnet, color: "#512BD4" },
    { name: "NodeJS", icon: SiNodedotjs, color: "#339933" },
    { name: "Java", icon: FaJava, color: "#007396" },
    { name: "PHP", icon: SiPhp, color: "#777BB4" },
    { name: "Golang", icon: SiGo, color: "#00ADD8" },
    { name: "ROR", icon: SiRubyonrails, color: "#CC0000" },
    { name: "C++", icon: SiCplusplus, color: "#00599C" },
    { name: "Nest.js", icon: SiNestjs, color: "#E0234E" },
    { name: "Laravel", icon: SiLaravel, color: "#FF2D20" },
    { name: "Typescript", icon: SiTypescript, color: "#3178C6" },
  ],
  Frontend: [
    { name: "React", icon: SiReact, color: "#61DAFB" },
    { name: "Angular", icon: SiAngular, color: "#DD0031" },
    { name: "Vue", icon: SiVuedotjs, color: "#4FC08D" },
    { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
    { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
  ],
  Fullstack: [
    { name: "MERN", icon: SiMongodb, color: "#47A248" },
    { name: "MEAN", icon: SiAngular, color: "#DD0031" },
  ],
  Mobile: [
    { name: "React Native", icon: SiReact, color: "#61DAFB" },
    { name: "Flutter", icon: SiGooglecloud, color: "#02569B" },
  ],

  // AI & Data
  "AI & ML": [
    { name: "TensorFlow", icon: SiTensorflow, color: "#FF6F00" },
    { name: "PyTorch", icon: SiPytorch, color: "#EE4C2C" },
    { name: "Scikit-learn", icon: SiScikitlearn, color: "#F7931E" },
    { name: "OpenAI", icon: SiOpenai, color: "#10A37F" },
  ],
  "Data Science": [
    { name: "Python", icon: SiPython, color: "#3776AB" },
    { name: "Pandas", icon: SiPandas, color: "#150458" },
    { name: "NumPy", icon: SiPython, color: "#013243" },
  ],
  "Generative AI": [
    { name: "LangChain", icon: Workflow, color: "#1C1C1C" },
    { name: "OpenAI", icon: SiOpenai, color: "#10A37F" },
    { name: "Hugging Face", icon: Bot, color: "#FFD21E" },
  ],

  // Cloud & Infrastructure
  "Cloud Platforms": [
    { name: "AWS", icon: SiAmazon, color: "#232F3E" },
    { name: "Azure", icon: VscAzure, color: "#0078D4" },
    { name: "Google Cloud", icon: SiGooglecloud, color: "#4285F4" },
  ],
  "DevOps": [
    { name: "Docker", icon: SiDocker, color: "#2496ED" },
    { name: "Kubernetes", icon: SiKubernetes, color: "#326CE5" },
    { name: "Terraform", icon: SiTerraform, color: "#7B42BC" },
  ],
  "Database": [
    { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
    { name: "PostgreSQL", icon: SiPostgresql, color: "#336791" },
    { name: "MySQL", icon: SiMysql, color: "#4479A1" },
    { name: "Redis", icon: SiRedis, color: "#DC382D" },
  ],

  // Quality Assurance
  "Automation": [
    { name: "Selenium", icon: SiSelenium, color: "#43B02A" },
    { name: "Cypress", icon: SiCypress, color: "#17202C" },
    { name: "Jest", icon: SiJest, color: "#C21325" },
  ],
  "Manual": [
    { name: "Jira", icon: Layout, color: "#0052CC" },
    { name: "TestRail", icon: Database, color: "#4BDB33" },
  ],

  // Design
  "UI/UX": [
    { name: "Figma", icon: SiFigma, color: "#F24E1E" },
    { name: "Adobe XD", icon: SiAdobexd, color: "#FF61F6" },
    { name: "Sketch", icon: SiSketch, color: "#F7B500" },
  ],
  "Graphic Design": [
    { name: "Canva", icon: SiCanva, color: "#00C4CC" },
    { name: "Photoshop", icon: SiAdobexd, color: "#31A8FF" },
  ],
};

const AiTechStackSection = () => {
  const [activeCategory, setActiveCategory] = useState("Software Engineering");
  const [activeSubCategory, setActiveSubCategory] = useState("Backend");

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* PART 1: AI Acceleration */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Accelerate Your Product Development Process by 5X
            </h2>
            <p className="text-gray-500 text-lg">
              AI-enabled expertise to launch your Minimum Viable Product in just 15 days
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-12 mb-12">
            {aiToolsData.map((group, idx) => (
              <div key={idx} className="bg-white">
                <h3 className="text-xl font-bold text-gray-900 mb-8">{group.category}</h3>
                <div className="space-y-6">
                  {group.items.map((tool, i) => (
                    <div key={i} className="flex items-start gap-4">
                      {/* Icon Box */}
                      <div className="shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-white border border-gray-100 overflow-hidden">
                        {typeof tool.icon === "string" ? (
                          <img src={tool.icon} alt={tool.name} className="w-full h-full object-cover" />
                        ) : (
                          <tool.icon size={26} style={{ color: tool.color }} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-center gap-2 pt-1">
                        <span className="font-bold text-gray-900 text-lg leading-none">
                          {tool.name}
                        </span>

                        <div className="flex items-center gap-4 w-full">
                          <div className="h-[3px] flex-1 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${tool.progress}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className="h-full bg-black rounded-full"
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-600 min-w-[32px] text-right">
                            {tool.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold py-4 px-10 rounded-sm flex items-center gap-3 transition-all uppercase tracking-wider text-sm shadow-xl shadow-orange-500/20"
            >
              Start Your 15 Day Launch
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* PART 2: Tech Stack */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Our Tech Stack
            </h2>
            <p className="text-gray-500 text-lg max-w-4xl mx-auto leading-relaxed">
              Our expertise spans over 100+ innovative technologies and platforms, enabling us to deliver customized business solutions.
            </p>
          </div>

          {/* Top Tabs */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16 border-b border-gray-200">
            {techStackCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  // Automatically select the first subcategory for the new category
                  if (techStackSubCategories[cat] && techStackSubCategories[cat].length > 0) {
                    setActiveSubCategory(techStackSubCategories[cat][0]);
                  }
                }}
                className={`text-lg font-semibold pb-4 relative transition-colors ${activeCategory === cat ? "text-gray-900 border-b-2 border-[#f97316]" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex flex-col md:flex-row gap-12 min-h-[400px]">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-64 flex flex-col gap-1 pr-4">
              {techStackSubCategories[activeCategory]?.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubCategory(sub)}
                  className={`text-left px-2 py-4 font-bold text-lg transition-all border-b border-gray-100 flex items-center justify-between group ${activeSubCategory === sub
                    ? "text-[#f97316]"
                    : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                  {sub}
                  <ArrowRight className={`w-5 h-5 transition-transform ${activeSubCategory === sub ? "translate-x-1 opacity-100" : "opacity-0 -translate-x-2 group-hover:opacity-50"}`} />
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="flex-1 bg-gray-50/50 rounded-2xl p-8 md:p-12">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
                {techData[activeSubCategory]?.map((tech, idx) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="bg-white p-6 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-shadow aspect-square flex flex-col items-center justify-center gap-4 group cursor-default"
                  >
                    <tech.icon size={56} className="text-gray-600 group-hover:scale-110 transition-transform duration-300" style={{ color: tech.color }} />
                    <span className="text-sm font-bold text-gray-700">{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-16">
            <button className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold py-4 px-12 rounded-sm flex items-center gap-2 transition-all uppercase tracking-widest text-sm shadow-xl shadow-orange-500/20">
              Explore More
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiTechStackSection;
