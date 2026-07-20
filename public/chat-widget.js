/**
 * Embeddable chat widget for niketgupta.com.
 *
 * Usage — serve this file from the site's own origin (CSP script-src 'self')
 * and drop one tag into the page:
 *
 *   <script src="/chat-widget.js" defer
 *           data-api-url="https://chat-api.niketgupta.com"
 *           data-api-key="YOUR_WIDGET_KEY"></script>
 *
 * Optional: data-accent="#ce1141" to recolor.
 * No framework, no dependencies; everything is scoped under #ng-chat.
 */
(function () {
  "use strict";

  var script = document.currentScript;
  var API_URL = ((script && script.dataset.apiUrl) || "").replace(/\/+$/, "");
  var API_KEY = (script && script.dataset.apiKey) || "";
  var ACCENT = (script && script.dataset.accent) || "#ce1141";

  if (!API_URL) {
    console.error("[ng-chat] data-api-url is required on the script tag");
    return;
  }

  var SUGGESTIONS = [
    "What projects has Niket built?",
    "What's his tech stack?",
    "Tell me about the lung cancer detection project",
    "How can I contact him?",
  ];
  var WELCOME =
    "Hi! I'm Niket's AI assistant — running on his own hardware. " +
    "Ask me about his background, skills, projects, or experience.";

  var HISTORY_MAX = 8; // turns sent back to the API for follow-up context

  var css = [
    "#ng-chat{--ng-accent:" + ACCENT + ";--ng-bg:#0f0f10;--ng-panel:#161618;",
    "--ng-bubble:#1f1f22;--ng-text:#e7e7ea;--ng-dim:#9a9aa2;",
    "position:fixed;bottom:20px;right:20px;z-index:2147483000;",
    "font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;",
    "font-size:14px;line-height:1.5;color:var(--ng-text)}",
    "#ng-chat *{box-sizing:border-box;margin:0;padding:0}",

    "#ng-chat-launcher{width:56px;height:56px;border-radius:50%;border:1px solid rgba(255,255,255,.12);",
    "background:linear-gradient(135deg,var(--ng-accent),#7a0a26);color:#fff;cursor:pointer;",
    "display:flex;align-items:center;justify-content:center;",
    "box-shadow:0 4px 24px rgba(206,17,65,.4);transition:transform .15s ease}",
    "#ng-chat-launcher:hover{transform:scale(1.06)}",
    "#ng-chat-launcher svg{width:26px;height:26px}",

    "#ng-chat-panel{display:none;position:absolute;bottom:72px;right:0;width:370px;max-width:calc(100vw - 40px);",
    "height:520px;max-height:calc(100vh - 120px);flex-direction:column;overflow:hidden;",
    "background:var(--ng-panel);border:1px solid rgba(255,255,255,.1);border-radius:16px;",
    "box-shadow:0 12px 48px rgba(0,0,0,.55)}",
    "#ng-chat.ng-open #ng-chat-panel{display:flex}",
    "#ng-chat.ng-open #ng-chat-launcher{display:none}",

    "#ng-chat-header{display:flex;align-items:center;gap:10px;padding:14px 16px;",
    "background:linear-gradient(135deg,rgba(206,17,65,.18),rgba(0,0,0,0));border-bottom:1px solid rgba(255,255,255,.08)}",
    "#ng-chat-header .ng-dot{width:8px;height:8px;border-radius:50%;background:#34d399;flex:none;",
    "box-shadow:0 0 8px rgba(52,211,153,.8)}",
    "#ng-chat-header .ng-title{font-weight:600;font-size:14px}",
    "#ng-chat-header .ng-sub{font-size:11px;color:var(--ng-dim)}",
    "#ng-chat-close{margin-left:auto;background:none;border:none;color:var(--ng-dim);cursor:pointer;",
    "font-size:20px;line-height:1;padding:4px}",
    "#ng-chat-close:hover{color:var(--ng-text)}",

    "#ng-chat-log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;",
    "background:var(--ng-bg)}",
    ".ng-msg{max-width:85%;padding:9px 13px;border-radius:14px;white-space:pre-wrap;word-wrap:break-word}",
    ".ng-msg.ng-user{align-self:flex-end;background:var(--ng-accent);color:#fff;border-bottom-right-radius:4px}",
    ".ng-msg.ng-bot{align-self:flex-start;background:var(--ng-bubble);border-bottom-left-radius:4px}",
    ".ng-msg.ng-error{align-self:flex-start;background:rgba(206,17,65,.12);border:1px solid rgba(206,17,65,.35);",
    "color:#f3b8c4;font-size:13px}",

    ".ng-chips{display:flex;flex-wrap:wrap;gap:6px}",
    ".ng-chip{border:1px solid rgba(206,17,65,.35);background:rgba(206,17,65,.08);color:#e58aa0;",
    "border-radius:999px;padding:5px 11px;font-size:12px;cursor:pointer;transition:background .15s}",
    ".ng-chip:hover{background:rgba(206,17,65,.2)}",

    ".ng-typing{align-self:flex-start;display:flex;gap:4px;padding:12px 14px;background:var(--ng-bubble);",
    "border-radius:14px;border-bottom-left-radius:4px}",
    ".ng-typing span{width:6px;height:6px;border-radius:50%;background:var(--ng-dim);",
    "animation:ng-blink 1.2s infinite}",
    ".ng-typing span:nth-child(2){animation-delay:.2s}",
    ".ng-typing span:nth-child(3){animation-delay:.4s}",
    "@keyframes ng-blink{0%,80%,100%{opacity:.25}40%{opacity:1}}",
    "@media (prefers-reduced-motion:reduce){.ng-typing span{animation:none}",
    "#ng-chat-launcher{transition:none}}",

    "#ng-chat-form{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,.08);",
    "background:var(--ng-panel)}",
    "#ng-chat-input{flex:1;background:var(--ng-bg);border:1px solid rgba(255,255,255,.12);border-radius:10px;",
    "padding:10px 12px;color:var(--ng-text);font:inherit;outline:none}",
    "#ng-chat-input:focus{border-color:var(--ng-accent)}",
    "#ng-chat-input::placeholder{color:var(--ng-dim)}",
    "#ng-chat-send{background:var(--ng-accent);border:none;border-radius:10px;color:#fff;cursor:pointer;",
    "padding:0 16px;font-weight:600;font-size:14px}",
    "#ng-chat-send:disabled{opacity:.5;cursor:default}",

    "@media (max-width:480px){#ng-chat{bottom:12px;right:12px}",
    "#ng-chat-panel{width:calc(100vw - 24px);height:70vh}}",
  ].join("");

  var CHAT_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    if (text) node.textContent = text;
    return node;
  }

  var history = [];
  var sending = false;

  var root = el("div", { id: "ng-chat" });
  var style = document.createElement("style");
  style.textContent = css;

  var launcher = el("button", {
    id: "ng-chat-launcher",
    type: "button",
    "aria-label": "Open chat — ask about Niket",
  });
  launcher.innerHTML = CHAT_ICON;

  var panel = el("div", {
    id: "ng-chat-panel",
    role: "dialog",
    "aria-label": "Chat with Niket's AI assistant",
  });

  var header = el("div", { id: "ng-chat-header" });
  header.appendChild(el("span", { class: "ng-dot", "aria-hidden": "true" }));
  var titleWrap = el("div", {});
  titleWrap.appendChild(el("div", { class: "ng-title" }, "Ask me about Niket"));
  titleWrap.appendChild(
    el("div", { class: "ng-sub" }, "AI assistant · self-hosted on Ollama")
  );
  header.appendChild(titleWrap);
  var closeBtn = el(
    "button",
    { id: "ng-chat-close", type: "button", "aria-label": "Close chat" },
    "×"
  );
  header.appendChild(closeBtn);

  var log = el("div", {
    id: "ng-chat-log",
    role: "log",
    "aria-live": "polite",
  });

  var form = el("form", { id: "ng-chat-form" });
  var input = el("input", {
    id: "ng-chat-input",
    type: "text",
    placeholder: "Ask about Niket…",
    maxlength: "500",
    autocomplete: "off",
    "aria-label": "Your question",
  });
  var send = el("button", { id: "ng-chat-send", type: "submit" }, "Send");
  form.appendChild(input);
  form.appendChild(send);

  panel.appendChild(header);
  panel.appendChild(log);
  panel.appendChild(form);
  root.appendChild(style);
  root.appendChild(panel);
  root.appendChild(launcher);

  function scrollLog() {
    log.scrollTop = log.scrollHeight;
  }

  function addMessage(kind, text) {
    var msg = el("div", { class: "ng-msg ng-" + kind }, text);
    log.appendChild(msg);
    scrollLog();
    return msg;
  }

  function addChips() {
    var chips = el("div", { class: "ng-chips" });
    SUGGESTIONS.forEach(function (q) {
      var chip = el("button", { class: "ng-chip", type: "button" }, q);
      chip.addEventListener("click", function () {
        chips.remove();
        ask(q);
      });
      chips.appendChild(chip);
    });
    log.appendChild(chips);
    scrollLog();
  }

  function addTyping() {
    var t = el("div", { class: "ng-typing", "aria-label": "Assistant is typing" });
    t.appendChild(el("span", {}));
    t.appendChild(el("span", {}));
    t.appendChild(el("span", {}));
    log.appendChild(t);
    scrollLog();
    return t;
  }

  function setSending(value) {
    sending = value;
    send.disabled = value;
    input.disabled = value;
  }

  function ask(question) {
    if (sending) return;
    addMessage("user", question);
    setSending(true);
    var typing = addTyping();

    fetch(API_URL + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": API_KEY },
      body: JSON.stringify({ message: question, history: history }),
    })
      .then(function (res) {
        return res
          .json()
          .catch(function () {
            return {};
          })
          .then(function (data) {
            typing.remove();
            if (!res.ok) {
              addMessage(
                "error",
                data.error ||
                  "Something went wrong reaching the assistant. Please try again."
              );
              return;
            }
            addMessage("bot", data.answer);
            history.push(
              { role: "user", content: question },
              { role: "assistant", content: data.answer }
            );
            if (history.length > HISTORY_MAX) {
              history = history.slice(-HISTORY_MAX);
            }
          });
      })
      .catch(function () {
        typing.remove();
        addMessage(
          "error",
          "Can't reach the assistant right now — it may be offline. " +
            "You can always email Niket at niketgupta1@gmail.com."
        );
      })
      .then(function () {
        setSending(false);
        input.focus();
      });
  }

  function open() {
    root.classList.add("ng-open");
    if (!log.childElementCount) {
      addMessage("bot", WELCOME);
      addChips();
    }
    input.focus();
  }

  function close() {
    root.classList.remove("ng-open");
    launcher.focus();
  }

  launcher.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  root.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q) return;
    input.value = "";
    ask(q);
  });

  if (document.body) {
    document.body.appendChild(root);
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      document.body.appendChild(root);
    });
  }
})();
