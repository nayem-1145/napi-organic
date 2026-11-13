# Napi Organic — 3D Banana Chips Website

Bengali, scroll-driven 3D product story for Napi Organic (React 19 · TypeScript · Vite · Tailwind v4 · Three.js · GSAP ScrollTrigger · Lenis).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build in dist/
```

## Before launch — fill in `src/config/site.ts`
| Field | Status |
|---|---|
| `contact.whatsapp` | **empty** — without it the order button opens WhatsApp's contact picker with the message prefilled |
| `product.priceBdt` | **null** — UI shows "মূল্য জানতে যোগাযোগ করুন" |
| `contact.phoneDisplay / email / address` | empty (hidden until set) |
| `testimonials` | **samples**, labelled "নমুনা" in the UI. Replace and set `testimonialsAreSamples: false` |
| `faq` delivery answer | generic — replace with the real policy |
| `images.plantation / preparation / lifestyle` | **null** → labelled photo placeholders |
| `showPlaceholderNotes` | set `false` once real photography is in |

Facebook, Instagram, website, 150 g, flavour and ingredients come from the supplied package artwork.

## Architecture
```
src/
  config/site.ts         all business data
  three/                 framework-agnostic WebGL engine (lazy-loaded chunk)
    Engine.ts            renderer, lights, render-on-demand loop, resize, dispose, snapshot()
    timeline.ts          story beats + camera/package keyframes — pure functions of scroll progress
    pouch.ts             procedural stand-up pouch with real tear-off strip + vertex-deformed opening
    chips.ts             InstancedMesh chips, deterministic pile + ballistic fall paths
    bowl.ts              lathe stoneware bowl with analytic inner surface
  sections/Experience.tsx  pinned hero + story; ScrollTrigger(scrub) → engine.setProgress()
  sections/*             remaining page sections
  lib/                   motion loader (GSAP/Lenis with graceful fallback), WhatsApp, utils
```

### Why a plain Three.js engine instead of React Three Fiber
Every frame of the story is a pure function of one number (scroll progress), the engine renders only when that number changes, and transforms are written imperatively. R3F would add a reconciler layer without adding capability here, so it was left out to keep dependencies lean. The engine is mounted from React and can be wrapped in an R3F `<primitive>` later if desired.

### Determinism
No live physics drives the scroll story. Each chip has a precomputed resting pose (layered packing against the bowl's analytic wall), a release time, and an exact gravity parabola → bounce → settle path. Scrubbing backwards replays the identical frames.

### Fallbacks
- WebGL missing or engine fails → real package photography + static final composition; the story section collapses.
- GSAP fails → native scroll listener drives the story; content stays visible.
- `prefers-reduced-motion` → no floating, no smooth scroll, the story steps between three calm states.
- Mobile: dedicated camera choreography, 64 chips (desktop 150), lower geometry/shadow resolution, DPR ≤ 1.5.

See `docs/3D-ASSETS.md` for replacing the procedural pouch with a professional GLB.
