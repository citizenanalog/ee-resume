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
    { key: "3", label: "Fun (photon field)", action: showFun },
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
  // Photon field: attract/repel particle physics + laser bolts, rendered on canvas
  function showFun() {
    state.screen = "fun";
    clear();
    promptEl.style.display = "none";
    cursorEl.style.display = "none";

    println("─── FUN  ·  photon field ─────────────────────");
    println();
    println("  A pure visual playground. Now with lasers.");
    println("  Drag the field with vim motions. Shoot it apart.");
    println();
    println("  h j k l   (or arrows)  →  move the diode");
    println("  space                 →  fire laser (hold for auto)");
    println("  f                     →  toggle attract / repel");
    println("  r                     →  reset field");
    println("  q / esc / b           →  back to menu");
    println();
    println("  Press any key to begin...");
  }

  function startField() {
    state.screen = "visual";
    clear();

    const canvas = document.createElement("canvas");
    canvas.id = "game-canvas";
    output.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    // ----- state (declared before resize() references them) -----
    let W = 0;
    let H = 0;

    // Diode (attractor / laser emitter)
    let ax = 0;
    let ay = 0;
    let avx = 0;
    let avy = 0;
    let angle = 0; // facing = last movement direction

    const A_ACCEL = 900;      // px/s^2
    const A_FRICTION = 6;     // exponential decay per second
    const A_MAX_SPEED = 420;  // px/s
    const DIODE_MARGIN = 14;  // soft bounds for the diode

    // Force mode: +1 attract, -1 repel
    let forceSign = 1;

    // Particles
    const NUM = 70;
    const particles = [];

    // Laser bolts
    const bolts = [];
    const BOLT_SPEED = 950;     // px/s
    const BOLT_BOUNCES = 4;
    const BOLT_FADE = 0.15;     // seconds to fade out after last bounce
    const MAX_BOLTS = 20;

    // Sparks (vaporization debris)
    const sparks = [];
    const MAX_SPARKS = 300;

    // Laser heat
    let heat = 0;
    let overheated = false;
    let fireCooldown = 0;
    let firing = false;
    const FIRE_COOLDOWN = 0.11; // seconds between shots while held
    const HEAT_PER_SHOT = 14;
    const HEAT_DECAY = 34;      // per second
    const HEAT_MAX = 100;
    const HEAT_UNLOCK = 35;

    // Key state for continuous movement
    const keys = { h: false, j: false, k: false, l: false };

    let rafId = null;
    let last = 0;
    let flashT = 0; // overheat flash timer

    // ----- canvas sizing (DPR-aware, world coords = CSS px) -----
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      W = output.clientWidth;
      H = output.clientHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // keep the diode inside the new bounds
      ax = Math.min(Math.max(ax, DIODE_MARGIN), W - DIODE_MARGIN);
      ay = Math.min(Math.max(ay, DIODE_MARGIN), H - DIODE_MARGIN);
    }

    // ----- glow sprites (pre-rendered radial gradients) -----
    function makeGlow(rgb) {
      const s = 64;
      const c = document.createElement("canvas");
      c.width = s;
      c.height = s;
      const g = c.getContext("2d");
      const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      grad.addColorStop(0, `rgba(${rgb},1)`);
      grad.addColorStop(0.35, `rgba(${rgb},0.45)`);
      grad.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = grad;
      g.fillRect(0, 0, s, s);
      return c;
    }

    const glowGreen = makeGlow("51,255,102");
    const glowCyan = makeGlow("0,229,255");
    const glowRed = makeGlow("255,60,60");
    const glowWhite = makeGlow("255,240,220");
    const glowOrange = makeGlow("255,150,40");

    // ----- spawning / reset -----
    function spawnParticle() {
      const a = Math.random() * Math.PI * 2;
      const sp = 30 + Math.random() * 50;
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        r: 1.5 + Math.random(),
        life: 4 + Math.random() * 8,
      };
    }

    function resetField() {
      particles.length = 0;
      for (let i = 0; i < NUM; i++) particles.push(spawnParticle());
      bolts.length = 0;
      sparks.length = 0;
      heat = 0;
      overheated = false;
      fireCooldown = 0;
      firing = false;
      ax = W / 2;
      ay = H / 2;
      avx = avy = 0;
      angle = 0;
    }

    // ----- laser -----
    function fire() {
      if (overheated) return;
      const mx = ax + Math.cos(angle) * 12;
      const my = ay + Math.sin(angle) * 12;
      bolts.push({
        x: mx,
        y: my,
        px: mx,
        py: my,
        vx: Math.cos(angle) * BOLT_SPEED,
        vy: Math.sin(angle) * BOLT_SPEED,
        bounces: BOLT_BOUNCES,
        fade: 1, // 1 = alive, < 1 = fading out
      });
      if (bolts.length > MAX_BOLTS) bolts.shift();

      // muzzle flash
      for (let k = 0; k < 3; k++) {
        const a = angle + (Math.random() - 0.5) * 0.8;
        const sp = 80 + Math.random() * 120;
        const life = 0.15 + Math.random() * 0.15;
        sparks.push({ x: mx, y: my, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life, maxLife: life });
      }

      heat = Math.min(HEAT_MAX, heat + HEAT_PER_SHOT);
      if (heat >= HEAT_MAX) overheated = true;
    }

    // Segment-vs-circle test: at 950 px/s a bolt moves ~16px/frame,
    // so point tests would tunnel straight through particles.
    function segCircle(x1, y1, x2, y2, cx, cy, r) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len2 = dx * dx + dy * dy;
      if (len2 === 0) {
        const ddx = cx - x1;
        const ddy = cy - y1;
        return ddx * ddx + ddy * ddy <= r * r;
      }
      let t = ((cx - x1) * dx + (cy - y1) * dy) / len2;
      t = Math.max(0, Math.min(1, t));
      const ddx = cx - (x1 + t * dx);
      const ddy = cy - (y1 + t * dy);
      return ddx * ddx + ddy * ddy <= r * r;
    }

    function vaporize(idx) {
      const p = particles[idx];
      particles.splice(idx, 1);
      const n = 10 + Math.floor(Math.random() * 5);
      for (let k = 0; k < n; k++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 60 + Math.random() * 200;
        const life = 0.3 + Math.random() * 0.4;
        sparks.push({ x: p.x, y: p.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life, maxLife: life });
      }
      while (sparks.length > MAX_SPARKS) sparks.shift();
      particles.push(spawnParticle()); // keep field density
    }

    // ----- physics updates (dt in seconds) -----
    function updateHeat(dt) {
      heat = Math.max(0, heat - HEAT_DECAY * dt);
      if (overheated && heat <= HEAT_UNLOCK) overheated = false;
      if (fireCooldown > 0) fireCooldown -= dt;
      if (firing && !overheated && fireCooldown <= 0) {
        fire();
        fireCooldown = FIRE_COOLDOWN;
      }
    }

    function updateDiode(dt) {
      if (keys.h) avx -= A_ACCEL * dt;
      if (keys.l) avx += A_ACCEL * dt;
      if (keys.k) avy -= A_ACCEL * dt;
      if (keys.j) avy += A_ACCEL * dt;

      const f = Math.exp(-A_FRICTION * dt);
      avx *= f;
      avy *= f;

      const spd = Math.hypot(avx, avy);
      if (spd > A_MAX_SPEED) {
        avx = (avx / spd) * A_MAX_SPEED;
        avy = (avy / spd) * A_MAX_SPEED;
      }

      ax += avx * dt;
      ay += avy * dt;

      // Soft bounds (bounce diode)
      if (ax < DIODE_MARGIN) { ax = DIODE_MARGIN; avx = Math.abs(avx) * 0.6; }
      if (ax > W - DIODE_MARGIN) { ax = W - DIODE_MARGIN; avx = -Math.abs(avx) * 0.6; }
      if (ay < DIODE_MARGIN) { ay = DIODE_MARGIN; avy = Math.abs(avy) * 0.6; }
      if (ay > H - DIODE_MARGIN) { ay = H - DIODE_MARGIN; avy = -Math.abs(avy) * 0.6; }

      if (spd > 20) angle = Math.atan2(avy, avx);
    }

    function updateParticles(dt) {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dx = ax - p.x;
        const dy = ay - p.y;
        const dist2 = dx * dx + dy * dy + 400; // softened close-range
        const dist = Math.sqrt(dist2);

        // Radial pull/push + tangential swirl
        const radial = forceSign * Math.min(1200, 60000 / dist2);
        const swirl = forceSign * Math.min(200, 0.5 * dist);

        p.vx += ((dx / dist) * radial + (-dy / dist) * swirl) * dt;
        p.vy += ((dy / dist) * radial + (dx / dist) * swirl) * dt;

        const damp = Math.exp(-0.8 * dt);
        p.vx *= damp;
        p.vy *= damp;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Toroidal wrap
        if (p.x < 0) p.x += W;
        if (p.x >= W) p.x -= W;
        if (p.y < 0) p.y += H;
        if (p.y >= H) p.y -= H;

        p.life -= dt;
        if (p.life <= 0 || Math.hypot(p.vx, p.vy) < 2) {
          particles[i] = spawnParticle();
        }
      }
    }

    function updateBolts(dt) {
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i];
        b.px = b.x;
        b.py = b.y;
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        if (b.fade < 1) {
          b.fade -= dt / BOLT_FADE;
          if (b.fade <= 0) bolts.splice(i, 1);
          continue;
        }

        // Wall bounce
        let bounced = false;
        if (b.x < 0) { b.x = -b.x; b.vx = Math.abs(b.vx); bounced = true; }
        else if (b.x > W) { b.x = 2 * W - b.x; b.vx = -Math.abs(b.vx); bounced = true; }
        if (b.y < 0) { b.y = -b.y; b.vy = Math.abs(b.vy); bounced = true; }
        else if (b.y > H) { b.y = 2 * H - b.y; b.vy = -Math.abs(b.vy); bounced = true; }
        if (bounced) {
          b.bounces--;
          if (b.bounces <= 0) b.fade = 0.999; // start fading, keep moving
        }

        // Vaporize particles along the bolt's swept segment
        for (let j = particles.length - 1; j >= 0; j--) {
          const p = particles[j];
          if (segCircle(b.px, b.py, b.x, b.y, p.x, p.y, p.r + 1.5)) {
            vaporize(j);
          }
        }
      }
    }

    function updateSparks(dt) {
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= dt;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const damp = Math.exp(-2.5 * dt);
        s.vx *= damp;
        s.vy *= damp;
      }
    }

    // ----- rendering -----
    function draw(dt) {
      // Motion trails instead of a hard clear
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(5,5,5,0.22)";
      ctx.fillRect(0, 0, W, H);

      // Additive blending for everything glowing
      ctx.globalCompositeOperation = "lighter";

      // Particles: green phosphor, brighter/bigger when fast
      for (const p of particles) {
        const speed = Math.hypot(p.vx, p.vy);
        const glowR = 6 + Math.min(10, speed * 0.05);
        ctx.globalAlpha = 0.5 + Math.min(0.5, speed * 0.004);
        ctx.drawImage(glowGreen, p.x - glowR, p.y - glowR, glowR * 2, glowR * 2);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#baffd0";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sparks: white-hot fading to orange
      for (const s of sparks) {
        const t = s.life / s.maxLife;
        const glowR = 5 + 6 * t;
        ctx.globalAlpha = t;
        ctx.drawImage(t > 0.5 ? glowWhite : glowOrange, s.x - glowR, s.y - glowR, glowR * 2, glowR * 2);
      }
      ctx.globalAlpha = 1;

      // Bolts: wide translucent red + bright core, with bloom
      for (const b of bolts) {
        const alpha = Math.max(0, Math.min(1, b.fade));
        ctx.save();
        ctx.shadowColor = "rgba(255,60,60,0.9)";
        ctx.shadowBlur = 12;
        ctx.strokeStyle = `rgba(255,40,40,${0.35 * alpha})`;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(b.px, b.py);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.strokeStyle = `rgba(255,120,120,${0.95 * alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // Diode: glow + emitter line + hot core
      const diodeGlow = forceSign > 0 ? glowGreen : glowCyan;
      ctx.globalAlpha = 0.9;
      ctx.drawImage(diodeGlow, ax - 16, ay - 16, 32, 32);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = forceSign > 0 ? "#aaffcc" : "#aaffee";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax + Math.cos(angle) * 12, ay + Math.sin(angle) * 12);
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(ax, ay, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Overheat: red flash around the diode
      if (overheated) {
        flashT += dt;
        if (Math.floor(flashT * 8) % 2 === 0) {
          ctx.globalAlpha = 0.8;
          ctx.drawImage(glowRed, ax - 18, ay - 18, 36, 36);
          ctx.globalAlpha = 1;
        }
      }

      drawHud();
    }

    function drawHud() {
      ctx.font = "13px 'IBM Plex Mono', monospace";
      ctx.textBaseline = "top";

      // Mode indicator
      ctx.fillStyle = forceSign > 0 ? "#33ff66" : "#00e5ff";
      ctx.fillText(forceSign > 0 ? "ATTRACT" : "REPEL", 12, 10);

      // Heat bar
      const bw = 140;
      const bh = 8;
      const bx = W - bw - 12;
      const by = 12;
      ctx.strokeStyle = "rgba(255,80,80,0.5)";
      ctx.lineWidth = 1;
      ctx.strokeRect(bx + 0.5, by + 0.5, bw, bh);
      const frac = heat / HEAT_MAX;
      const flash = overheated && Math.floor(performance.now() / 120) % 2 === 0;
      ctx.fillStyle = flash ? "#ff8888" : "#ff3c3c";
      ctx.fillRect(bx + 1, by + 1, Math.max(0, (bw - 2) * frac), bh - 2);
      ctx.fillStyle = "rgba(255,120,120,0.8)";
      ctx.fillText(overheated ? "LASER OVERHEAT" : "LASER", bx, by + bh + 4);

      // Controls hint
      ctx.fillStyle = "rgba(51,255,102,0.4)";
      ctx.fillText("hjkl move · space fire · f flip field · r reset · q quit", 12, H - 22);
    }

    // ----- main loop -----
    function frame(now) {
      const dt = Math.min((now - last) / 1000, 0.05); // clamp: no tunneling after tab-switch
      last = now;

      updateHeat(dt);
      updateDiode(dt);
      updateParticles(dt);
      updateBolts(dt);
      updateSparks(dt);
      draw(dt);

      rafId = requestAnimationFrame(frame);
    }

    // ----- input -----
    state.game = {
      onKey(e) {
        const k = e.key.toLowerCase();

        if (k === "q" || k === "escape" || k === "b") {
          cleanup();
          showMenu();
          return;
        }

        if (k === " " || k === "spacebar") {
          e.preventDefault();
          firing = true;
          return;
        }

        if (k === "f") {
          forceSign *= -1;
          return;
        }

        if (k === "r") {
          resetField();
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
        if (k === " " || k === "spacebar") firing = false;
        if (k === "h" || k === "a" || k === "arrowleft") keys.h = false;
        if (k === "l" || k === "d" || k === "arrowright") keys.l = false;
        if (k === "k" || k === "w" || k === "arrowup") keys.k = false;
        if (k === "j" || k === "s" || k === "arrowdown") keys.j = false;
      },
    };

    const keyupHandler = (e) => {
      if (state.screen === "visual" && state.game && state.game.onKeyUp) {
        state.game.onKeyUp(e);
      }
    };
    const resizeHandler = () => resize();
    document.addEventListener("keyup", keyupHandler);
    window.addEventListener("resize", resizeHandler);

    function cleanup() {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
      firing = false;
      document.removeEventListener("keyup", keyupHandler);
      window.removeEventListener("resize", resizeHandler);
    }

    state.game.cleanup = cleanup;

    // ----- init -----
    resize();
    resetField();
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, W, H);
    last = performance.now();
    rafId = requestAnimationFrame(frame);
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
