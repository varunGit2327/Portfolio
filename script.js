/* ==== Script block 1 ==== */
// ── LOGO SVGs (self-contained, no external images needed) ──────────

  // ── SCROLL PROGRESS ──────────────────────────────────────────
  const prog = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    prog.style.width = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100) + '%';
  }, { passive: true });

  // ── NAV ──────────────────────────────────────────────────────
  const navShell = document.getElementById('navShell');
  window.addEventListener('scroll', () => {
    navShell.style.boxShadow = window.scrollY > 10 ? '0 12px 32px rgba(18,19,28,.1)' : '0 8px 26px rgba(18,19,28,.06)';
  }, { passive: true });
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open'); navToggle.classList.remove('active');
  }));

  // ── SCROLL REVEAL ────────────────────────────────────────────
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));


  // ════════════════════════════════════════════════════════════
  //  AI ASSISTANT
  // ════════════════════════════════════════════════════════════
const GROQ_API_KEY = "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";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";
  const SYSTEM_PROMPT = `You are Varun Kumar's AI Portfolio Assistant, embedded on his personal developer portfolio website.

Personality: Friendly, professional, approachable. Keep responses to 2-4 sentences unless asked for more detail.

About Varun
Name: Varun Kumar
Role: Computer Science Undergraduate & Software Engineer
Location: Bulandshahr, Uttar Pradesh, India
Email: varunkvdmv12@gmail.com
GitHub: github.com/varunGit2327
LinkedIn: linkedin.com/in/varunkumar257

Education
B.Tech Computer Science — Galgotias University, Greater Noida (Oct 2023 – Jun 2027), CGPA 8.79/10
Class XII — Kendriya Vidyalaya, Dimapur, Nagaland (May 2020), 75.2%
Class X — Assam Rifles Public School, Maram, Manipur (May 2018), 81.2%

Skills
Languages: Java, Python, JavaScript
Core CS: Data Structures, Algorithms, OOP, DBMS, Operating Systems, Computer Networks
Web: HTML, CSS
Data: EDA, Data Visualization, Pandas, Matplotlib
Databases: MySQL, SQL
Tools: Git, GitHub, VS Code

Projects
MediPulse (HTML, CSS, JavaScript) — premium healthcare web app for medicine reminders, health tracking, appointments, and wellness.
MoneyMate (HTML, CSS, JavaScript) — premium personal expense tracker for income, expenses, budgets, and savings.

Achievements
Solved 200+ DSA problems on LeetCode.
Earned 50 Days Badge, July Daily Challenge Badge, and 100 Days Badge (2026) on LeetCode.
Earned CodeStudio Achiever Badges in Sorting, Hash Table, and Arrays.

Certifications
AI-ML Virtual Internship — Eduskills (Mar 2025)
100 Days of Python — GUVI (May 2024)

Availability
Actively looking for Software Development Internships, open source collaboration, and freelance/tech project opportunities.

Rules
Answer only using the information above. Never invent skills, projects, or experience.
If unavailable, say: "I don't have that information handy. For specific questions, please reach out via email or LinkedIn."
For greetings, respond warmly. For contact questions, share email and LinkedIn.
Always stay positive, professional, and helpful — no exaggeration.`;

  let chatHistory = [];
  let isBotTyping = false;
  const fab = document.getElementById('ai-fab');
  const panel = document.getElementById('ai-panel');
  const msgArea = document.getElementById('aiMessages');
  const aiInput = document.getElementById('ai-input');
  const aiSend = document.getElementById('ai-send');
  const suggestions = document.getElementById('aiSuggestions');
  let isPanelOpen = false;

  fab.addEventListener('click', () => {
    isPanelOpen = !isPanelOpen;
    fab.classList.toggle('is-open', isPanelOpen);
    panel.classList.toggle('is-open', isPanelOpen);
    playSound(isPanelOpen ? "open" : "close");
    if (isPanelOpen) setTimeout(() => aiInput.focus(), 300);
  });

