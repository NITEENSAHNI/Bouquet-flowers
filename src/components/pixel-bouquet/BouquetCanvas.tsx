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

// ── Canvas constants ───────────────────────────────────────────────────────
const CW = 320;
const CH = 340;

const GX = 160;
const GY = 300;

// ── Bouquet slots ──────────────────────────────────────────────────────────
// [angleDeg, radius, scale, tiltDeg]
const SLOTS: Record<number, [number, number, number, number][]> = {
  1: [[0, 160, 0.64, 0]],

  2: [
    [-16, 152, 0.6, -12],
    [16, 156, 0.62, 12],
  ],

  3: [
    [-22, 146, 0.58, -18],
    [0, 164, 0.66, 0],
    [22, 150, 0.6, 18],
  ],

  4: [
    [-26, 142, 0.56, -22],
    [-8, 156, 0.62, -6],
    [10, 160, 0.64, 8],
    [26, 144, 0.57, 22],
  ],

  5: [
    [-30, 138, 0.54, -26],
    [-14, 152, 0.6, -12],
    [0, 166, 0.66, 0],
    [15, 154, 0.61, 12],
    [30, 140, 0.55, 26],
  ],

  6: [
    [-32, 134, 0.52, -28],
    [-18, 148, 0.58, -15],
    [-4, 160, 0.64, -4],
    [8, 162, 0.64, 6],
    [20, 150, 0.59, 16],
    [32, 136, 0.53, 28],
  ],
};
const STEM_ATTACH: Record<string, number> = {
  rose: 34,
  sunflower: 22,
  tulip: 30,
  daisy: 18,
  lavender: 10,
  lily: 26,
  orchid: 24,
  peony: 36,
};
type Pt = [number, number];

// ── Bezier helpers ─────────────────────────────────────────────────────────
function bezierPt(
  p0: Pt,
  p1: Pt,
  p2: Pt,
  p3: Pt,
  t: number
): Pt {
  const mt = 1 - t;

  return [
    mt * mt * mt * p0[0] +
      3 * mt * mt * t * p1[0] +
      3 * mt * t * t * p2[0] +
      t * t * t * p3[0],

    mt * mt * mt * p0[1] +
      3 * mt * mt * t * p1[1] +
      3 * mt * t * t * p2[1] +
      t * t * t * p3[1],
  ];
}

function bezierTan(
  p0: Pt,
  p1: Pt,
  p2: Pt,
  p3: Pt,
  t: number
): Pt {
  const mt = 1 - t;

  return [
    3 *
      (mt * mt * (p1[0] - p0[0]) +
        2 * mt * t * (p2[0] - p1[0]) +
        t * t * (p3[0] - p2[0])),

    3 *
      (mt * mt * (p1[1] - p0[1]) +
        2 * mt * t * (p2[1] - p1[1]) +
        t * t * (p3[1] - p2[1])),
  ];
}

// ── Leaf generator ─────────────────────────────────────────────────────────
function leafPath(
  lx: number,
  ly: number,
  tanX: number,
  tanY: number,
  side: number,
  size: number
): string {
  const nx = -tanY * side;
  const ny = tanX * side;

  const tipX =
    lx + nx * 20 * size + tanX * -4 * size;

  const tipY =
    ly + ny * 20 * size + tanY * -4 * size;

  const c1x =
    lx + nx * 14 * size + tanX * -10 * size;

  const c1y =
    ly + ny * 14 * size + tanY * -10 * size;

  const c2x =
    lx + nx * 14 * size + tanX * 4 * size;

  const c2y =
    ly + ny * 14 * size + tanY * 4 * size;

  return `
    M ${lx} ${ly}
    C ${c1x} ${c1y}, ${tipX} ${tipY}, ${tipX} ${tipY}
    C ${c2x} ${c2y}, ${lx} ${ly}, ${lx} ${ly}
    Z
  `;
}

// ── Ribbon colours ─────────────────────────────────────────────────────────
const WRAP_COLORS = [
  "#c084fc",
  "#fb7185",
  "#60a5fa",
  "#f59e0b",
  "#34d399",
  "#f472b6",
];

