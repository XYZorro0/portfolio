"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const skillCategories = [
  {
    label: "Languages",
    color: "red",
    skills: ["Python", "Java", "SQL", "JavaScript", "TypeScript", "HTML/CSS"],
  },
  {
    label: "Frameworks & Libraries",
    color: "slate",
    skills: ["TensorFlow", "PyTorch", "React", "Node.js", "Scikit-learn", "MediaPipe", "DistilBERT"],
  },
  {
    label: "AI / ML",
    color: "rose",
    skills: ["CNNs", "NLP", "Transformer Models", "Computer Vision", "Data Augmentation", "Model Evaluation"],
  },
  {
    label: "Cloud & DevOps",
    color: "zinc",
    skills: ["AWS (EC2, S3, Lambda)", "Docker", "CI/CD", "Git", "Linux"],
  },
  {
    label: "Databases",
    color: "stone",
    skills: ["MySQL", "PostgreSQL", "DynamoDB"],
  },
  {
    label: "Tools & Platforms",
    color: "neutral",
    skills: ["Jupyter Notebook", "VS Code", "Jira", "Agile / Scrum"],
  },
];

const colorMap: Record<string, string> = {
  red: "border-red-500/30 text-red-300 hover:border-red-400/60 hover:bg-red-500/10",
  rose: "border-rose-500/30 text-rose-300 hover:border-rose-400/60 hover:bg-rose-500/10",
  slate: "border-slate-400/30 text-slate-300 hover:border-slate-300/60 hover:bg-slate-400/10",
  zinc: "border-zinc-400/30 text-zinc-300 hover:border-zinc-300/60 hover:bg-zinc-400/10",
  stone: "border-stone-400/30 text-stone-300 hover:border-stone-300/60 hover:bg-stone-400/10",
  neutral: "border-neutral-400/30 text-neutral-300 hover:border-neutral-300/60 hover:bg-neutral-400/10",
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
          <span className="text-xs font-mono text-red-400 tracking-widest uppercase">
            01. About
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-red-500/30 to-transparent" />
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
                I&apos;m a Computer Science graduate from the University of
                Houston focused on AI/ML engineering — building deep learning
                systems and taking them from research to working software.
              </p>
              <p>
                My project work spans computer vision and CNNs (a dual-pipeline
                lung cancer detector that placed 3rd at UH&apos;s HPE Data
                Science Institute showcase), NLP and transformer models
                (multilingual fraud detection with DistilBERT), and relational
                data systems. I work primarily in TensorFlow, PyTorch, and
                Python on AWS.
              </p>
              <p>
                I&apos;m NVIDIA-certified in Deep Learning Fundamentals. Outside
                of coursework I teach — I worked as a coding instructor for kids
                — and run a personal home lab for systems and AI experimentation.
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { label: "NVIDIA Certified", sub: "Deep Learning" },
                {
                  label: "B.S. Computer Science",
                  sub: "Univ. of Houston · Dec 2025",
                },
                { label: "Houston, TX", sub: "Open to opportunities" },
                { label: "3rd Place", sub: "UH Data Science Showcase" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="p-3 rounded-lg border border-red-500/10 bg-red-500/5"
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
