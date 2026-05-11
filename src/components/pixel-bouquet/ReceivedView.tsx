import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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
  const [opened, setOpened] = useState(false);
  const occ = OCCASIONS.find((o) => o.id === bouquet.occasion);

  return (
  <div className="min-h-screen px-6 py-10 flex flex-col items-center relative overflow-hidden">
    {/* dreamy background glow */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(circle at top, rgba(255,255,255,0.7), transparent 45%)",
      }}
    />

    <AnimatePresence mode="wait">
      {!opened ? (
        <motion.div
          key="closed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center min-h-[80vh] text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 0.45,
            }}
            transition={{ duration: 1.2 }}
            className="blur-[3px]"
          >
            <BouquetCanvas
              flowers={bouquet.flowers}
              size="lg"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-stone-600 font-serif text-xl"
          >
            A bouquet was made for you
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setOpened(true)}
            className="mt-6 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-white shadow-lg font-medium text-stone-700"
          >
            Open bouquet ✨
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          key="opened"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full flex flex-col items-center"
        >
          <ConfettiBurst />

          {/* header */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-8"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
              A bouquet for
            </p>

            <h1 className="font-serif text-5xl text-stone-800 mt-3">
              {bouquet.toName || "you"}
            </h1>

            {occ && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="inline-block mt-5 px-4 py-1.5 rounded-full bg-white/70 border border-white text-sm shadow-sm"
              >
                {occ.label}
              </motion.span>
            )}
          </motion.div>

          {/* bouquet reveal */}
          <motion.div
            initial={{
              opacity: 0,
              y: 50,
              scale: 0.88,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
          >
            <BouquetCanvas
              flowers={bouquet.flowers}
              size="lg"
              animate
            />
          </motion.div>

          {/* card reveal */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.9,
              duration: 0.8,
            }}
            className="w-full max-w-md mt-10 space-y-5"
          >
            {(bouquet.message || bouquet.fromName) && (
              <motion.div
                initial={{ rotate: -1.5 }}
                animate={{ rotate: -1 }}
                transition={{
                  duration: 2,
                }}
              >
                <GiftTag
                  toName={bouquet.toName}
                  fromName={bouquet.fromName}
                  occasion={bouquet.occasion}
                  message={bouquet.message}
                />
              </motion.div>
            )}

            <div className="rounded-3xl bg-[#fffaf2]/80 backdrop-blur-md border border-[#f2dfb2] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
              <p className="text-xs uppercase tracking-[0.25em] text-stone-500 font-medium mb-4">
                What these flowers mean
              </p>

              <ul className="space-y-3">
                {uniqueIds.map((id) => {
                  const f = FLOWERS.find(
                    (x) => x.id === id
                  );

                  if (!f) return null;

                  return (
                    <motion.li
                      key={id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 1.2,
                      }}
                      className="flex justify-between items-baseline gap-3"
                    >
                      <span className="font-serif text-stone-800 text-lg">
                        {f.name}
                      </span>

                      <span className="text-sm text-stone-500 italic">
                        {f.meaning}
                      </span>
                    </motion.li>
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
        </motion.div>
      )}
    </AnimatePresence>
  </div>
  );
}
function ConfettiBurst() {
  const pieces = Array.from({ length: 24 });

  const colors = [
    "#d4727a",
    "#c9972a",
    "#9b8ec4",
    "#7a9e7e",
    "#e87890",
  ];

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {pieces.map((_, i) => (
        <motion.span
          key={i}
          initial={{
            y: -20,
            x: `${(i / pieces.length) * 100}%`,
            opacity: 0,
          }}
          animate={{
            y: "110vh",
            opacity: [0, 1, 1, 0],
            rotate: 360,
          }}
          transition={{
            duration: 4 + (i % 4),
            delay: i * 0.08,
            ease: "easeIn",
          }}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            background:
              colors[i % colors.length],
          }}
        />
      ))}
    </div>
  );
}