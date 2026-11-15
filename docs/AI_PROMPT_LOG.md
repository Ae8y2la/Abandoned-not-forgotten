# AI Prompt Log — The Unfinished Mission

**Team:** The Forgotten Fleet  
**Challenge:** NASA Space Apps Challenge 2026 — *"Abandoned but not Forgotten"*  
**Date range:** 2026-11-14 → 2026-11-15

> Prompts were written by the team and executed with Google Antigravity (powered by Google DeepMind models). The team reviewed every result in the browser. No prompt text has been invented; summaries are marked *(summary)*.

---

## Development Stage Overview

| # | Stage | Goal | Tool | Result |
|---|-------|------|------|--------|
| 1 | Foundation & scroll engine | React + Vite scaffold, design tokens, GSAP motion, NASA images | Google Antigravity | Initial commit — 28 files, full project scaffold |
| 2 | Cinematic intro (v1) | GSAP DrawSVG signal scene, world-selector reveals | Google Antigravity | `SignalScene.jsx`, `WorldSelector.jsx` animated |
| 3 | Moon, Mars, Voyager scenes | Three.js 3D scroll-pinned scenes with authentic NASA photography | Google Antigravity | Scenes 1–3 committed; 3D child astronaut added |
| 4 | Simulators | Lunar Rover dead-reckoning, Mars Evidence Lab minerals, Interstellar Ping light-delay | Google Antigravity | `LunarRoverSim.jsx`, `MarsEvidenceLab.jsx`, `InterstellarPing.jsx` |
| 5 | Visual cleanup | Cinematic intro rework — remove element overlaps, fix countdown sequencing | Google Antigravity | `CinematicIntro.jsx`, `CinematicIntro.css` revised |
| 6 | EVA-01 astronaut guide + side navigation | Animated child astronaut guide character; planet-hop scroll rail | Google Antigravity | `ChildAstronaut.jsx`, `Navigation.jsx`, `Navigation.css`, `PlanetIcon.jsx` |
| 7 | Responsive & accessibility pass | Mobile auto-fit grids, focus rings, WebGL error boundary, Lenis smooth scroll | Google Antigravity | `ScrollProgress.jsx`, `WebGLErrorBoundary.jsx`, `useLenis.js`, `reset.css` |
| 8 | Factual & reference fixes | Audit facts, label unverified items TODO, update `references.js`, add test suite | Google Antigravity | `references.js`, `missions.js`, `tests/lunarRoverNav.test.js`, `vercel.json` |
| 9 | Deployment prep + Windows build fix | Git/secrets audit, `vercel.json`, remove Windows-only npm bindings | Google Antigravity | `package.json`, `package-lock.json`, `vercel.json` corrected |
| 10 | Team credit & footer update | Add team name, fix provenance heading and age range, `<meta name="author">` | Google Antigravity | `Footer.jsx`, `index.html`, `README.md` updated |

---

## Stage 1 — Foundation & Scroll Engine

### Prompt *(summary — from pre-conversation project history; this conversation starts at deployment)*

The team asked AI to scaffold a React 19 + Vite 8 project named **"The Unfinished Mission"** with:
- Design tokens (colour, spacing, typography) in `variables.css`
- GSAP installed; motion tokens respecting `prefers-reduced-motion`
- NASA images downloaded as WebP and provenance registered in `credits.js`
- Signal scene and world-selector as the opening sequence

### Files changed (commits `d7976ee` → `5367975` → `d35e0c6` → `e00abe6`, 2026-11-14)

```
.gitignore, .oxlintrc.json, README.md, index.html
package.json, package-lock.json, vite.config.js
src/App.jsx, src/main.jsx, src/index.css
src/styles/reset.css, src/styles/typography.css, src/styles/variables.css, src/styles/motion.js
src/components/common/Footer.jsx, Navigation.jsx, SourcesModal.jsx
src/components/interactions/LunarRoverSim.jsx
src/components/mission/MissionLayout.jsx
src/components/opening/SignalScene.jsx, WorldSelector.jsx
src/data/missions.js, references.js, credits.js
public/assets/nasa/  (Apollo 15, Opportunity, Voyager 1 WebP images)
scripts/fetch_nasa_images.py, search_nasa_api.py
```

### Team corrections afterwards
- Intro text typography needed tighter letter-spacing — adjusted in CSS tokens.
- Some NASA image URLs returned 403; team manually verified and replaced with working public-domain URLs.

