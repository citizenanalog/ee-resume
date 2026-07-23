(() => {
  "use strict";

  // ========== STATE ==========
  const state = {
    screen: "boot", // boot | menu | resume | contact | fun | visual
    menuIndex: 0,
    typing: false,
    resumeContent: "",
    game: null,
  };

  const output = document.getElementById("output");
  const promptEl = document.getElementById("prompt");
  const cursorEl = document.getElementById("cursor");

  // ========== UTILS ==========
  function clear() {
    output.innerHTML = "";
  }

  function print(text, cls = "") {
    const span = document.createElement("span");
    if (cls) span.className = cls;
    span.textContent = text;
    output.appendChild(span);
  }

  function println(text = "", cls = "") {
    print(text + "\n", cls);
    output.scrollTop = output.scrollHeight;
  }

  function typeText(text, speed = 12, cls = "") {
    return new Promise((resolve) => {
      state.typing = true;
      let i = 0;
      const span = document.createElement("span");
      if (cls) span.className = cls;
      output.appendChild(span);

      function tick() {
        if (i < text.length) {
          span.textContent += text[i];
          i++;
          output.scrollTop = output.scrollHeight;
          setTimeout(tick, speed + Math.random() * 8);
        } else {
          state.typing = false;
          resolve();
        }
      }
      tick();
    });
  }

  async function typeLines(lines, speed = 10) {
    for (const line of lines) {
      await typeText(line + "\n", speed);
    }
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  // ========== BOOT SEQUENCE ==========
  async function boot() {
    clear();
    promptEl.style.display = "none";
    cursorEl.style.display = "none";

    const bootLines = [
      "ee-resume TUI v0.1.0",
      "Copyright (c) 2026 citizenanalog",
      "",
      "Initializing terminal...",
      "Loading kernel modules: [ok]",
      "Mounting /resume ........ [ok]",
      "Starting services ....... [ok]",
      "",
      "Welcome.",
      "",
    ];

    for (const line of bootLines) {
      await typeText(line + "\n", 8);
      await sleep(40);
    }

    await sleep(300);
    showMenu();
  }

  // ========== MENU ==========
  const menuItems = [
    { key: "1", label: "View Resume / CV", action: showResume },
    { key: "2", label: "Contact", action: showContact },
    { key: "3", label: "Fun (particle field)", action: showFun },
  ];

  function showMenu() {
    state.screen = "menu";
    state.menuIndex = 0;
    promptEl.style.display = "none";
    cursorEl.style.display = "none";
    drawMenu();
  }

  function drawMenu() {
    clear();
    println("┌────────────────────────────────────────────┐");
    println("│          ee-resume  •  main menu           │");
    println("└────────────────────────────────────────────┘");
    println();
    println("  Select an option (↑↓ / j k  or  1 2 3):");
    println();

    menuItems.forEach((item, i) => {
      const selected = i === state.menuIndex;
      const prefix = selected ? "▶ " : "  ";
      const line = `${prefix}${item.key}. ${item.label}`;
      const span = document.createElement("div");
      span.className = "menu-item" + (selected ? " selected" : "");
      span.textContent = line;
      span.onclick = () => {
        state.menuIndex = i;
        item.action();
      };
      output.appendChild(span);
    });

    println();
    println("  [enter] select   [q] quit");
    println();
  }

  // ========== RESUME ==========
  async function showResume() {
    state.screen = "resume";
    clear();
    promptEl.style.display = "none";
    cursorEl.style.display = "none";

    println("─── RESUME ───────────────────────────────────");
    println();

    // Load Resume.md content (we'll embed a simplified version or fetch if served)
    // For static GitHub Pages we hardcode a rendered version or use fetch if same origin.
    // Here we use a clean text rendering of the MD.

    const resumeText = `
Matt  ·  Electronics Test & System Integration
Seattle, WA  ·  Quantum systems test, deployment & commissioning

────────────────────────────────────────────────

SUMMARY
  Electronics test engineer on the Test and System Integration
  team at IonQ. Responsible for manufacturing test development
  for electronic controls hardware in quantum systems, plus
  deployment and commissioning of those systems. Also supports
  technical interviews. Strong RF/microwave and production
  test background.

EXPERIENCE
  IonQ — Test & System Integration
  • Manufacturing test development for electronic controls
    hardware used in quantum systems
  • Deployment and commissioning of quantum systems
  • RF/electronics validation (S-params, power, FPGA, PMT,
    Ethernet interfaces)
  • Production test procedures & troubleshooting (R&S,
    Keysight, Tektronix)
  • Technical interview participation and candidate evaluation

  Technical focus
  • QCS System Controller and related controls hardware
  • S-parameter measurements, EOM characterization, calibration
  • Low-noise RF practices, cable/connector care, CAN bus

SKILLS
  RF/Microwave     ·  S-params, VNA cal, phase noise, 6 GHz+
  Test & Integration ·  Manufacturing test, system bring-up
  Instruments      ·  Keysight, R&S, Tektronix, FieldFox
  Other            ·  Linux, Git, Arduino/RPi, 3D printing

INTERESTS
  Precision measurement, quantum hardware, DIY embedded,
  kayaking, hiking, 3D printing, cooking, genealogy.

────────────────────────────────────────────────
[b] back to menu   [↑↓] scroll
`.trim();

    // Type it out a bit faster for readability
    await typeText(resumeText + "\n\n", 4);
  }

  // ========== CONTACT ==========
  async function showContact() {
    state.screen = "contact";
    clear();
    promptEl.style.display = "none";
    cursorEl.style.display = "none";

    println("─── CONTACT ──────────────────────────────────");
    println();
    await typeText("  Name:    Matt\n", 12);
    await typeText("  Handle:  citizenanalog / m_sha256\n", 10);
    await typeText("  Email:   matthew.t.sharpe@gmail.com\n\n", 12);
    await typeText("  GitHub:  https://github.com/citizenanalog\n\n", 10);
    println("  Prefer email for professional inquiries.");
    println();
    println("[b] back to menu");
  }

  // ========== FUN / VISUAL ==========
  // Pure visual particle field controlled by vim motions
  function showFun() {
    state.screen = "fun";
    clear();
    promptEl.style.display = "none";
    cursorEl.style.display = "none";

    println("─── FUN  ·  particle field ───────────────────");
    println();
    println("  A pure visual playground.");
    println("  Move the attractor with vim motions.");
    println();
    println("  h j k l   (or arrows)  →  move the focus");
    println("  space                 →  toggle attract / repel");
    println("  r                     →  reset particles");
    println("  q / esc / b           →  back to menu");
    println();
    println("  Press any key to begin...");
  }

  function startField() {
    state.screen = "visual";
    clear();

    const W = 42;
    const H = 18;
    const NUM = 55;

    // Attractor
    let ax = W / 2;
    let ay = H / 2;
    let avx = 0;
    let avy = 0;
    const A_ACCEL = 0.55;
    const A_FRICTION = 0.82;
    const A_MAX_SPEED = 1.8;

    // Force mode: +1 attract, -1 repel
    let forceSign = 1;

    // Particles
    const particles = [];
    const glyphs = ["·", ".", ":", "*", "o", "O", "+", "×"];

    function spawnParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        life: 40 + Math.random() * 80,
        g: glyphs[Math.floor(Math.random() * glyphs.length)],
      };
    }

    for (let i = 0; i < NUM; i++) particles.push(spawnParticle());

    // Key state for continuous movement
    const keys = { h: false, j: false, k: false, l: false };

    let tick = null;

    function draw() {
      // Build empty grid
      const grid = Array.from({ length: H }, () => Array(W).fill(" "));

      // Place particles (last one wins if overlap)
      for (const p of particles) {
        const px = Math.floor(p.x);
        const py = Math.floor(p.y);
        if (px >= 0 && px < W && py >= 0 && py < H) {
          // Choose glyph by speed for a bit of life
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          let ch = p.g;
          if (speed > 1.4) ch = "@";
          else if (speed > 0.9) ch = "O";
          else if (speed > 0.5) ch = "o";
          else if (speed > 0.25) ch = "*";
          grid[py][px] = ch;
        }
      }

      // Place attractor (always on top)
      const tax = Math.floor(ax);
      const tay = Math.floor(ay);
      if (tax >= 0 && tax < W && tay >= 0 && tay < H) {
        grid[tay][tax] = forceSign > 0 ? "◉" : "◎";
      }

      // Render
      let buf = "";
      const mode = forceSign > 0 ? "ATTRACT" : "REPEL ";
      buf += `  ${mode}   hjkl move focus · space flip · r reset · q quit\n`;
      buf += "  ┌" + "─".repeat(W) + "┐\n";
      for (let y = 0; y < H; y++) {
        buf += "  │" + grid[y].join("") + "│\n";
      }
      buf += "  └" + "─".repeat(W) + "┘\n";

      output.innerHTML = "";
      const pre = document.createElement("pre");
      pre.id = "game-canvas";
      pre.textContent = buf;
      output.appendChild(pre);
    }

    function step() {
      // Move attractor from held keys
      if (keys.h) avx -= A_ACCEL;
      if (keys.l) avx += A_ACCEL;
      if (keys.k) avy -= A_ACCEL;
      if (keys.j) avy += A_ACCEL;

      avx *= A_FRICTION;
      avy *= A_FRICTION;

      // Clamp speed
      const spd = Math.sqrt(avx * avx + avy * avy);
      if (spd > A_MAX_SPEED) {
        avx = (avx / spd) * A_MAX_SPEED;
        avy = (avy / spd) * A_MAX_SPEED;
      }

      ax += avx;
      ay += avy;

      // Soft bounds (bounce attractor)
      if (ax < 1) { ax = 1; avx = Math.abs(avx) * 0.6; }
      if (ax > W - 2) { ax = W - 2; avx = -Math.abs(avx) * 0.6; }
      if (ay < 1) { ay = 1; avy = Math.abs(avy) * 0.6; }
      if (ay > H - 2) { ay = H - 2; avy = -Math.abs(avy) * 0.6; }

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dx = ax - p.x;
        const dy = ay - p.y;
        const dist2 = dx * dx + dy * dy + 0.4; // avoid div0
        const dist = Math.sqrt(dist2);

        // Force strength (stronger when closer)
        const strength = forceSign * (2.8 / dist2);

        p.vx += (dx / dist) * strength;
        p.vy += (dy / dist) * strength;

        // Mild damping + slight tangential swirl for nicer orbits
        p.vx *= 0.965;
        p.vy *= 0.965;
        p.vx += -dy * 0.012 * forceSign; // swirl
        p.vy +=  dx * 0.012 * forceSign;

        p.x += p.vx;
        p.y += p.vy;

        // Toroidal wrap
        if (p.x < 0) p.x += W;
        if (p.x >= W) p.x -= W;
        if (p.y < 0) p.y += H;
        if (p.y >= H) p.y -= H;

        p.life--;
        if (p.life <= 0 || Math.abs(p.vx) + Math.abs(p.vy) < 0.02) {
          particles[i] = spawnParticle();
        }
      }

      draw();
    }

    // Input
    state.game = {
      onKey(e) {
        const k = e.key.toLowerCase();

        if (k === "q" || k === "escape" || k === "b") {
          clearInterval(tick);
          showMenu();
          return;
        }

        if (k === " " || k === "spacebar") {
          e.preventDefault();
          forceSign *= -1;
          return;
        }

        if (k === "r") {
          for (let i = 0; i < particles.length; i++) {
            particles[i] = spawnParticle();
          }
          ax = W / 2;
          ay = H / 2;
          avx = avy = 0;
          return;
        }

        // Direction keys (also support wasd / arrows)
        if (k === "h" || k === "a" || k === "arrowleft") keys.h = true;
        if (k === "l" || k === "d" || k === "arrowright") keys.l = true;
        if (k === "k" || k === "w" || k === "arrowup") keys.k = true;
        if (k === "j" || k === "s" || k === "arrowdown") keys.j = true;
      },
      onKeyUp(e) {
        const k = e.key.toLowerCase();
        if (k === "h" || k === "a" || k === "arrowleft") keys.h = false;
        if (k === "l" || k === "d" || k === "arrowright") keys.l = false;
        if (k === "k" || k === "w" || k === "arrowup") keys.k = false;
        if (k === "j" || k === "s" || k === "arrowdown") keys.j = false;
      },
    };

    // Also listen for keyup
    const keyupHandler = (e) => {
      if (state.screen === "visual" && state.game && state.game.onKeyUp) {
        state.game.onKeyUp(e);
      }
    };
    document.addEventListener("keyup", keyupHandler);

    // Store cleanup so we can remove the listener later if needed
    state.game.cleanup = () => {
      document.removeEventListener("keyup", keyupHandler);
      clearInterval(tick);
    };

    draw();
    tick = setInterval(step, 50); // ~20 fps, smooth enough
  }

  // ========== GLOBAL KEY HANDLER ==========
  document.addEventListener("keydown", (e) => {
    if (state.typing) return;

    const key = e.key.toLowerCase();

    // Global back / quit
    if (key === "b" && (state.screen === "resume" || state.screen === "contact" || state.screen === "fun" || state.screen === "visual")) {
      e.preventDefault();
      if (state.game && state.game.cleanup) state.game.cleanup();
      showMenu();
      return;
    }

    if (state.screen === "menu") {
      if (key === "j" || key === "arrowdown") {
        e.preventDefault();
        state.menuIndex = (state.menuIndex + 1) % menuItems.length;
        drawMenu();
      } else if (key === "k" || key === "arrowup") {
        e.preventDefault();
        state.menuIndex = (state.menuIndex - 1 + menuItems.length) % menuItems.length;
        drawMenu();
      } else if (key === "enter" || key === " ") {
        e.preventDefault();
        menuItems[state.menuIndex].action();
      } else if (key === "1") menuItems[0].action();
      else if (key === "2") menuItems[1].action();
      else if (key === "3") menuItems[2].action();
      else if (key === "q") {
        clear();
        println("Connection closed.");
        println("Thanks for visiting.");
        state.screen = "exit";
      }
      return;
    }

    if (state.screen === "fun") {
      // any key starts the visual
      e.preventDefault();
      startField();
      return;
    }

    if (state.screen === "visual") {
      if (state.game && state.game.onKey) state.game.onKey(e);
      e.preventDefault();
      return;
    }

    // resume / contact: just allow scroll via page or arrows (native)
  });

  // Start
  boot();
})();
