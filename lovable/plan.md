## Pixel Bouquet — Build Plan (SVG Renderer)

A single-page React app for crafting and sharing hand-crafted SVG flower bouquets. Bouquet state lives entirely in the URL hash — no backend.

### Routes
- `src/routes/index.tsx` — main app. On mount checks `window.location.hash`:
  - **No hash** → 4-step builder
  - **Valid hash** → Received gift-reveal view
  - **Invalid hash** → Broken-bouquet error card with "Make a new one" CTA

### File structure
```text
src/
  routes/index.tsx                 // orchestrator + hash detection
  components/pixel-bouquet/
    BouquetCanvas.tsx              // positioned div with absolutely-placed flower SVGs + ribbon
    FlowerPicker.tsx               // step 1 grid + per-flower color rows
    ArrangeStep.tsx                // step 2 meanings panel
    MessageStep.tsx                // step 3 inputs + gift-tag preview
    SendStep.tsx                   // step 4 summary + generate link + share
    ReceivedView.tsx               // gift reveal w/ staggered Framer Motion bloom
    StepProgress.tsx               // segmented progress bar
    GiftTag.tsx                    // shared cream gift-tag card
    Ribbon.tsx                     // bottom ribbon + bow SVG, color cycles by count
  lib/pixel-bouquet/
    flowers.ts                     // FLOWERS data, OCCASIONS, RENDERERS map, all 8 drawX functions
    colors.ts                      // lighten(), darken()
    encode.ts                      // encodeBouquet / decodeBouquet (btoa + JSON)
    layout.ts                      // LAYOUTS offset map (count -> [x%, y%][])
```

### SVG flower engine (NO canvas)
- All 8 flower renderers live in `flowers.ts` with signature `(col: string, uid: string) => string`, returning a full `<svg width=180 height=220 viewBox="0 0 180 220">` string.
- Shared `stemLeaves(uid)` helper prepended in each renderer (unique gradient id per call).
- Implementations follow the user's exact SVG path/gradient/filter specs for: Rose, Sunflower, Tulip, Daisy, Lavender, Lily, Orchid, Peony.
- `colors.ts` exports `lighten(hex,t)` and `darken(hex,t)` exactly as specified.
- **Critical: gradient ID uniqueness** — `uid = ${flower.id}-${colorIndex}-${positionIndex}` so multiple instances don't share `<defs>` ids.

### Bouquet rendering (`BouquetCanvas.tsx`)
- Container `<div>` with relative positioning, soft pastel gradient background, dashed-border empty state ("Add flowers to begin 🌱").
- For each flower in state, render a wrapper div: `width:90px; height:110px; overflow:hidden;` containing inner div with `transform: scale(0.5); transform-origin: top left;` and `dangerouslySetInnerHTML={{ __html: svgString }}` — this fits the 180×220 SVG into 90×110 exactly.
- Position each wrapper absolutely using `LAYOUTS[count][i]` as left/top percentages.
- `<Ribbon count={n}/>` pinned at bottom-center, ribbon color cycles by count.
- Soft drop-shadow `shadow-2xl` on outer frame.

### Layouts
```ts
const LAYOUTS: Record<number,[number,number][]> = {
  1:[[50,10]], 2:[[18,18],[52,8]], 3:[[12,22],[42,8],[72,18]],
  4:[[6,20],[30,8],[56,10],[78,22]],
  5:[[4,26],[24,12],[48,4],[68,14],[86,24]],
  6:[[0,28],[18,14],[38,6],[58,8],[76,18],[90,28]],
};
```

### Design system (`src/styles.css`)
oklch tokens:
- Body gradient `#fdfaf6 → #f5f0eb`
- `--primary` dusty rose `#d4727a`
- `--accent-sage` `#7a9e7e`, `--accent-lavender` `#9b8ec4`, `--accent-gold` `#c9972a`
- Frosted glass utility (`backdrop-blur-sm bg-white/60 border-white/80`)
- Google Fonts loaded in `__root.tsx` head: DM Serif Display (headings), Inter (body)
- Update meta: title "Pixel Bouquet 🌸", OG description, inline-SVG flower favicon

### State & flow
Single bouquet object: `{ flowers: [{id,color}], occasion, toName, fromName, message }` + `step` 1–4.

- **Step 1 — Pick**: 2-col grid of 8 cards (name + meaning + 4 color dots). Tap adds (max 6); count badge top-right. Disabled+tooltip ("Bouquet full!") at 6. Below grid: one inline color row per unique flower, swatch ring on selected. Live `BouquetCanvas` updates with bloom animation (key bump for fade).
- **Step 2 — Arrange**: read-only larger canvas + meanings card listing unique flowers.
- **Step 3 — Message**: To (required), From (optional), occasion pill row (6 options), 200-char textarea with soft counter. Live `GiftTag` preview.
- **Step 4 — Send**: summary card → "Generate bouquet link 🌸" sets `window.location.hash` and shows success state with full canvas, gift tag, Copy link (`✓ Copied!`), WhatsApp share (`https://wa.me/?text=`), "Make another" ghost.

### Received view (`ReceivedView.tsx`)
- Decode hash → render `BouquetCanvas` but wrap each absolutely-positioned flower div in `motion.div` with `initial={{opacity:0,scale:0.6}} animate={{opacity:1,scale:1}} transition={{ delay: index*0.3, duration:0.5 }}` for staggered bloom.
- Gift tag slides up from below.
- Occasion badge + meanings list.
- Simple CSS-keyframe confetti burst.
- "Send one back" CTA → clears hash, resets to step 1.

### Step transitions & micro-interactions (Framer Motion)
- `AnimatePresence` + slide-x variants between steps.
- Primary buttons `whileHover={{ scale:1.03 }}`, color swatches `whileTap={{ scale:0.85 }}`.

### Encoding
```ts
encodeBouquet(s) = btoa(encodeURIComponent(JSON.stringify({
  f: s.flowers.map(f=>({i:f.id,c:f.color})),
  o: s.occasion, t: s.toName, r: s.fromName, m: s.message,
})));
decodeBouquet(h) = try { JSON.parse(decodeURIComponent(atob(h))) } catch { null }
```

### Responsive
- `<768px`: single column, `BouquetCanvas` sticky top, step nav fixed bottom.
- `≥768px`: `grid-cols-[260px_1fr]`, canvas sticky in left column, no fixed nav.

### Dependencies
- `bun add framer-motion`
- shadcn primitives already present (button, card, input, textarea, badge, tooltip).

### Out of scope (v1)
No backend, no auth, no analytics. All persistence via URL hash.