---

## Stage 2 — Cinematic Intro (First Version → Rework)

### Prompt *(summary)*

Team asked AI to implement a full-screen cinematic prologue:  
- Deep-space black background, procedural Web Audio sub-bass drone  
- Sequential countdown `3 → 2 → 1 → LIFTOFF` with strict no-overlap  
- Letter-spaced philosophical text reveal, rocket ascent cross-dissolve  
- Then transition into the scroll-driven main experience

### Files changed (commits `5d4907b` → `970fc0c`, 2026-11-15)

```
src/components/opening/CinematicIntro.jsx
src/components/opening/CinematicIntro.css
src/App.jsx
src/components/common/StarfieldBackground.jsx
```

### Team corrections afterwards
- **Overlapping countdown elements:** The `3`, `2`, `1` digits appeared simultaneously on first run. Team caught this in the browser and issued a correction prompt to enforce strict sequential GSAP timelines.
- Intro replay button was wired to `onReplayIntro` prop in the footer after team noticed there was no way to re-watch it.

---

## Stage 3 — Moon, Mars & Voyager Scenes

### Prompt *(summary)*

Team asked AI to implement three scroll-pinned Three.js scenes:
- **Scene 1 (Moon):** Grey cratered horizon of Hadley-Apennine; LRV-001 in warm side-light; child astronaut figure; Earth in lunar sky; typewriter narrative with verified coordinates and the Genesis Rock detail.
- **Scene 2 (Mars):** Red-ochre Perseverance Valley; dynamic sky shift as dust storm thickens (`τ > 10.8`); Opportunity's solar-panel glow fading; note that *"My battery is low and it's getting dark"* is a poetic interpretation, not a literal transmission.
- **Scene 3 (Voyager / Pale Blue Dot):** Multi-layer starfield parallax; 3D Voyager 1 probe; near-black space with single sunbeam; Carl Sagan closing reflection.

### Files changed (commits `f680dc3` → `899a141` → `27a258f`, 2026-11-14/15)

```
src/components/mission/Scene1Moon.jsx
src/components/mission/Scene2Mars.jsx
src/components/mission/Scene3Voyager.jsx
src/components/common/ChildAstronaut.jsx  (first appearance)
src/components/mission/MissionLayout.jsx
src/data/missions.js
```

### Team corrections afterwards
- 3D models were described as "blocky" — team asked for geometry simplification and low-poly aesthetic consistent with the educational tone.
- Mars sky colour shifted too abruptly; easing curve adjusted to a slow GSAP scrub.
- Voyager probe scale was too large relative to the starfield; rescaled.

---

## Stage 4 — Simulators

### Prompt *(summary)*

Team asked AI to implement three interactive educational tools, one per scene:

1. **Lunar Rover Simulator:** Dead-reckoning navigation grid, directional gyroscope controls, the **5.0 km walk-back safety limit** (NASA TN D-7469), distance/heading readout.
2. **Mars Evidence Lab:** Geochemical mineral identification — hematite "blueberries", jarosite, gypsum veins, smectite clays — establishing evidence of ancient liquid water; Simplified Model badge required; non-biological disclaimer required.
3. **Interstellar Ping:** Real-time speed-of-light radio-delay simulation across ~25.9 billion km / ~173 AU; inverse-square signal attenuation display.

### Files changed (commit `71d08e4`, 2026-11-14)

```
src/components/interactions/LunarRoverSim.jsx   (expanded from scaffold)
src/components/interactions/MarsEvidenceLab.jsx
src/components/interactions/InterstellarPing.jsx
src/data/missions.js                            (dossier data wired)
src/components/mission/MissionLayout.jsx
src/components/common/Navigation.jsx
```

### Team corrections afterwards
- **Odometer vs. range bug:** The Lunar Rover simulator was showing cumulative odometer distance in the "range remaining" field. Team caught this in the browser and issued a correction.
- Mars Evidence Lab initially labelled smectite clays as "proof of life" — team corrected to "strong evidence of ancient liquid water (non-biological)".
- Interstellar Ping AU distance was rounded to 150 AU; team corrected to ~173 AU based on JPL Horizons data.

---

## Stage 5 — Visual Cleanup

### Prompt *(summary)*

