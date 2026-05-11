import { motion } from "framer-motion";
import { RENDERERS } from "@/lib/pixel-bouquet/flowers";
import { darken, lighten } from "@/lib/pixel-bouquet/colors";

export interface BouquetFlower {
  id: string;
  color: string;
}

interface Props {
  flowers: BouquetFlower[];
  size?: "sm" | "lg";
  animate?: boolean;
}

// ── Canvas & SVG constants ─────────────────────────────────────────────────
const CW = 260, CH = 300;
// The grip point — where stems physically converge and ribbon sits
const GX = 130, GY = 268;
// Each flower SVG is 180×220. Bloom centre is at (90,88). Stem base at (90,218).
const SVG_W = 180, SVG_H = 220;
const BLOOM_X = 90, BLOOM_Y = 88;  // bloom centre in SVG space
const STEM_X  = 90, STEM_Y  = 218; // stem base in SVG space

// ── Slot definitions ───────────────────────────────────────────────────────
// Each slot: [angleDeg, radiusPx, scale, tiltDeg]
// angleDeg: degrees from straight up. negative=left, positive=right.
// radiusPx: distance from GX,GY to bloom centre.
// scale:    how large to render this flower (0.5–0.7 keeps blooms in canvas).
// tiltDeg:  whole flower rotates around its stem base by this amount.
//
// KEY FIX: radius must be small enough that (GY - radius*cos(angle)) > ~40
// so blooms stay in the upper 60% of canvas and stems fill the lower 40%.
const SLOTS: Record<number, [number, number, number, number][]> = {
  1: [
    [  0, 155, 0.65,   0],
  ],
  2: [
    [-20, 148, 0.62, -16],
    [ 18, 150, 0.64,  14],
  ],
  3: [
    [-28, 142, 0.60, -22],
    [  2, 158, 0.66,   2],
    [ 26, 144, 0.61,  20],
  ],
  4: [
    [-34, 138, 0.57, -28],
    [-11, 152, 0.63,  -9],
    [ 12, 155, 0.65,  10],
    [ 33, 136, 0.58,  26],
  ],
  5: [
    [-38, 132, 0.55, -32],
    [-18, 148, 0.61, -15],
    [  0, 158, 0.66,   0],
    [ 20, 150, 0.62,  16],
    [ 38, 130, 0.56,  30],
  ],
  6: [
    [-42, 126, 0.53, -36],
    [-23, 142, 0.59, -20],
    [ -5, 154, 0.65,  -4],
    [  9, 156, 0.65,   7],
    [ 26, 144, 0.60,  22],
    [ 42, 124, 0.54,  35],
  ],
};

// Convert angle+radius to canvas bloom-centre position
function bloomPos(angleDeg: number, radius: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [
    GX + Math.sin(rad) * radius,
    GY - Math.cos(rad) * radius,
  ];
}

const WRAP_COLORS = ["#c084fc","#fb7185","#60a5fa","#f59e0b","#34d399","#f472b6"];

