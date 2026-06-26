import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "current-project.json");

function readProject() {
  try {
    return JSON.parse(readFileSync(DATA_PATH, "utf-8"));
  } catch {
    return null;
  }
}

export async function GET() {
  const data = readProject();
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.title || !body.description || !body.status) {
      return NextResponse.json(
        { error: "title, description, and status are required" },
        { status: 400 }
      );
    }

    const project = {
      title: String(body.title),
      description: String(body.description),
      techStack: Array.isArray(body.techStack) ? body.techStack.map(String) : [],
      status: String(body.status),
      link: body.link ? String(body.link) : "",
      githubLink: body.githubLink ? String(body.githubLink) : "",
      startDate: body.startDate ? String(body.startDate) : new Date().toISOString().slice(0, 10),
    };

    writeFileSync(DATA_PATH, JSON.stringify(project, null, 2), "utf-8");
    return NextResponse.json({ success: true, data: project });
  } catch (err) {
    console.error("Failed to update current project:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
