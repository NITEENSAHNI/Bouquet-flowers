import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BouquetCanvas } from "./BouquetCanvas";
import { GiftTag } from "./GiftTag";
import { FLOWERS, OCCASIONS } from "@/lib/pixel-bouquet/flowers";
import type { BouquetState } from "@/lib/pixel-bouquet/encode";

export function ReceivedView({
  bouquet,
  onReset,
}: {
  bouquet: BouquetState;
  onReset: () => void;
}) {
  const uniqueIds = [...new Set(bouquet.flowers.map((f) => f.id))];
  const occ = OCCASIONS.find((o) => o.id === bouquet.occasion);

  return (
    <div className="min-h-screen px-6 py-10 flex flex-col items-center">
      <ConfettiBurst />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          A bouquet for
        </p>
        <h1 className="font-serif text-4xl text-stone-800 mt-1">
          {bouquet.toName || "you"}
        </h1>
        {occ && (
          <span className="inline-block mt-3 px-3 py-1 rounded-full bg-white/70 border border-white text-sm shadow-sm">
            {occ.label}
          </span>
        )}
      </motion.div>

      <BouquetCanvas flowers={bouquet.flowers} size="lg" animate />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: bouquet.flowers.length * 0.3 + 0.2, duration: 0.6 }}
        className="w-full max-w-md mt-8 space-y-5"
      >
        {(bouquet.message || bouquet.fromName) && (
          <GiftTag
            toName={bouquet.toName}
            fromName={bouquet.fromName}
            occasion={bouquet.occasion}
            message={bouquet.message}
          />
        )}
        <div className="rounded-2xl bg-white/60 backdrop-blur-sm border border-white/80 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">
            What these flowers mean
          </p>
          <ul className="space-y-2">
            {uniqueIds.map((id) => {
              const f = FLOWERS.find((x) => x.id === id);
              if (!f) return null;
              return (
                <li
                  key={id}
                  className="flex justify-between items-baseline gap-3"
                >
                  <span className="font-serif text-stone-800">{f.name}</span>
                  <span className="text-sm text-muted-foreground italic">
                    {f.meaning}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <Button
          onClick={onReset}
          className="w-full h-12 rounded-full text-base shadow-lg"
        >
          Send one back 🌸
        </Button>
      </motion.div>
    </div>
  );
}

function ConfettiBurst() {
  const pieces = Array.from({ length: 24 });
  const colors = ["#d4727a", "#c9972a", "#9b8ec4", "#7a9e7e", "#e87890"];
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {pieces.map((_, i) => (
        <motion.span
          key={i}
          initial={{ y: -20, x: `${(i / pieces.length) * 100}%`, opacity: 0 }}
          animate={{ y: "110vh", opacity: [0, 1, 1, 0], rotate: 360 }}
          transition={{
            duration: 4 + (i % 4),
            delay: i * 0.08,
            ease: "easeIn",
          }}
          className="absolute w-2 h-2 rounded-sm"
          style={{ background: colors[i % colors.length] }}
        />
      ))}
    </div>
  );
}