export function BouquetCanvas({ flowers, size = "sm", animate = false }: Props) {
  const sm = size === "lg" ? 1.38 : 1;
  const W = Math.round(CW * sm), H = Math.round(CH * sm);
  const gx = GX * sm, gy = GY * sm;

  const count = Math.min(flowers.length, 6);
  const slotDefs = SLOTS[count] || [];

  // Pre-compute per-flower layout
  const layout = slotDefs.map(([angle, radius, scale, tilt]) => {
    const [bx, by] = bloomPos(angle, radius * sm);
    const innerScale = scale * sm;
    // Top-left of the flower div so bloom centre lands at bx, by
    const left = bx - BLOOM_X * innerScale;
    const top  = by - BLOOM_Y * innerScale;
    // Stem base on canvas (pivot point for tilt rotation)
    const stemCanvasX = left + STEM_X * innerScale;
    const stemCanvasY = left + STEM_Y * innerScale; // intentional: use left+... no
    const stemCX = bx + (STEM_X - BLOOM_X) * innerScale;
    const stemCY = by + (STEM_Y - BLOOM_Y) * innerScale;
    // transform-origin relative to the div's top-left
    const pivotX = stemCX - left;
    const pivotY = stemCY - top;
    return { left, top, innerScale, tilt, bx, by, stemCX, stemCY, pivotX, pivotY, scale };
  });

  const Wrapper = animate ? motion.div : "div";
  const wc = WRAP_COLORS[count - 1] || "#c084fc";
  const wdk = darken(wc, 0.35);
  const wlt = lighten(wc, 0.3);

  return (
    <div
      className="relative rounded-3xl shadow-2xl border border-white/80 overflow-hidden"
      style={{ width: W, height: H, background: "linear-gradient(180deg,#fdf6ee 0%,#f5ede2 55%,#eef6f0 100%)" }}
    >
      {/* Empty state */}
      {count === 0 && (
        <div className="absolute inset-3 rounded-2xl border-2 border-dashed border-rose-200/70 flex items-center justify-center text-center px-6">
          <p className="font-serif text-rose-400/80 text-lg leading-snug">Add flowers to begin 🌱</p>
        </div>
      )}

      {/* Flowers — back to front */}
      {flowers.slice(0, 6).map((f, i) => {
        const L = layout[i];
        if (!L) return null;
        const renderer = RENDERERS[f.id];
        if (!renderer) return null;
        const uid = `${f.id}${i}${f.color.replace("#","")}`;
        const svg = renderer(f.color, uid);

        const motionProps = animate ? {
          initial: { opacity: 0, scale: 0.4 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: i * 0.25, duration: 0.5, ease: "easeOut" as const },
        } : {};

        return (
          <Wrapper
            key={`${i}-${f.id}-${f.color}`}
            {...motionProps}
            style={{
              position: "absolute",
              left: L.left,
              top: L.top,
              width: SVG_W * L.innerScale,
              height: SVG_H * L.innerScale,
              // Rotate around stem base so flower leans outward from grip
              transformOrigin: `${L.pivotX}px ${L.pivotY}px`,
              transform: `rotate(${L.tilt}deg)`,
              zIndex: i + 1,
              overflow: "visible",
            }}
          >
            <div
              style={{
                transform: `scale(${L.innerScale})`,
                transformOrigin: "top left",
                width: SVG_W,
                height: SVG_H,
              }}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </Wrapper>
        );
      })}

      {/* Convergent stems — single SVG, all curves meet at grip */}
      {count > 0 && (
        <svg
          style={{ position:"absolute", left:0, top:0, pointerEvents:"none", zIndex:20 }}
          width={W} height={H} viewBox={`0 0 ${W} ${H}`}
        >
          {layout.map((L, i) => {
            // Stem start: slightly above the stem base, in the direction away from grip
            const dx = L.stemCX - gx;
            const dy = L.stemCY - gy;
            const dist = Math.sqrt(dx*dx + dy*dy) || 1;
            // Start point is stem base shifted ~20px outward from grip
            const sx = L.stemCX + (dx / dist) * 12 * sm;
            const sy = L.stemCY + (dy / dist) * 12 * sm;
            // Bezier curves converge naturally
            const cp1x = sx + (gx - sx) * 0.25;
            const cp1y = sy + (gy - sy) * 0.15;
            const cp2x = sx + (gx - sx) * 0.65;
            const cp2y = sy + (gy - sy) * 0.80;
            return (
              <path
                key={i}
                d={`M${sx.toFixed(1)} ${sy.toFixed(1)} C${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${gx.toFixed(1)} ${gy.toFixed(1)}`}
                stroke="#3d6b45"
                strokeWidth={Math.max(2, 4 * L.scale * sm)}
                fill="none"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      )}

      {/* Ribbon — sits exactly at grip point, z above stems */}
      {count > 0 && (
        <svg
          style={{ position:"absolute", left:0, top:0, pointerEvents:"none", zIndex:30 }}
          width={W} height={H} viewBox={`0 0 ${W} ${H}`}
        >
          {/* Body */}
          <rect x={gx-18*sm} y={gy-4*sm} width={36*sm} height={26*sm} rx={3*sm} fill={wc}/>
          {/* Centre crease */}
          <rect x={gx-4*sm} y={gy-4*sm} width={8*sm} height={26*sm} fill={wdk}/>
          {/* Left bow */}
          <path d={`M${gx-18*sm} ${gy+8*sm} C${gx-30*sm} ${gy-2*sm} ${gx-36*sm} ${gy-10*sm} ${gx-26*sm} ${gy-14*sm} C${gx-16*sm} ${gy-18*sm} ${gx-8*sm} ${gy-4*sm} ${gx} ${gy+2*sm}`} fill={wlt}/>
          {/* Right bow */}
          <path d={`M${gx+18*sm} ${gy+8*sm} C${gx+30*sm} ${gy-2*sm} ${gx+36*sm} ${gy-10*sm} ${gx+26*sm} ${gy-14*sm} C${gx+16*sm} ${gy-18*sm} ${gx+8*sm} ${gy-4*sm} ${gx} ${gy+2*sm}`} fill={wlt}/>
          {/* Knot */}
          <circle cx={gx} cy={gy+2*sm} r={5*sm} fill={wdk}/>
        </svg>
      )}
    </div>
  );
}