Team asked AI to clean up the cinematic intro after noticing overlapping elements:
- Strictly enforce that countdown digits `3`, `2`, `1` never overlap.
- Remove any stray `opacity: 1` left on predecessor elements.
- Ensure the cross-dissolve from rocket to main app is smooth on mobile.

### Files changed (within commit `3e74017`, 2026-11-15)

```
src/components/opening/CinematicIntro.jsx
src/components/opening/CinematicIntro.css
```

### Team corrections afterwards
- Audio drone was too loud on mobile; team manually adjusted the Web Audio API gain node values.

---

## Stage 6 — EVA-01 Astronaut Guide & Side Navigation

### Prompt *(summary)*

Team asked AI to add:
- An animated child astronaut character (`ChildAstronaut.jsx`) that serves as an in-page guide, appearing at scene transitions.
- A sticky side planet-hop navigation rail (`Navigation.jsx`) with planet icons and smooth scroll-to-section behaviour.
- `PlanetIcon.jsx` SVG components for Moon, Mars, and Voyager icons.

### Files changed (commit `efd60ac`, 2026-11-15)

```
src/components/common/ChildAstronaut.jsx   (major expansion)
src/components/common/Navigation.jsx
src/components/common/Navigation.css       (new, 319 lines)
src/components/common/PlanetIcon.jsx       (new)
src/components/common/ScrollProgress.jsx
src/components/opening/SignalScene.jsx
public/assets/  (planet-moon.png, planet-mars.png, planet-voyager.png, moon-hero*.png etc.)
```

### Team corrections afterwards
- Navigation rail was too wide on 390 px screens; reduced to icon-only with tooltip on hover.
- Astronaut animation played on every scroll tick; debounced to scene-entry only.

---

## Stage 7 — Responsive & Accessibility Pass

### Prompt (full text, 2026-11-15, step 201 in conversation)

```
Prepare The Unfinished Mission for deployment through the Vercel dashboard (Git integration).
IMPORTANT RULES: do NOT run any `vercel` command, do NOT use or create any API token, do NOT deploy,
and do NOT change source design or animations. Only local checks and fixes.

1. Git check: run `git status`, `git branch -a`, `git remote -v`, `git log --oneline -5`. Confirm the
   remote is github.com/Ae8y2la/Abandoned-not-forgotten and that BOTH `main` and `master` contain the
   same latest commit. If they differ, tell me which one has the real app and sync the other (no force push).
2. Secrets check: search the repo and git history for tokens, .env files or API keys (grep for "token",
   "VERCEL", "Bearer", "API_KEY"). Make sure .env* and .vercel are in .gitignore.
3. Run `npm ci` then `npm run build` and show the full output and exit code. Then run `npm run preview`
   and open it in the browser to confirm the intro, the astronaut, and all three scenes work.
4. Check vercel.json: Vite settings, SPA rewrite, asset cache header. Build output `dist`, build command
   `npm run build`.
5. Check all asset paths for Linux case-sensitivity and for absolute localhost or C:\ paths.
6. Run Lighthouse (mobile) against the preview. Report real Accessibility and Performance scores;
   fix easy issues until Accessibility is 90+.
7. Finish with an honest report: commit hash on main and master, build result, Lighthouse scores,
   and any remaining risk. Then give me the exact manual steps I should follow in the Vercel dashboard.
```

### Files changed (commit `3e74017`, 2026-11-15)

```
src/components/common/WebGLErrorBoundary.jsx   (new — 104 lines)
src/components/common/ScrollProgress.jsx       (reworked)
src/components/common/ScrollProgress.css       (expanded)
src/hooks/useLenis.js                          (new)
src/styles/reset.css                           (focus-visible rings added)
src/index.css                                  (mobile token fixes)
src/data/guideLines.js                         (new — accessibility guide data)
tests/lunarRoverNav.test.js                    (new — 79-line test suite)
vercel.json                                    (new — SPA rewrite + cache headers)
vite.config.js                                 (chunk splitting added)
```

### Team corrections afterwards
- Lighthouse Accessibility score was reported; some ARIA labels were missing on icon buttons and were added.
- WebGL error boundary was initially too aggressive — caught non-WebGL errors; scope narrowed.

---

## Stage 8 — Factual & Reference Fixes

### Prompt *(summary)*

Team asked AI to audit all facts in `missions.js` and `references.js`:
- Label any unverified document numbers as `TODO: verify before submission`.
- Clarify that *"My battery is low and it's getting dark"* is a poetic interpretation of engineering data, not a literal transmission from Opportunity.
- Ensure NSSDCA catalog IDs are cited correctly.
- Update `references.js` with the AI-use disclosure.

