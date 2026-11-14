# 🚀 THE UNFINISHED MISSION
### NASA Space Apps Challenge 2026 · Challenge: *"Abandoned but not Forgotten"*

> **"Every machine we left behind was a promise: we will never stop reaching for the stars."**

An interactive, cinematic, scroll-driven educational experience for students aged 8–14. *The Unfinished Mission* tells the emotional, scientific, and engineering stories of NASA hardware left on celestial bodies—exploring what these machines did, how they worked, and what they revealed about our universe.

---

## 🌌 The Cinematic Experience

Inspired by the visual direction of *Interstellar*—restrained, quiet, majestic, with generous negative space, warm amber and cool blue lighting, and slow easings:

1. **Prologue (Cinematic Intro):**
   - Deep space black, solitary star fade-in, and letter-spaced philosophical reveal.
   - Strict sequential countdown (`3`, `2`, `1`, `LIFTOFF`) with zero element overlap.
   - Procedural Web Audio API sub-bass drone and tension swell (zero external audio dependencies).
   - Slender launch vehicle ascending into space with smooth cross-dissolve.

2. **Scene 1: The Moon (Apollo 15 Lunar Roving Vehicle — LRV-001):**
   - Pinned 3D descent from space onto the grey cratered horizon of Hadley-Apennine.
   - Earth glowing blue in the black lunar sky.
   - Tiny child astronaut standing small against the vast landscape.
   - LRV-001 in warm low-angle side light with floating regolith dust particles.
   - Line-by-line typewriter narrative detailing the 27.9 km traverse and the 4-billion-year-old Genesis Rock.

3. **Scene 2: Mars (Opportunity Rover — MER-B):**
   - 3D red-ochre bedrock of Perseverance Valley on Endeavour Crater's rim.
   - Dynamic sky shift from warm butterscotch orange to dusky dark red as atmospheric optical depth ($\tau > 10.8$) thickens.
   - Multi-layer swirling dust storm particle system.
   - Opportunity's solar panel glow slowly dims to 0% as she enters her final rest (*"My battery is low and it's getting dark"*).

4. **Scene 3: Deep Space (Voyager 1 & The Pale Blue Dot Finale):**
   - Multi-layered starfield with gentle depth parallax (no fast warp).
   - 3D Voyager 1 probe drifting into the infinite interstellar void.
   - **The Pale Blue Dot Moment:** Near-pitch black space with a solitary sunbeam illuminating Earth across 6 billion kilometers.
   - Carl Sagan's closing reflection: *"Look again at that dot. That's here. That's home. That's us."*

---

## 🔬 Interactive Educational Teaching Models

Each mission features a simplified, hands-on scientific simulation based on authentic NASA data:

- **Lunar Rover Simulator (Apollo 15):** Teaches dead-reckoning navigation, directional gyroscopes, and the critical **5.0 km Walk-Back Safety Limit** (NASA TN D-7469).
- **Mars Evidence Lab (Opportunity):** Geochemical mineral investigation tool (hematite "blueberries", jarosite, gypsum veins, and neutral-water smectite clays).
- **Interstellar Ping (Voyager 1):** Real-time simulation of speed-of-light radio latency ($299,792\text{ km/s}$) and inverse-square signal attenuation across 25.9 billion kilometers (1 light-day).

---

## 🛠️ Technology Stack

- **Framework:** React 19 + Vite 8
- **3D Graphics:** Three.js + `@react-three/fiber` + `@react-three/drei`
- **Animation & Pinned Scroll:** GSAP 3 (ScrollTrigger, SplitText, DrawSVG)
- **Smooth Scroll:** Lenis 1.3 (respects `prefers-reduced-motion`)
- **Audio:** Web Audio API (procedural synthesis, no external assets needed)
- **Styling:** Vanilla Modular CSS & Design Tokens (WCAG 2.1 AA/AAA accessible on `#0B0D11`)
- **Typography:** *Newsreader* (Editorial Serif) & *Space Grotesk* (Technical Monospace)

---

## 💻 Teammate Setup & Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20.19+ recommended)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/Ae8y2la/Abandoned-not-forgotten.git
cd Abandoned-not-forgotten
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🔒 Security & Contribution Rules

- **Branching Workflow:** Please create individual feature branches (`feature/your-name`) instead of committing directly to `master`.
- **Zero Secrets:** Never commit `.env` files, API keys, or private tokens. All environment files are strictly ignored by `.gitignore`.
- **Authentic Assets Only:** All imagery must come exclusively from verified NASA public domain archives (`images.nasa.gov`).

---

## 📜 Verified Data Provenance & Disclaimers

All mission coordinates, timelines, and engineering parameters are verified against primary NASA documentation:
- **Apollo 15:** NASA Technical Note TN D-7469; Apollo 15 Flight Evaluation Report MSC-05161. LROC Station 9A Coordinates: `26.13174°N, 3.63803°E`.
- **Opportunity (MER-B):** NASA JPL MER Pancam Tau Datasets; Athena APXS/Mössbauer mineralogy reports. HiRISE Frame `ESP_056955_1775`.
- **Voyager 1:** NASA JPL Deep Space Network (DSN) Telecommunications; Voyager Interstellar Mission (VIM). Distance: `~173.1 AU / 25.902 Billion km`.

*This project is created for the NASA Space Apps Challenge 2026. NASA does not endorse or sponsor this project.*
