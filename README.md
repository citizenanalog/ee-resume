# ee-resume

A minimalist TUI-inspired personal resume website.

## Features

- Boot sequence + terminal aesthetic (green-on-black CRT vibe)
- Keyboard-first navigation (j/k, arrows, number keys, enter)
- Three main sections:
  1. **Resume / CV** – clean text rendering of professional experience
  2. **Contact** – name + email
  3. **Fun** – **Photon field**. A canvas particle playground: drag an attractor/repeller with classic **vim motions** (`h j k l`), then fire glowing laser bolts that ricochet off the walls and vaporize particles into spark bursts. Hold `space` too long and the laser overheats. No score, no goal — just light.
- Smooth typewriter transitions and subtle CRT scanlines

## Local development

Just open `index.html` in a browser, or serve it:

```bash
npx serve .
# or
python -m http.server 8000
```

## Deploy (GitHub Pages)

1. Go to the repository **Settings → Pages**
2. Source: Deploy from a branch → `main` / root
3. Save. Site will be live at `https://citizenanalog.github.io/ee-resume/` (or your custom domain)

Because the repo is currently private, you may need to make it public or use GitHub Pro for private Pages.

## Customization

- Edit `Resume.md` for the source-of-truth resume content
- Update the hardcoded resume text inside `script.js` → `showResume()` (or implement a simple MD fetch if you prefer)
- Change contact email in the Contact screen
- Tweak colors in `style.css` (`--fg`, `--accent`, etc.)

## Controls cheat-sheet

| Key          | Action                              |
|--------------|-------------------------------------|
| `j` / `↓`    | Next menu item                      |
| `k` / `↑`    | Previous menu item                  |
| `1` `2` `3`  | Jump to section                     |
| `Enter`      | Select                              |
| `b`          | Back to menu                        |
| `q` / `Esc`  | Quit / exit visual                  |
| `h j k l`    | Move the diode (photon field)       |
| `space`      | Fire laser (hold for auto-fire)     |
| `f`          | Toggle attract ↔ repel              |
| `r`          | Reset field + center diode          |

---

Built for the terminal-loving engineer.
