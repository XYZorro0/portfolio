import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import ResumeSection from "@/components/ResumeSection";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <div className="relative z-10">
        <About />
        <Experience />
        <Projects />
        <ResumeSection />
      </div>
    </main>
  );
}
