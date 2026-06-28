# SHIFT - Gameplay & Technical Instructions

Welcome to **Shift**, a minimalist, hyper-casual polarity-shifting arcade game built entirely using standard HTML5 Canvas and the Web Audio API with zero external dependencies.

---

## 🎮 How to Play

### Core Concept
You control a glowing **Neon Red Avatar** locked horizontally in the center of the screen, falling continuously downwards.
- A vertical maze of horizontal blocks scrolls upwards to meet you.
- Every block is either **White** or **Black**.
- The universe operates under a global **Polarity State** which you control.

### The Polarity Twist
- **White-Solid State (Default):** All White blocks are 100% opaque, solid, and **deadly**. All Black blocks are faded, semi-transparent, and **safe to pass through**.
- **Black-Solid State:** All Black blocks are 100% opaque, solid, and **deadly**. All White blocks are faded, semi-transparent, and **safe to pass through**.

> ⚠️ **Death Condition:** If your avatar collides with a block of the *currently solid* color, it is **Game Over**. You must constantly switch polarities to ensure the blocks passing under your avatar are transparent.

---

## 🕹️ Controls

| Input Method | Action | Description |
| :--- | :--- | :--- |
| **Tap / Click** | Polarity Shift | Instantly inverts the universe polarity. |
| **Spacebar (Press)** | Polarity Shift | Instantly inverts the universe polarity. |
| **Touch Hold / Mouse Hold** | Kinetic Boost | Accelerates scroll speed (`1.6x`). Earns double score points. |
| **Spacebar (Hold)** | Kinetic Boost | Accelerates scroll speed (`1.6x`). Earns double score points. |

---

## 🚀 Advanced Mechanics

### 1. Kinetic Acceleration (Risk-Reward Boost)
- Holding down the screen/Spacebar increases the falling speed by `1.6x`.
- While boosting, passing rows yields **double points** (`+2 BOOST`).
- You also accumulate continuous **boost distance score** (`+1 BOOST`) for every full screen height traveled while boosting.
- *Tip:* Use boost in open vertical corridors to rack up high scores quickly, but release it before tight maneuvers!

### 2. Perfect Chrono-Shift (Slow-Motion)
- Shifting polarity at the very last moment (within `10px` to `45px` before hitting a block) triggers a **Perfect Chrono-Shift**.
- Time dilates, slowing the game down to `0.22x` speed and gradually recovering over `350ms`.
- Awards **`+1` bonus point** and floats a `+1 PERFECT` indicator.
- *Tip:* Chain perfect shifts to gain breathing room in high-speed segments.

### 3. Kinetic Drift (Sliding Conveyors)
- Starting at score **`8`**, some rows will begin sliding horizontally.
- The blocks wrap around the screen boundaries like a loop conveyor belt.
- Look at the **glowing lateral chevrons** on the blocks to see which way they are moving, and time your descent so you pass through a safe color.

---

## 🛠️ Technical Architecture

### 1. Responsive Viewport Scaling
The game uses a dual-layout responsive canvas:
- **Desktop Mode (> 600px width):** Centers the game inside a floating arcade cabinet frame (`450px` width, capped height) with a glowing, drop-shadow border that dynamically colors to match the active polarity.
- **Mobile Mode (≤ 600px width):** Removes borders and fits 100% of the screen width and height.
- **Retina/DPR Correction:** Detects `window.devicePixelRatio` and scales the canvas draw buffer proportionally, keeping graphics razor-sharp.

### 2. Web Audio Sound Synthesis
To remain zero-dependency, all sounds are synthesized mathematically on the fly:
- **Shift sweeps:** Frequency sweeps on triangle wave oscillators.
- **Chrono-Shift bells:** A synthesized C-Major 7th chime (arpeggiated sine oscillators).
- **Boost engine hum:** A low-frequency sawtooth wave passed through a `lowpass` BiquadFilter, ramping from `60Hz` to `92Hz`.
- **Explosion noise:** Low sawtooth and square pitch-diving sub-bass notes.

### 3. Procedural Maze Generator
- Obstacles are spawned in a queue of 4 active rows at a distance of `280px`.
- The column underneath the player is guaranteed to alternate colors with a strict rhythm (maximum 2 consecutive rows of the same center color), ensuring a **100% passable path** is always mathematically available.
- Visual block layout on side columns is fully randomized to maintain the scrolling maze aesthetic.