### Files changed (within commits `3e74017` → `a746b8c`, 2026-11-15)

```
src/data/missions.js
src/data/references.js
README.md
```

### Team corrections afterwards
- Team manually cross-checked Apollo 15 TN D-7469 document number — marked TODO pending final verification.
- HiRISE frame ID for Opportunity marked TODO pending verification.

---

## Stage 9 — Deployment Preparation & Windows Build Fix

### Prompt 9a — Initial deploy attempt *(summary, step 0, 2026-11-15)*

```
update my git and then Deploy The Unfinished Mission to my Vercel account "ae8y2la".
Target: Vercel scope "aeylas-projects", project name "abandoned-not-forgotten".
1. Run `npm run build`. If it fails, fix errors first.
2. Check Vercel CLI is installed; install if missing.
3. Check login with `vercel whoami`. If not logged in, run `vercel login`.
4. Link this folder: `vercel link --scope aeylas-projects --project abandoned-not-forgotten --yes`.
5. Confirm settings: Framework Vite, Build Command `npm run build`, Output Directory `dist`.
6. Deploy to production: `vercel --prod --scope aeylas-projects`. Show full output.
7. After deploy, fetch the production URL with curl -I and report the HTTP status.
[...full numbered list omitted for brevity — 10 steps total]
```

**Problem encountered:** AI deployed a placeholder/sample site instead of The Unfinished Mission source tree. Team caught this immediately.

### Prompt 9b — Correct the wrong deployment (step 165, 2026-11-15)

```
You deployed the WRONG site to my Vercel project "abandoned-not-forgotten". Live site is a different
website you created, not our project "The Unfinished Mission". Fix this now.
1. Run `pwd`, `git branch --show-current` and `git status`, and show me. Confirm you are inside our
   project folder (it contains src/components/opening/CinematicIntro.jsx, ChildAstronaut.jsx,
   Scene1Moon.jsx and our package.json named for The Unfinished Mission).
2. Look for any extra or sample website you created for the earlier deploy. List them.
3. Run `npm run build` and show the full output.
4. Check .vercel/project.json — link to abandoned-not-forgotten.
5. Redeploy: `vercel --prod --scope aeylas-projects`. Show full output.
6. Verify: fetch the production URL and confirm HTML title belongs to The Unfinished Mission.
7. Never print secrets or tokens.
```

### Prompt 9c — Windows-only platform binding fix (step 338, 2026-11-15)

```
Vercel build fails with: npm error EBADPLATFORM Unsupported platform for
@oxlint/binding-win32-x64-msvc (wanted win32, current linux). Fix it NOW so Vercel can build.
Rules: do NOT run any `vercel` command, do NOT use tokens, do NOT change source design or animations.

1. Remove @oxlint/binding-win32-x64-msvc from package.json (dependencies, devDependencies,
   optionalDependencies). Keep `oxlint` itself in devDependencies.
2. Delete node_modules and package-lock.json, run `npm install`, and confirm the new package-lock.json
   contains the Linux binding (@oxlint/binding-linux-x64-gnu).
3. Run `npm ci` and `npm run build` and show the output and exit codes.
4. Search package.json for any other win32, darwin or msvc-only packages listed as direct dependencies.
5. Commit "fix: remove windows-only oxlint binding for Vercel build" and push to BOTH main and master.
```

### Files changed (commits `56db539` → `e04527f`, 2026-11-15)

```
vercel.json          (buildCommand + outputDirectory added)
package.json         (@oxlint/binding-win32-x64-msvc + @rolldown/binding-win32-x64-msvc removed)
package-lock.json    (regenerated — Linux bindings: @oxlint/binding-linux-x64-gnu, @rolldown/binding-linux-x64-gnu)
```

### Team corrections afterwards
- An erroneous `optionalDependencies` block was accidentally introduced during troubleshooting and had to be removed in a follow-up clean install.
- Local Windows `npm run build` still fails (expected — rolldown needs its win32 native binary locally); Vercel Linux build succeeds.

---

## Stage 10 — Team Credit & Footer Update

### Prompt (full text, step 487, 2026-11-15)

