/* ============================================================
   Terminal-themed portfolio — Niket Gupta
   Plain JS, no dependencies.
   ============================================================ */

(function () {
  "use strict";

  /* ------------------------------------------------------------
     --- EDIT ME ---  All personal content lives here.
     Update these objects to change what the site displays.
     ------------------------------------------------------------ */
  const DATA = {
    user: "niket",
    host: "portfolio",

    // `whoami`
    whoami: "Niket Gupta — Software Engineer",

    // `about`
    about: [
      "Hi, I'm Niket Gupta — a software engineer who enjoys turning",
      "ideas into reliable, well-crafted products. I work across the",
      "stack, care about clean systems and good developer experience,",
      "and like building things people actually use.",
      "",
      "Currently focused on full-stack web development, distributed",
      "systems, and the occasional weekend side project.",
      "",
      "[ This is placeholder bio text — edit DATA.about in script.js ]",
    ],

    // `skills`  (label -> list)
    skills: {
      Languages: ["JavaScript / TypeScript", "Python", "Go", "SQL", "Java"],
      Frameworks: ["React", "Node.js", "Next.js", "Express", "FastAPI"],
      Tools: ["Git", "Docker", "PostgreSQL", "AWS", "Linux", "CI/CD"],
    },

    // `projects`
    projects: [
      {
        name: "terminal-portfolio",
        desc: "This interactive terminal-style portfolio (vanilla HTML/CSS/JS).",
        link: "https://github.com/niketgupta/terminal-portfolio",
      },
      {
        name: "task-orchestrator",
        desc: "A distributed job queue with retries, backoff, and a live dashboard.",
        link: "https://github.com/niketgupta/task-orchestrator",
      },
      {
        name: "devnotes",
        desc: "A markdown knowledge base with full-text search and tagging.",
        link: "https://github.com/niketgupta/devnotes",
      },
    ],

    // `contact`
    contact: {
      email: "niketgupta1@gmail.com",
      github: "https://github.com/niketgupta", // placeholder
      linkedin: "https://www.linkedin.com/in/niketgupta", // placeholder
    },
  };

  // ASCII art banner for "NIKET GUPTA"
  const BANNER = String.raw`
 _   _ ___ _  _____ _____    ____ _   _ ____ _____  _
| \ | |_ _| |/ / _ \_   _|  / ___| | | |  _ \_   _|/ \
|  \| || || ' / |_) || |   | |  _| | | | |_) || | / _ \
| |\  || || . \  __/ | |   | |_| | |_| |  __/ | |/ ___ \
|_| \_|___|_|\_\_|    |_|    \____|\___/|_|    |_/_/   \_\
`;

  /* ------------------------------------------------------------
     DOM references
     ------------------------------------------------------------ */
  const body = document.getElementById("terminal-body");
  const output = document.getElementById("output");
  const inputLine = document.getElementById("input-line");
  const input = document.getElementById("cmd-input");
  const terminal = document.getElementById("terminal");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const PROMPT = `${DATA.user}@${DATA.host}:~$`;

  // command history
  const history = [];
  let historyIndex = -1;

  /* ------------------------------------------------------------
     Helpers
     ------------------------------------------------------------ */
  function scrollToBottom() {
    body.scrollTop = body.scrollHeight;
  }

  function esc(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  // Append a block of HTML as a new fading-in line.
  function appendHTML(html, className) {
    const div = document.createElement("div");
    div.className = "line" + (className ? " " + className : "");
    div.innerHTML = html;
    output.appendChild(div);
    scrollToBottom();
    return div;
  }

  // Typewriter: append plain text char-by-char into a fresh line.
  function typeLine(text, speed) {
    return new Promise((resolve) => {
      const div = document.createElement("div");
      div.className = "line";
      output.appendChild(div);

      if (reduceMotion || speed === 0) {
        div.textContent = text;
        scrollToBottom();
        return resolve();
      }

      let i = 0;
      const step = () => {
        div.textContent = text.slice(0, i);
        scrollToBottom();
        if (i++ <= text.length) {
          setTimeout(step, speed || 12);
        } else {
          resolve();
        }
      };
      step();
    });
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));
  }

  /* ------------------------------------------------------------
     Command implementations
     Each returns an HTML string (or "" for none / special-cased).
     ------------------------------------------------------------ */
  const commands = {
    help() {
      const rows = [
        ["help", "show this list of commands"],
        ["about", "who is Niket?"],
        ["skills", "languages, frameworks &amp; tools"],
        ["projects", "things I've built"],
        ["contact", "how to reach me"],
        ["whoami", "current user"],
        ["date", "show the current date &amp; time"],
        ["theme", "switch theme: theme [green|amber]"],
        ["clear", "clear the terminal"],
      ];
      const grid = rows
        .map(
          ([c, d]) =>
            `<span class="cmd">${c}</span><span class="dim">${d}</span>`
        )
        .join("");
      return (
        `<div class="block">` +
        `<div class="dim">Available commands — type one and press Enter:</div>` +
        `<div class="help-grid" style="margin-top:6px">${grid}</div>` +
        `<div class="dim" style="margin-top:8px">Tip: use &uarr;/&darr; to browse command history.</div>` +
        `</div>`
      );
    },

    about() {
      const lines = DATA.about.map((l) => esc(l) || "&nbsp;").join("<br>");
      return `<div class="block">${lines}</div>`;
    },

    skills() {
      let html = `<div class="block">`;
      for (const [label, items] of Object.entries(DATA.skills)) {
        html +=
          `<div class="skill-row">` +
          `<span class="label">${esc(label)}:</span> ` +
          `<span>${items.map(esc).join(", ")}</span>` +
          `</div>`;
      }
      html += `</div>`;
      return html;
    },

    projects() {
      let html = `<div class="block">`;
      DATA.projects.forEach((p, i) => {
        html +=
          `<div class="project">` +
          `<span class="dim">[${i + 1}]</span> ` +
          `<span class="pname">${esc(p.name)}</span><br>` +
          `<span class="dim">    ${esc(p.desc)}</span><br>` +
          `<span class="dim">    &rarr; </span>` +
          `<a href="${esc(p.link)}" target="_blank" rel="noopener noreferrer">${esc(
            p.link
          )}</a>` +
          `</div>`;
      });
      html += `</div>`;
      return html;
    },

    contact() {
      const c = DATA.contact;
      return (
        `<div class="block">` +
        `<div><span class="label">email:</span>    <a href="mailto:${esc(
          c.email
        )}">${esc(c.email)}</a></div>` +
        `<div><span class="label">github:</span>   <a href="${esc(
          c.github
        )}" target="_blank" rel="noopener noreferrer">${esc(c.github)}</a></div>` +
        `<div><span class="label">linkedin:</span> <a href="${esc(
          c.linkedin
        )}" target="_blank" rel="noopener noreferrer">${esc(
          c.linkedin
        )}</a></div>` +
        `</div>`
      );
    },

    whoami() {
      return `<div class="block">${esc(DATA.whoami)}</div>`;
    },

    date() {
      return `<div class="block">${esc(new Date().toString())}</div>`;
    },

    theme(args) {
      const choice = (args[0] || "").toLowerCase();
      const current =
        document.documentElement.getAttribute("data-theme") === "amber"
          ? "amber"
          : "green";

      let next;
      if (choice === "amber" || choice === "green") {
        next = choice;
      } else if (choice === "") {
        next = current === "green" ? "amber" : "green"; // toggle
      } else {
        return `<div class="block error">usage: theme [green|amber]</div>`;
      }

      if (next === "amber") {
        document.documentElement.setAttribute("data-theme", "amber");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
      return `<div class="block">theme set to <span class="accent">${next}</span>.</div>`;
    },

    clear() {
      output.innerHTML = "";
      return ""; // nothing to print
    },
  };

  /* ------------------------------------------------------------
     Run a command line (echo + dispatch)
     ------------------------------------------------------------ */
  function runCommand(raw) {
    const trimmed = raw.trim();

    // echo the prompt + typed command
    appendHTML(
      `<span class="prompt">${PROMPT}</span>` +
        `<span class="cmd-text">${esc(raw)}</span>`,
      "echo"
    );

    if (trimmed === "") return;

    const parts = trimmed.split(/\s+/);
    const name = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (Object.prototype.hasOwnProperty.call(commands, name)) {
      const out = commands[name](args);
      if (out) appendHTML(out);
    } else {
      appendHTML(
        `<div class="block error">command not found: ${esc(
          name
        )} — type <span class="accent">help</span> for a list.</div>`
      );
    }
  }

  /* ------------------------------------------------------------
     Input handling
     ------------------------------------------------------------ */
  function handleKeydown(e) {
    if (e.key === "Enter") {
      const value = input.value;
      input.value = "";
      if (value.trim() !== "") {
        history.push(value);
      }
      historyIndex = history.length;
      runCommand(value);
      scrollToBottom();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = history[historyIndex] || "";
      moveCaretToEnd();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length === 0) return;
      historyIndex = Math.min(history.length, historyIndex + 1);
      input.value = history[historyIndex] || "";
      moveCaretToEnd();
    } else if (e.key === "l" && e.ctrlKey) {
      // Ctrl+L clears, like a real terminal
      e.preventDefault();
      output.innerHTML = "";
    }
  }

  function moveCaretToEnd() {
    requestAnimationFrame(() => {
      const len = input.value.length;
      input.setSelectionRange(len, len);
    });
  }

  // Keep focus on the input; clicking anywhere refocuses
  // (unless the user is selecting text or clicking a link).
  function refocus(e) {
    if (e && e.target && e.target.closest("a")) return;
    if (window.getSelection && String(window.getSelection())) return;
    input.focus();
  }

  /* ------------------------------------------------------------
     Boot sequence
     ------------------------------------------------------------ */
  async function boot() {
    // ASCII banner (instant, monospace pre)
    const pre = document.createElement("pre");
    pre.className = "ascii line";
    pre.textContent = BANNER;
    output.appendChild(pre);
    scrollToBottom();

    await sleep(150);
    await typeLine("Welcome to Niket Gupta's portfolio terminal.", 18);
    await typeLine("Booting interactive shell...", 14);
    await sleep(120);

    // Auto-run a small scripted sequence with the typewriter prompt.
    await autoRun("whoami");
    await sleep(150);
    await autoRun("help");

    // Hand control to the visitor.
    inputLine.hidden = false;
    input.focus();
    scrollToBottom();
  }

  // Type a command at a fake prompt, then execute it.
  async function autoRun(cmd) {
    const div = document.createElement("div");
    div.className = "line echo";
    const promptSpan = document.createElement("span");
    promptSpan.className = "prompt";
    promptSpan.textContent = PROMPT;
    const cmdSpan = document.createElement("span");
    cmdSpan.className = "cmd-text";
    cmdSpan.style.marginLeft = "8px";
    div.appendChild(promptSpan);
    div.appendChild(cmdSpan);
    output.appendChild(div);
    scrollToBottom();

    // type the command characters
    if (reduceMotion) {
      cmdSpan.textContent = cmd;
    } else {
      for (let i = 1; i <= cmd.length; i++) {
        cmdSpan.textContent = cmd.slice(0, i);
        scrollToBottom();
        await sleep(55);
      }
    }
    await sleep(200);

    // execute (without re-echoing the prompt)
    const parts = cmd.trim().split(/\s+/);
    const out = commands[parts[0]](parts.slice(1));
    if (out) appendHTML(out);
  }

  /* ------------------------------------------------------------
     Wire up + start
     ------------------------------------------------------------ */
  input.addEventListener("keydown", handleKeydown);
  terminal.addEventListener("click", refocus);
  document.addEventListener("DOMContentLoaded", () => {});

  boot();
})();
