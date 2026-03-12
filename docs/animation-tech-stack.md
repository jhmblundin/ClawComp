# Animation Tech Stack Research

> Research on potential routes to add fancier animations to the ClawComp website (e.g., animating the lobster's claws on the logo).

## The Core Constraint

The current logo is a **PNG** — a flat raster image. You cannot animate individual parts (claws, body, etc.) of a PNG; you can only move, scale, or fade the entire image as a whole.

To animate parts independently, the logo needs to exist in a format where each part is a separate element.

---

## Tech Options for Part-by-Part Animation

### 1. SVG + Framer Motion (or CSS)

- **What:** Logo as SVG with claws as separate paths/groups.
- **How:** Import SVG as React components (or inline), wrap each claw in `motion.g` / `motion.path`, animate rotation/position.
- **Pros:** No new dependencies, works with current stack, performant.
- **Cons:** Requires an SVG version of the logo and identifying which elements are the claws.

### 2. Lottie (lottie-react or @lottiefiles/react-lottie-player)

- **What:** Animation created in After Effects (or similar), exported as JSON.
- **How:** Designer animates the claws in AE, exports via Bodymovin; you play the JSON in React.
- **Pros:** Silky smooth, complex animations, small file size.
- **Cons:** Requires design/animation work in After Effects; not ideal for interactive/state-driven changes.

### 3. Rive

- **What:** Vector animation tool with a React runtime (`@rive-app/react-canvas`).
- **How:** Build the logo and claw animations in Rive's editor, export, and render in React.
- **Pros:** Interactive, state-driven, great for "claws with a mind of their own" and reacting to user input.
- **Cons:** New tool to learn; requires a Rive version of the logo.

### 4. Spine / DragonBones

- **What:** Skeletal/rigged 2D animation (common in games).
- **How:** Rig the lobster, animate bones, play in browser.
- **Pros:** Very flexible for character motion.
- **Cons:** Heavier; usually overkill for a logo.

---

## Recommendation Matrix

| If you have… | Best approach |
|--------------|--------------|
| SVG of the logo | **SVG + Framer Motion** — animate claw paths/groups directly. |
| Only PNG, no vector source | Get an SVG from the designer or recreate the logo as SVG. |
| Budget for a custom animation | **Lottie** — designer animates in After Effects, you drop in the JSON. |
| Want interactive / state-driven motion | **Rive** — build and control the animation in Rive, render in React. |

---

## Next Steps

1. **Check if an SVG version of the combined logo exists** — if yes, we can wire up claw animations with Framer Motion.
2. If not, either:
   - Export the logo as SVG from the original design tool (Figma, Illustrator, etc.), or
   - Choose Lottie or Rive and have the animation created there.

---

## Current Stack (Already in Use)

- **Framer Motion** — Used for the hero logo bobbing animation and scroll-triggered animations across the site.
- **CSS `@keyframes`** — Used for the sponsor scroll animation in `globals.css`.
