"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ExternalLink, GitFork, Zap } from "lucide-react";

interface CurrentProject {
  title: string;
  description: string;
  techStack: string[];
  status: string;
  link?: string;
  githubLink?: string;
  startDate: string;
}

const pastProjects = [
  {
    title: "Neural Style Transfer Web App",
    description:
      "A full-stack web application that applies artistic style transfer to images using a fine-tuned VGG-19 model. Deployed on AWS with a React frontend and FastAPI backend.",
    tech: ["PyTorch", "FastAPI", "React", "AWS S3", "Docker"],
    github: "",
    live: "",
  },
  {
    title: "Distributed ML Training Pipeline",
    description:
      "Scalable data preprocessing and training orchestration pipeline using Apache Spark and PyTorch DDP. Reduced training time by 4× on multi-node GPU clusters.",
    tech: ["Python", "Spark", "PyTorch", "Azure ML", "MLflow"],
    github: "",
    live: "",
  },
  {
    title: "LLM-Powered Document Q&A",
    description:
      "RAG-based document assistant that indexes enterprise PDFs with embeddings and answers questions with source citations. Built with LangChain, ChromaDB, and a Next.js UI.",
    tech: ["LangChain", "ChromaDB", "OpenAI", "Next.js", "Python"],
    github: "",
    live: "",
  },
  {
    title: "Real-Time Object Detection Dashboard",
    description:
      "Edge-deployed YOLO model with a live video feed dashboard. Processes 30 FPS on NVIDIA Jetson Nano with a WebSocket-based React frontend for real-time visualization.",
    tech: ["Python", "YOLOv8", "WebSockets", "React", "TensorRT"],
    github: "",
    live: "",
  },
];

function CurrentProjectCard({ project }: { project: CurrentProject }) {
  const statusColor =
    project.status === "LIVE"
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      : project.status === "IN PROGRESS"
      ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
      : "text-sky-400 border-sky-500/30 bg-sky-500/10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/60 to-[#0a0a1a] p-6 mb-8 overflow-hidden"
      style={{
        boxShadow:
          "0 0 0 1px rgba(99,102,241,0.2), 0 8px 40px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-indigo-400" />
            <span className="text-[11px] font-mono text-indigo-400 tracking-widest uppercase">
              What I&apos;m Currently Building
            </span>
          </div>
          <span
            className={`text-[10px] font-mono px-2.5 py-1 rounded-full border font-bold tracking-widest ${statusColor}`}
          >
            ● {project.status}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="text-xs px-2.5 py-1 rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 font-mono"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors border border-indigo-500/30 hover:border-indigo-400/50 px-3 py-1.5 rounded-lg hover:bg-indigo-500/10"
            >
              <ExternalLink size={12} />
              Live Demo
            </a>
          )}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              <GitFork size={12} />
              GitHub
            </a>
          )}
          <a
            href="/admin"
            className="ml-auto text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Edit ✎
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectCard({
  project,
  index,
  isInView,
}: {
  project: (typeof pastProjects)[0];
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glow-card rounded-xl border border-indigo-500/10 bg-[#0a0a1a] p-5 flex flex-col gap-4 group transition-all duration-300 hover:border-indigo-500/25"
    >
      <div>
        <h3 className="text-base font-semibold text-white mb-2 group-hover:text-indigo-200 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed">{project.description}</p>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto">
        {project.tech.map((t) => (
          <span
            key={t}
            className="text-[11px] px-2 py-0.5 rounded-md border border-indigo-500/15 text-indigo-400/80 font-mono bg-indigo-500/5"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="flex gap-3 pt-1 border-t border-white/5">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors"
          >
            <GitFork size={12} />
            Code
          </a>
        )}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-400 transition-colors"
          >
            <ExternalLink size={12} />
            Demo
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [currentProject, setCurrentProject] = useState<CurrentProject | null>(null);

  useEffect(() => {
    fetch("/api/current-project")
      .then((r) => r.json())
      .then(setCurrentProject)
      .catch(() => null);
  }, []);

  return (
    <section id="projects" className="section max-w-6xl mx-auto px-6" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-4 mb-12">
          <span className="text-xs font-mono text-indigo-400 tracking-widest uppercase">
            03. Projects
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/30 to-transparent" />
        </div>

        {/* Current project */}
        {currentProject && <CurrentProjectCard project={currentProject} />}

        {/* Past projects grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {pastProjects.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} isInView={isInView} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
