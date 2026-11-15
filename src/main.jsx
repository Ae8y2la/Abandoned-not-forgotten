import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gsap } from 'gsap'
import './index.css'
import App from './App.jsx'

// ── Tab-hidden animation pause ───────────────────────────────────────────────
// When the user switches tabs or minimises the window, pause all GSAP
// timelines and tweens to save CPU/GPU. Resume when they return.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    gsap.globalTimeline.pause();
  } else {
    gsap.globalTimeline.resume();
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