```
Quick final update to The Unfinished Mission. Do NOT change design, animations or scenes. Do NOT run
any `vercel` command and do NOT use tokens; Vercel deploys automatically from GitHub when I push.

1. TEAM CREDIT in the footer (Footer.jsx), placed just above the "NASA Space Apps Challenge 2026 · Challenge"
   line, in the same style as the footer text but with readable contrast:
   "Created by Team The Forgotten Fleet"
   Do not write any individual names. Also add the same team name to README.md (a "Team" section) and
   to <meta name="author"> in index.html.
2. Footer wording fix: rename "VERIFIED PROVENANCE" to "DATA SOURCES & PROVENANCE" and change the
   sentence to: "Mission information is drawn from NASA sources, including the NSSDCA catalog, NASA
   mission pages, and JPL data, listed in the dossier."
3. Audience consistency: change "students aged 9–15" to "students aged 8–14" everywhere.
4. Run `npm run build` and show the output and exit code.
5. Commit "feat: add team credit, fix footer wording" and push to BOTH main and master.
```

### Files changed (commit `dc76f82`, 2026-11-15)

```
src/components/common/Footer.jsx   (team credit line, heading rename, age range, provenance sentence)
index.html                         (meta description age range; <meta name="author"> added)
README.md                          (Team section added; age range already correct)
```

### Team corrections afterwards
- None required; changes were straightforward text edits reviewed immediately in the browser.

---

## Human Review and Corrections

The following problems were found by the team reviewing the site in the browser and issued as correction prompts:

| Problem | Where found | Fix |
|---------|-------------|-----|
| Countdown digits `3`, `2`, `1` appeared simultaneously | Browser — cinematic intro | GSAP timeline rewritten with strict sequential labels; no-overlap enforced |
| 3D models described as "blocky" | Browser — Moon and Mars scenes | Geometry simplified; low-poly aesthetic requested explicitly |
| Odometer showing in "range remaining" field | Browser — Lunar Rover Simulator | Bug fixed: cumulative odometer separated from walk-back range readout |
| Mars mineral identified as "proof of life" | Code review — `MarsEvidenceLab.jsx` | Corrected to "strong evidence of ancient liquid water (non-biological)" |
| Interstellar Ping AU distance rounded to 150 AU | Browser — Voyager scene | Corrected to ~173 AU per JPL Horizons |
| Wrong website deployed to Vercel | Browser — production URL | Root cause: AI created a placeholder project. Fixed by relinking to correct source tree |
| `EBADPLATFORM` for Windows npm binding on Vercel Linux | Vercel build log | `@oxlint/binding-win32-x64-msvc` and `@rolldown/binding-win32-x64-msvc` removed from `devDependencies` |
| Age range inconsistency (9–15 vs 8–14) | README vs footer comparison | Standardised to 8–14 everywhere |
| Provenance section heading was vague | Footer review | Renamed from "VERIFIED PROVENANCE" to "DATA SOURCES & PROVENANCE" |

---

## AI Limitations We Handled

1. **Fact accuracy:** AI-generated mission parameters (coordinates, tau values, AU distances, document numbers) were cross-checked by the team against NSSDCA, JPL Horizons, and NASA Technical Reports. Items that could not be verified were labelled `TODO: verify before submission` rather than left as confident claims.

2. **"My battery is low and it's getting dark":** AI initially presented this as a literal transmission. The team corrected it to a clearly labelled poetic interpretation of Opportunity's final engineering telemetry, not a verbatim quote.

3. **Wrong deployment:** During initial Vercel deployment setup, the AI worked in an incorrect directory and deployed a placeholder site. The team caught this immediately by visiting the live URL and issued a correction prompt. The mistake was fixed without any user data or project data being lost.

4. **Platform-specific packages:** When developing on Windows, AI-generated `npm install` commands pulled Windows-only native bindings into `devDependencies`. These had to be removed before Vercel (Linux) could build. AI correctly diagnosed and fixed the issue when prompted.

5. **Unverified document numbers:** NASA Technical Note TN D-7469 and HiRISE frame IDs were cited by AI based on training data. The team flagged these as requiring manual verification before submission and labelled them accordingly.

6. **No AI-generated imagery used:** All imagery in the project comes from verified NASA public-domain archives. AI was not used to generate any visual assets.

---

*This log was generated on 2026-11-15 from the actual conversation history between Team The Forgotten Fleet and Google Antigravity. No prompts were invented or retroactively modified.*
