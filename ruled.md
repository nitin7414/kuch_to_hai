# Project Rules & Development Guidelines

> **Project Goal**: Interactive 3D Birthday Celebration Experience  
> **Target Audience**: Personal gift / recipient — must feel premium, magical, emotional, and perform at 60/120fps with zero scroll lag across desktop and mobile devices.

---

## 1. Mandatory Workflow & Phase Tracking Rule

* **`phase.md` Synchronization**:
  * Before starting any new feature or phase, review [phase.md](file:///f:/projects/birhtday/phase.md) to confirm prerequisites.
  * When a sub-task or phase milestone is completed, immediately update [phase.md](file:///f:/projects/birhtday/phase.md) with the completion status, timestamp, and notes.
  * Never leave [phase.md](file:///f:/projects/birhtday/phase.md) out of sync with the actual codebase state.

---

## 2. Scroll & Performance Rules (Zero-Lag Guarantee)

1. **No Scroll-Jacking Latency**:
   * All smooth scrolling must route through [SmoothScrollProvider.tsx](file:///f:/projects/birhtday/components/dom/navigation/SmoothScrollProvider.tsx) powered by **Lenis** (`lenis`).
   * Never bind heavy DOM style recalculations (e.g. `offsetTop`, `getBoundingClientRect` on every frame) directly to raw window scroll listeners.
   * Use `requestAnimationFrame` interpolation or GSAP ScrollTrigger ticker integration.
2. **Mobile Touch Respect**:
   * Mobile touch interactions must retain native momentum scrolling with `-webkit-overflow-scrolling: touch` and `touch-action: pan-y`.
   * Video reel vertical scrolling must utilize native CSS GPU hardware snapping (`scroll-snap-type: y mandatory`) via `.reel-snap-container`.
3. **GPU Layer Promotion**:
   * Floating and animated UI elements must have the `.gpu-layer` utility applied (`transform: translate3d(0, 0, 0)`, `backface-visibility: hidden`, `will-change: transform`).
4. **Visibility API Throttling**:
   * Every continuous animation loop (Butterfly 2D Canvas, ambient audio, 3D Canvas rendering) must halt or throttle when `document.visibilityState === 'hidden'`.

---

## 3. WebGL & DOM Separation Architecture

1. **WebGL Canvas Isolation**:
   * All React Three Fiber (`<Canvas>`) scenes and Drei meshes must reside strictly in `components/canvas/`.
   * WebGL Canvas components must be loaded dynamically using `next/dynamic` with `{ ssr: false }`.
   * Never instantiate multiple persistent WebGL contexts if one can be shared or suspended.
2. **Ambient Butterfly Background**:
   * The butterfly background must run on a **dedicated 2D HTML5 Canvas (`CanvasRenderingContext2D`)** in `components/dom/background/ButterflyCanvas.tsx`.
   * It must **never** share or duplicate WebGL contexts with the 3D Wish Card scenes, preserving 100% of GPU shader pipelines for 3D card physics.
3. **DOM Overlays & Typography**:
   * All readable text, headers, greeting modals, and interactive buttons must reside in standard HTML5 DOM (`components/dom/` and `components/ui/`) for crisp font rendering, accessibility, and responsiveness.

---

## 4. State Management Standards

1. **Zustand (`store/useAppStore.ts` & `store/useReelStore.ts`)**:
   * Use Zustand exclusively for cross-component global state:
     - Global phase / active section (`intro`, `reels`, `wishes`, `outro`)
     - Master audio mute, background music playing state, and volume levels
     - Active reel index and reel liked state
     - Opened/unlocked 3D wish card IDs
     - Asset preloading percentage
2. **Local Component State (`useState`, `useRef`, `useSpring`)**:
   * Use local state for high-frequency physics, mouse tilt coordinates, drag delta, and local video buffering indicators.
   * Avoid putting high-frequency mouse coordinates (e.g. `mousemove` at 120Hz) into Zustand to prevent unnecessary tree re-renders.
3. **Deep Linking**:
   * Support URL hashes (`#intro`, `#reels`, `#wishes`) so sections can be directly navigated and reloaded.

---

## 5. Audio & Media Coordination Rules

1. **Audio Mutex (Mutual Exclusion)**:
   * When a video reel with audio becomes active and unmuted, background ambient music must automatically smoothly fade down or pause.
   * When navigating away from the reels section to the 3D wish cards, background ambient music must smoothly fade back in.
2. **Autoplay Policies**:
   * Browsers block unprompted audio autoplay. Audio playback must initialize upon the user's first interactive click (e.g., "Begin Celebration" button on Hero).
   * A persistent, elegant floating audio controller ([FloatingNavbar.tsx](file:///f:/projects/birhtday/components/dom/navigation/FloatingNavbar.tsx)) must always remain accessible.
3. **Video Reel Viewport Gate**:
   * Video elements must only play when $\ge 60\%$ visible in the viewport ([useInViewObserver.ts](file:///f:/projects/birhtday/hooks/useInViewObserver.ts)).
   * Off-screen videos must immediately pause and suspend decoding.

---

## 6. Code Style & Naming Conventions

* **React Components**: `PascalCase.tsx` (e.g., `WishCardScene.tsx`, `ReelItem.tsx`, `ButterflyCanvas.tsx`).
* **Custom Hooks**: `camelCase.ts` prefixed with `use` (e.g., `useInViewObserver.ts`, `useButterflies.ts`).
* **Stores**: `camelCase.ts` prefixed with `use` in `store/` (e.g., `useAppStore.ts`).
* **Constants & Types**: `camelCase.ts` or `kebab-case.ts` (e.g., `types/experience.ts`, `constants/wishes.ts`).
* **Strict TypeScript**: Every prop interface, store state, and data structure must be strictly typed without `any`.
* **Tailwind CSS & Styling**: Use curated HSL/hex palettes (`--gold-accent`, `--rose-accent`), glassmorphic backdrops (`backdrop-blur-md bg-white/10`), and smooth transitions (`transition-all duration-300`).

---

## 7. Asset Optimization & Placement Rules

| Asset Category | Folder | Constraints |
| :--- | :--- | :--- |
| **3D Models** | `public/models/` | `.glb` only, Draco compressed, $< 25\text{k}$ tris. |
| **Textures / Matcaps** | `public/textures/` | `.webp` / `.png`, max $1024\times 1024$ resolution. |
| **Reel Videos** | `public/videos/` | Vertical 9:16, `.mp4` (H.264) + `.webm`, $< 15\text{MB}$ each. |
| **Video Posters** | `public/videos/posters/` | `.webp` / `.jpg`, $< 100\text{KB}$ each. |
| **Audio** | `public/audio/` | `.mp3` / `.webm`, $< 4\text{MB}$ for music, $< 100\text{KB}$ for SFX. |
| **Sprites / Particles** | `public/sprites/` | 2D transparent PNG / SVG assets. |