document.getElementById('aiClearBtn').addEventListener('click', () => {

    playSound("clear");   // 🔊 Clear sound

    chatHistory = [];
    msgArea.innerHTML = '';

    addBotMsg("Chat cleared! Still here — ask me anything about Varun. 😊");

    suggestions.style.display = 'flex';
});
  aiInput.addEventListener('input', () => {
    aiInput.style.height = 'auto';
    aiInput.style.height = Math.min(aiInput.scrollHeight, 100) + 'px';
  });
  aiInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } });
  aiSend.addEventListener('click', handleSend);

  suggestions.addEventListener('click', e => {
    const chip = e.target.closest('.ai-chip'); if (!chip) return;
    suggestions.style.display = 'none';
    aiInput.value = chip.dataset.msg;
    handleSend();
  });

  function addUserMsg(text) {
    const div = document.createElement('div');
    div.className = 'ai-msg user';
    div.innerHTML = `<div class="ai-msg-av">You</div><div class="ai-msg-bubble">${escHtml(text)}</div>`;
    msgArea.appendChild(div); scroll();
  }
  let audioCtx = null;

function playSound(type) {
    if (!audioCtx)
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    if (audioCtx.state === "suspended")
        audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === "send")
        osc.frequency.value = 700;
    else if (type === "receive")
        osc.frequency.value = 900;
    else if (type === "open")
        osc.frequency.value = 500;
    else if (type === "close")
    osc.frequency.value = 350;
    else if (type === "clear")
    osc.frequency.value = 250;
    else
        osc.frequency.value = 400;

    gain.gain.value = 0.08;

    osc.start();

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + 0.2
    );

    osc.stop(audioCtx.currentTime + 0.2);
}
  function addBotMsg(text) {
    const div = document.createElement('div');
    div.className = 'ai-msg bot';
    div.innerHTML = `<div class="ai-msg-av">VK</div><div class="ai-msg-bubble">${escHtml(text)}</div>`;
    msgArea.appendChild(div); scroll();
  }
  function showTyping() {
    const div = document.createElement('div');
    div.className = 'ai-msg bot'; div.id = 'ai-typing';
    div.innerHTML = `<div class="ai-msg-av">VK</div><div class="ai-msg-bubble"><div class="ai-typing"><span></span><span></span><span></span></div></div>`;
    msgArea.appendChild(div); scroll();
  }
  function removeTyping() { const t = document.getElementById('ai-typing'); if (t) t.remove(); }
  function scroll() { msgArea.scrollTop = msgArea.scrollHeight; }
  function escHtml(str) { return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>'); }
  async function handleSend() {
  const text = aiInput.value.trim();
  if (!text || isBotTyping) return;

  suggestions.style.display = "none";
  aiInput.value = "";
  aiInput.style.height = "auto";

  addUserMsg(text);
  playSound("send");
  chatHistory.push({
    role: "user",
    content: text
  });

  isBotTyping = true;
  aiSend.disabled = true;
  showTyping();

  try {

    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          ...chatHistory
        ],
        temperature: 0.7,
        max_completion_tokens: 600
      })
    });

    const data = await res.json();

    removeTyping();

    if (!res.ok) {
      addBotMsg("⚠️ " + (data.error?.message || "Groq API Error"));
      return;
    }

    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    chatHistory.push({
      role: "assistant",
      content: reply
    });
    playSound("receive");
    addBotMsg(reply);

  } catch (err) {

    console.error(err);

    removeTyping();

    addBotMsg("⚠️ Network Error. Please try again.");

  } finally {

    isBotTyping = false;
    aiSend.disabled = false;
    aiInput.focus();

  }
}

/* ==== Script block 2 ==== */
document.getElementById('formSubmit').addEventListener('click', function (e) {
    e.preventDefault();

    const name = document.getElementById('cName').value.trim();
    const email = document.getElementById('cEmail').value.trim();
    const message = document.getElementById('cMsg').value.trim();

    if (!name || !email || !message) {
      alert('Please fill all fields');
      return;
    }

    const btn = document.getElementById('formSubmit');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Sending...';
    btn.disabled = true;

    const formData = new FormData();
    formData.append('access_key', 'e8eeaece-3eaf-4240-97d4-ed22fdaf0006');
    formData.append('subject', 'New Portfolio Message');
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        btn.innerHTML = 'Message Sent ✓';
        document.getElementById('cName').value = '';
        document.getElementById('cEmail').value = '';
        document.getElementById('cMsg').value = '';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 3000);
      } else {
        btn.innerHTML = 'Failed, Try Again';
        btn.disabled = false;
      }
    })
    .catch((error) => {
      btn.innerHTML = 'Failed, Try Again';
      btn.disabled = false;
      console.error('Web3Forms error:', error);
    });
  });
