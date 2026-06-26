"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const experiences = [
  {
    company: "ICode",
    role: "Coding Instructor",
    period: "May 2023 — Present",
    type: "Part-Time",
    bullets: [
      "Designed and delivered coding curriculum for students ages 7–18, covering Python, JavaScript, and game development",
      "Introduced AI/ML concepts through hands-on projects, increasing student engagement and retention",
      "Mentored 30+ students per semester across beginner to advanced tracks",
    ],
  },
  {
    company: "IronEdge Group",
    role: "IT Intern",
    period: "Jan 2019 — Dec 2019",
    type: "Internship",
    bullets: [
      "Provided IT support and system administration for enterprise clients across managed services",
      "Deployed and maintained Windows/Linux systems, performing network diagnostics and troubleshooting",
      "Documented internal processes and improved ticketing workflows, reducing resolution time by 20%",
    ],
  },
  {
    company: "High School JROTC",
    role: "Student Volunteer & Leadership",
    period: "Jan 2016 — May 2018",
    type: "Volunteer",
    bullets: [
      "Led a team of 15+ cadets in community service and leadership development activities",
      "Developed strong communication, organization, and team coordination skills",
    ],
  },
];

function ExperienceCard({
  exp,
  index,
  isInView,
}: {
  exp: (typeof experiences)[0];
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-8 pb-12 last:pb-0"
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-2 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 to-transparent" />
      {/* Timeline dot */}
      <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-[#05050f]" />

      <div className="glow-card rounded-xl border border-indigo-500/10 bg-[#0a0a1a] p-6 transition-all duration-300">
        <div className="flex flex-wrap gap-2 items-start justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold text-white">{exp.role}</h3>
            <div className="text-sm text-indigo-400 font-medium">{exp.company}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-gray-500 font-mono">{exp.period}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-indigo-500/20 text-indigo-400 bg-indigo-500/5 font-mono uppercase tracking-wider">
              {exp.type}
            </span>
          </div>
        </div>
        <ul className="space-y-1.5">
          {exp.bullets.map((b, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-400">
              <span className="text-indigo-500 mt-0.5 shrink-0">▸</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" className="section max-w-6xl mx-auto px-6" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-4 mb-12">
          <span className="text-xs font-mono text-indigo-400 tracking-widest uppercase">
            02. Experience
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/30 to-transparent" />
        </div>

        <div className="max-w-2xl">
          {experiences.map((exp, i) => (
            <ExperienceCard key={exp.company} exp={exp} index={i} isInView={isInView} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
