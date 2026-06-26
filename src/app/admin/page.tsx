"use client";

import { useEffect, useState } from "react";
import { Save, ArrowLeft, Plus, X, CheckCircle, AlertCircle } from "lucide-react";

interface ProjectData {
  title: string;
  description: string;
  techStack: string[];
  status: string;
  link: string;
  githubLink: string;
  startDate: string;
}

const STATUS_OPTIONS = ["IN PROGRESS", "LIVE", "PAUSED", "SHIPPED"];

const defaultData: ProjectData = {
  title: "",
  description: "",
  techStack: [],
  status: "IN PROGRESS",
  link: "",
  githubLink: "",
  startDate: new Date().toISOString().slice(0, 10),
};

export default function AdminPage() {
  const [form, setForm] = useState<ProjectData>(defaultData);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/current-project")
      .then((r) => r.json())
      .then((d) => {
        setForm(d);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  function addTech() {
    const val = techInput.trim();
    if (val && !form.techStack.includes(val)) {
      setForm((f) => ({ ...f, techStack: [...f.techStack, val] }));
    }
    setTechInput("");
  }

  function removeTech(tech: string) {
    setForm((f) => ({ ...f, techStack: f.techStack.filter((t) => t !== tech) }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setResult(null);
    try {
      const res = await fetch("/api/current-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setResult("success");
      } else {
        setResult("error");
      }
    } catch {
      setResult("error");
    } finally {
      setSaving(false);
      setTimeout(() => setResult(null), 4000);
    }
  }

  return (
    <div className="min-h-screen bg-[#05050f] text-[#e8eaf6] font-sans">
      {/* Top bar */}
      <div className="border-b border-indigo-500/10 px-6 py-4 flex items-center gap-4 bg-[#07071a]">
        <a
          href="/"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Back to site
        </a>
        <div className="flex-1 text-center">
          <span className="text-xs font-mono text-indigo-400 tracking-widest uppercase">
            Admin — Current Project Editor
          </span>
        </div>
        <div className="w-24" />
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Edit Current Project
          </h1>
          <p className="text-sm text-gray-500">
            Changes are saved to <code className="text-indigo-400 text-xs bg-indigo-500/10 px-1.5 py-0.5 rounded">data/current-project.json</code>{" "}
            and appear live on the homepage.
          </p>
        </div>

        {!loaded ? (
          <div className="text-gray-500 text-sm animate-pulse">Loading...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                Project Title *
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. AI Code Review Tool"
                className="w-full px-4 py-3 rounded-xl border border-indigo-500/20 bg-[#0a0a1a] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="What are you building and why does it matter?"
                className="w-full px-4 py-3 rounded-xl border border-indigo-500/20 bg-[#0a0a1a] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                Status *
              </label>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, status: s }))}
                    className={`px-4 py-2 rounded-lg border text-xs font-mono font-bold tracking-widest transition-all ${
                      form.status === s
                        ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                        : "border-indigo-500/20 text-gray-500 hover:border-indigo-500/40 hover:text-gray-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                Tech Stack
              </label>
              <div className="flex gap-2">
                <input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTech();
                    }
                  }}
                  placeholder="Add a technology (press Enter)"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-indigo-500/20 bg-[#0a0a1a] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={addTech}
                  className="px-3 py-2.5 rounded-xl border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
              {form.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {form.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-indigo-500/25 bg-indigo-500/10 text-indigo-300 text-xs font-mono"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTech(tech)}
                        className="text-indigo-400/60 hover:text-red-400 transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                  Live URL
                </label>
                <input
                  type="url"
                  value={form.link}
                  onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl border border-indigo-500/20 bg-[#0a0a1a] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={form.githubLink}
                  onChange={(e) => setForm((f) => ({ ...f, githubLink: e.target.value }))}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-indigo-500/20 bg-[#0a0a1a] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>
            </div>

            {/* Start date */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                Start Date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                className="px-4 py-2.5 rounded-xl border border-indigo-500/20 bg-[#0a0a1a] text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>

            {/* Result banner */}
            {result === "success" && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
                <CheckCircle size={15} />
                Saved successfully! The homepage will reflect changes on next load.
              </div>
            )}
            {result === "error" && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                <AlertCircle size={15} />
                Failed to save. Check that the server is running locally.
              </div>
            )}

            {/* Save button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-indigo-500/20"
            >
              <Save size={15} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
