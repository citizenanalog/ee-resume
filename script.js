(() => {
  "use strict";

  // ========== STATE ==========
  const state = {
    screen: "boot", // boot | menu | resume | contact | fun | gameover
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
    { key: "3", label: "Fun (vim motions)", action: showFun },
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
Matt  ·  Senior Electronics Test Technician / RF Engineer
Seattle, WA  ·  Quantum hardware test & RF measurement

────────────────────────────────────────────────

SUMMARY
  Experienced electronics test engineer focused on RF/microwave
  systems, precision instrumentation, and quantum computing
  hardware. Leading test procedures and hiring for quantum
  system controllers at IonQ.

EXPERIENCE
  IonQ — Senior Electronics Test / Hiring Lead
  • QCS System Controller: assembly, power, FPGA, PMT, Ethernet
  • RF test procedures, S-parameter (S11) & EOM characterization
  • Production test development with R&S, Keysight, Tektronix
  • Technical interviewing and resume screening for test roles

  RF / Electronics Test
  • VNAs: FieldFox N9917A, R&S ZNH18 / ZN series, PicoVNA
  • Scopes: R&S RTB2004, Tektronix TTR506A+
  • Phase noise, cable torque/loss, ECal / mechanical cal
  • CAN bus (Dow-Key, Arduino), low-noise RF cabling

SKILLS
  RF/Microwave  ·  S-params, VNA cal, phase noise, 6 GHz+
  Test & Embedded  ·  Arduino, RPi, CAN, production scripts
  Instruments  ·  Keysight, Rohde & Schwarz, Tektronix
  Other  ·  Linux, Git, 3D printing (Prusa + PETG-GF), networking

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
    await typeText("  Email:   matt@example.com   ← update this\n\n", 12);
    await typeText("  GitHub:  https://github.com/citizenanalog\n\n", 10);
    println("  Prefer email for professional inquiries.");
    println();
    println("[b] back to menu");
  }

  // ========== FUN / GAME ==========
  // Simple Snake with hjkl controls + classic WASD/arrows as bonus
  function showFun() {
    state.screen = "fun";
    clear();
    promptEl.style.display = "none";
    cursorEl.style.display = "none";

    println("─── FUN  ·  vim snake ────────────────────────");
    println();
    println("  Controls:  h j k l   (or arrows / wasd)");
    println("  Goal:      eat the *  ·  don't hit yourself");
    println("  Quit:      q  or  esc");
    println();
    println("  Press any key to start...");
  }

  // Game implementation
  function startSnake() {
    state.screen = "game";
    clear();

    const W = 28;
    const H = 16;
    let snake = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }];
    let dir = { x: 1, y: 0 };
    let nextDir = { x: 1, y: 0 };
    let food = { x: 15, y: 8 };
    let score = 0;
    let alive = true;
    let tick = null;

    function placeFood() {
      let ok = false;
      while (!ok) {
        food = {
          x: Math.floor(Math.random() * W),
          y: Math.floor(Math.random() * H),
        };
        ok = !snake.some((s) => s.x === food.x && s.y === food.y);
      }
    }

    function draw() {
      let buf = "";
      buf += `  SCORE: ${score}   (h j k l to move · q to quit)\n`;
      buf += "  ┌" + "─".repeat(W) + "┐\n";
      for (let y = 0; y < H; y++) {
        buf += "  │";
        for (let x = 0; x < W; x++) {
          const onSnake = snake.some((s) => s.x === x && s.y === y);
          const head = snake[0].x === x && snake[0].y === y;
          if (head) buf += "@";
          else if (onSnake) buf += "o";
          else if (food.x === x && food.y === y) buf += "*";
          else buf += " ";
        }
        buf += "│\n";
      }
      buf += "  └" + "─".repeat(W) + "┘\n";
      output.innerHTML = "";
      const pre = document.createElement("pre");
      pre.id = "game-canvas";
      pre.textContent = buf;
      output.appendChild(pre);
    }

    function step() {
      if (!alive) return;
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      // wall wrap (toroidal) for friendlier play, or die — let's die on wall for classic
      if (head.x < 0 || head.x >= W || head.y < 0 || head.y >= H) {
        gameOver();
        return;
      }
      if (snake.some((s) => s.x === head.x && s.y === head.y)) {
        gameOver();
        return;
      }

      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        placeFood();
      } else {
        snake.pop();
      }
      draw();
    }

    function gameOver() {
      alive = false;
      clearInterval(tick);
      state.screen = "gameover";
      println();
      println(`  GAME OVER  ·  score ${score}`);
      println("  Press [r] to retry  ·  [b] or [q] for menu");
    }

    // input handler for game
    state.game = {
      onKey(e) {
        const k = e.key.toLowerCase();
        if (k === "q" || k === "escape") {
          clearInterval(tick);
          showMenu();
          return;
        }
        if (state.screen === "gameover") {
          if (k === "r") {
            clearInterval(tick);
            startSnake();
          } else if (k === "b" || k === "q") {
            showMenu();
          }
          return;
        }

        // prevent reverse
        if ((k === "h" || k === "a" || k === "arrowleft") && dir.x !== 1) nextDir = { x: -1, y: 0 };
        else if ((k === "l" || k === "d" || k === "arrowright") && dir.x !== -1) nextDir = { x: 1, y: 0 };
        else if ((k === "k" || k === "w" || k === "arrowup") && dir.y !== 1) nextDir = { x: 0, y: -1 };
        else if ((k === "j" || k === "s" || k === "arrowdown") && dir.y !== -1) nextDir = { x: 0, y: 1 };
      },
    };

    placeFood();
    draw();
    tick = setInterval(step, 140);
  }

  // ========== GLOBAL KEY HANDLER ==========
  document.addEventListener("keydown", (e) => {
    if (state.typing) return;

    const key = e.key.toLowerCase();

    // Global back / quit
    if (key === "b" && (state.screen === "resume" || state.screen === "contact" || state.screen === "fun" || state.screen === "gameover")) {
      e.preventDefault();
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
      // any key starts the game
      e.preventDefault();
      startSnake();
      return;
    }

    if (state.screen === "game" || state.screen === "gameover") {
      if (state.game && state.game.onKey) state.game.onKey(e);
      e.preventDefault();
      return;
    }

    // resume / contact: just allow scroll via page or arrows (native)
  });

  // Start
  boot();
})();
