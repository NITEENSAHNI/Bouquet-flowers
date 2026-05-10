import { motion } from "framer-motion";
import { LAYOUTS } from "@/lib/pixel-bouquet/layout";
import { RENDERERS } from "@/lib/pixel-bouquet/flowers";
import { Ribbon } from "./Ribbon";

export interface BouquetFlower {
  id: string;
  color: string;
}

interface Props {
  flowers: BouquetFlower[];
  size?: "sm" | "lg";
  animate?: boolean;
}

export function BouquetCanvas({ flowers, size = "sm", animate = false }: Props) {
  const dims = size === "lg"
    ? { w: 360, h: 420, fw: 130, fh: 160, scale: 0.722 }
    : { w: 260, h: 300, fw: 90, fh: 110, scale: 0.5 };

  const count = Math.min(flowers.length, 6);
  const layout = LAYOUTS[count] || [];

  return (
    <div
      className="relative rounded-3xl shadow-2xl border border-white/80 overflow-hidden"
      style={{
        width: dims.w,
        height: dims.h,
        background:
          "linear-gradient(180deg, #fdf6ee 0%, #f5ede2 55%, #eef6f0 100%)",
      }}
    >
      {flowers.length === 0 && (
        <div className="absolute inset-3 rounded-2xl border-2 border-dashed border-rose-200/70 flex items-center justify-center text-center px-6">
          <p className="font-serif text-rose-400/80 text-lg leading-snug">
            Add flowers to begin 🌱
          </p>
        </div>
      )}

      {flowers.slice(0, 6).map((f, i) => {
        const [xPct, yPct] = layout[i] || [50, 30];
        // xPct is left-edge offset for a flower of width fw within the canvas in %
        const left = (xPct / 100) * (dims.w - dims.fw);
        const top = (yPct / 100) * (dims.h - dims.fh - 60);
        const renderer = RENDERERS[f.id];
        if (!renderer) return null;
        const uid = `${f.id}-${i}-${f.color.replace("#", "")}`;
        const svg = renderer(f.color, uid);

        const Wrapper = animate ? motion.div : "div";
        const motionProps = animate
          ? {
              initial: { opacity: 0, scale: 0.6, y: 10 },
              animate: { opacity: 1, scale: 1, y: 0 },
              transition: { delay: i * 0.3, duration: 0.55, ease: "easeOut" as const },
            }
          : {};

        return (
          <Wrapper
            key={`${i}-${f.id}-${f.color}`}
            {...motionProps}
            style={{
              position: "absolute",
              left,
              top,
              width: dims.fw,
              height: dims.fh,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                transform: `scale(${dims.scale})`,
                transformOrigin: "top left",
                width: 180,
                height: 220,
              }}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </Wrapper>
        );
      })}

      {count > 0 && <Ribbon count={count} />}
    </div>
  );
}