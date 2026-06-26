"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const skillCategories = [
  {
    label: "Languages",
    color: "indigo",
    skills: ["Python", "TypeScript", "JavaScript", "Java", "C++", "SQL", "HTML/CSS"],
  },
  {
    label: "Frameworks & Libraries",
    color: "violet",
    skills: ["React", "Next.js", "FastAPI", "Node.js", "PyTorch", "TensorFlow", "LangChain"],
  },
  {
    label: "AI / ML",
    color: "sky",
    skills: ["LLMs", "Fine-tuning", "RAG", "Computer Vision", "NLP", "Model Deployment", "NVIDIA Deep Learning"],
  },
  {
    label: "Cloud & DevOps",
    color: "emerald",
    skills: ["AWS", "Azure", "GCP", "Docker", "Git", "GitHub Actions", "Linux", "Spark"],
  },
  {
    label: "Databases & Data",
    color: "amber",
    skills: ["PostgreSQL", "BigQuery", "MongoDB", "Redis", "SQL Server"],
  },
];

const colorMap: Record<string, string> = {
  indigo: "border-indigo-500/25 text-indigo-300 hover:border-indigo-400/50 hover:bg-indigo-500/10",
  violet: "border-violet-500/25 text-violet-300 hover:border-violet-400/50 hover:bg-violet-500/10",
  sky: "border-sky-500/25 text-sky-300 hover:border-sky-400/50 hover:bg-sky-500/10",
  emerald: "border-emerald-500/25 text-emerald-300 hover:border-emerald-400/50 hover:bg-emerald-500/10",
  amber: "border-amber-500/25 text-amber-300 hover:border-amber-400/50 hover:bg-amber-500/10",
};

function SkillBadge({ skill, color }: { skill: string; color: string }) {
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`inline-block px-3 py-1 rounded-md border text-xs font-mono transition-all duration-200 cursor-default ${colorMap[color]}`}
    >
      {skill}
    </motion.span>
  );
}

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="section max-w-6xl mx-auto px-6" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Section header */}
        <div className="flex items-center gap-4 mb-12">
          <span className="text-xs font-mono text-indigo-400 tracking-widest uppercase">
            01. About
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/30 to-transparent" />
        </div>

        <div className="grid md:grid-cols-5 gap-12 items-start">
          {/* Bio */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-3xl font-bold text-white">
              Building at the intersection of{" "}
              <span className="gradient-text">AI and engineering</span>
            </h2>
            <div className="space-y-3 text-gray-400 text-sm leading-relaxed">
              <p>
                I&apos;m an AI/ML Engineer and Full-Stack Developer with a
                background in Computer Science from the University of Houston.
                I specialize in taking machine learning from prototype to
                production — training models, building APIs, and shipping
                user-facing products.
              </p>
              <p>
                My work spans deep learning with PyTorch and TensorFlow, large
                language model applications, and scalable cloud systems on AWS
                and Azure. I&apos;m NVIDIA-certified in Deep Learning fundamentals.
              </p>
              <p>
                When I&apos;m not building, I&apos;m teaching — I&apos;ve worked as a coding
                instructor helping the next generation of developers discover
                the power of software.
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { label: "NVIDIA Certified", sub: "Deep Learning" },
                { label: "University of Houston", sub: "B.S. Computer Science" },
                { label: "AI/ML Focus", sub: "PyTorch · TensorFlow" },
                { label: "Full-Stack", sub: "React · FastAPI · Cloud" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="p-3 rounded-lg border border-indigo-500/10 bg-indigo-500/5"
                >
                  <div className="text-xs font-semibold text-white">{s.label}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="md:col-span-3 space-y-6">
            {skillCategories.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="text-[11px] font-mono text-gray-500 uppercase tracking-widest mb-2">
                  {cat.label}
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <SkillBadge key={skill} skill={skill} color={cat.color} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