// ── Component ──────────────────────────────────────────────────────────────
export function BouquetCanvas({
  flowers,
  size = "sm",
  animate = false,
}: Props) {
  const sm = size === "lg" ? 1.38 : 1;

  const W = CW * sm;
  const H = CH * sm;

  const gx = GX * sm;
  const gy = GY * sm;

  const count = Math.min(flowers.length, 6);

  const slotDefs = SLOTS[count] || [];

  // ── Compute bloom positions ─────────────────────────────────────────────
  const blooms = slotDefs.map(
    ([angle, radius, scale, tilt], i) => {
      const a = (angle * Math.PI) / 180;

      const bx =
        gx + Math.sin(a) * radius * sm;

      const by =
        gy - Math.cos(a) * radius * sm;

      return {
        bx,
        by,
        sc: scale * sm,
        rawScale: scale,
        tilt,
        flower: flowers[i],
      };
    }
  );

  const Wrapper = animate
    ? motion.div
    : "div";

  const wc =
    WRAP_COLORS[count - 1] || "#c084fc";

  const wdk = darken(wc, 0.35);
  const wlt = lighten(wc, 0.3);

  return (
    <div
      className="relative rounded-3xl shadow-2xl border border-white/80 overflow-hidden"
      style={{
        width: W,
        height: H,
        background:
          "linear-gradient(180deg,#fdf6ee 0%,#f5ede2 60%,#eef6f0 100%)",
      }}
    >
      {/* Empty state */}
      {count === 0 && (
        <div className="absolute inset-3 rounded-2xl border-2 border-dashed border-rose-200/70 flex items-center justify-center text-center px-6">
          <p className="font-serif text-rose-400/80 text-lg leading-snug">
            Add flowers to begin 🌱
          </p>
        </div>
      )}

      {/* Stems + leaves */}
      {count > 0 && (
        <svg
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 1,
            overflow: "visible",
          }}
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
        >
          {blooms.map(
            ({ bx, by, sc }, i) => {
              // LOWER stem origin
const flower = blooms[i]?.flower;

const attach =
  STEM_ATTACH[flower?.id || "rose"] ?? 28;

const p0: Pt = [
  bx,
  by + attach * sc,
];

              const p3: Pt = [gx, gy];

              const p1: Pt = [
                bx + (gx - bx) * 0.15,
                by + (gy - by) * 0.35,
              ];

              const p2: Pt = [
                bx + (gx - bx) * 0.65,
                by + (gy - by) * 0.78,
              ];

              const leafA = bezierPt(
                p0,
                p1,
                p2,
                p3,
                0.35
              );

              const tanA = bezierTan(
                p0,
                p1,
                p2,
                p3,
                0.35
              );

              const lenA =
                Math.sqrt(
                  tanA[0] * tanA[0] +
                    tanA[1] * tanA[1]
                ) || 1;

              const leafB = bezierPt(
                p0,
                p1,
                p2,
                p3,
                0.58
              );

              const tanB = bezierTan(
                p0,
                p1,
                p2,
                p3,
                0.58
              );

              const lenB =
                Math.sqrt(
                  tanB[0] * tanB[0] +
                    tanB[1] * tanB[1]
                ) || 1;

              return (
                <g key={i}>
                  {/* Stem */}
                  <path
                    d={`
                      M ${p0[0]} ${p0[1]}
                      C ${p1[0]} ${p1[1]},
                        ${p2[0]} ${p2[1]},
                        ${p3[0]} ${p3[1]}
                    `}
                    stroke="#3d6b45"
                    strokeWidth={Math.max(
                      2,
                      3.2 * sc
                    )}
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Leaf 1 */}
                  <path
                    d={leafPath(
                      leafA[0],
                      leafA[1],
                      tanA[0] / lenA,
                      tanA[1] / lenA,
                      i % 2 === 0 ? -1 : 1,
                      sc * 0.9
                    )}
                    fill="#4f7f57"
                  />

                  {/* Leaf 2 */}
                  <path
                    d={leafPath(
                      leafB[0],
                      leafB[1],
                      tanB[0] / lenB,
                      tanB[1] / lenB,
                      i % 2 === 0 ? 1 : -1,
                      sc * 0.75
                    )}
                    fill="#5b8d63"
                  />
                </g>
              );
            }
          )}

          {/* Ribbon */}
          <rect
            x={gx - 18}
            y={gy - 4}
            width={36}
            height={26}
            rx={3}
            fill={wc}
          />

          <rect
            x={gx - 4}
            y={gy - 4}
            width={8}
            height={26}
            fill={wdk}
          />

          <path
            d={`
              M${gx - 18},${gy + 10}
              C${gx - 32},${gy}
              ${gx - 40},${gy - 8}
              ${gx - 28},${gy - 14}
              C${gx - 16},${gy - 20}
              ${gx - 6},${gy - 4}
              ${gx},${gy + 2}
            `}
            fill={wlt}
          />

          <path
            d={`
              M${gx + 18},${gy + 10}
              C${gx + 32},${gy}
              ${gx + 40},${gy - 8}
              ${gx + 28},${gy - 14}
              C${gx + 16},${gy - 20}
              ${gx + 6},${gy - 4}
              ${gx},${gy + 2}
            `}
            fill={wlt}
          />

          <circle
            cx={gx}
            cy={gy + 2}
            r={5}
            fill={wdk}
          />
        </svg>
      )}

      {/* Flowers */}
      {blooms
        .sort(
          (a, b) =>
            a.rawScale - b.rawScale
        )
        .map(
          (
            {
              bx,
              by,
              sc,
              tilt,
              flower,
              rawScale,
            },
            i
          ) => {
            if (!flower) return null;

            const renderer =
              RENDERERS[flower.id];

            if (!renderer) return null;

            const uid = `${flower.id}${i}${flower.color.replace(
              "#",
              ""
            )}`;

            const svg = renderer(
              flower.color,
              uid
            );

            const motionProps = animate
              ? {
                  initial: {
                    opacity: 0,
                    scale: 0.4,
                  },
                  animate: {
                    opacity: 1,
                    scale: 1,
                  },
                  transition: {
                    delay: i * 0.2,
                    duration: 0.5,
                    ease:
                      "easeOut" as const,
                  },
                }
              : {};

            return (
              <Wrapper
                key={`${i}-${flower.id}`}
                {...motionProps}
                style={{
                  position: "absolute",
                  left: bx,
                  top: by,

                transform: `translate(-50%, -50%)`,
                  transformOrigin:
                    "center center",

                  zIndex:
                    Math.round(
                      rawScale * 100
                    ) + 5,

                  overflow: "visible",

                  pointerEvents: "none",
                }}
              >
<div
  style={{
    transform: `
      scale(${sc})
      rotate(${tilt}deg)
    `,
    transformOrigin: "center center",

    width: 180,
    height: 220,

    overflow: "hidden",
  }}
  dangerouslySetInnerHTML={{
    __html: svg,
  }}
                />
              </Wrapper>
            );
          }
        )}
    </div>
  );
}