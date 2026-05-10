import { motion } from "framer-motion";
import { FLOWERS } from "@/lib/pixel-bouquet/flowers";
import type { BouquetFlower } from "./BouquetCanvas";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  flowers: BouquetFlower[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
}

export function FlowerPicker({ flowers, onAdd, onRemove, onColorChange }: Props) {
  const full = flowers.length >= 6;
  const counts = flowers.reduce<Record<string, number>>((acc, f) => {
    acc[f.id] = (acc[f.id] || 0) + 1;
    return acc;
  }, {});
  const uniqueIds = [...new Set(flowers.map((f) => f.id))];
  const colorByFlower = uniqueIds.reduce<Record<string, string>>((acc, id) => {
    acc[id] = flowers.find((f) => f.id === id)!.color;
    return acc;
  }, {});

  return (
    <TooltipProvider>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          {FLOWERS.map((f) => {
            const count = counts[f.id] || 0;
            const added = count > 0;
            const disabled = full && !added;
            const card = (
              <motion.button
                whileHover={!disabled ? { scale: 1.02 } : undefined}
                whileTap={!disabled ? { scale: 0.98 } : undefined}
                disabled={disabled}
                onClick={() => !disabled && onAdd(f.id)}
                className={`relative w-full text-left rounded-2xl p-4 border shadow-sm transition-all ${
                  added
                    ? "bg-rose-50 border-rose-200"
                    : "bg-white/70 border-white hover:shadow-md"
                } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[color:var(--primary)] text-white text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center shadow">
                    {count}
                  </span>
                )}
                <p className="font-serif text-lg text-stone-800">{f.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.meaning}</p>
                <div className="flex gap-1.5 mt-3">
                  {f.colors.slice(0, 4).map((c) => (
                    <span
                      key={c}
                      className="w-4 h-4 rounded-full border border-white/80 shadow-sm"
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </motion.button>
            );
            return disabled ? (
              <Tooltip key={f.id}>
                <TooltipTrigger asChild>
                  <div>{card}</div>
                </TooltipTrigger>
                <TooltipContent>Bouquet full!</TooltipContent>
              </Tooltip>
            ) : (
              <div key={f.id}>{card}</div>
            );
          })}
        </div>

        {uniqueIds.length > 0 && (
          <div className="rounded-2xl bg-white/60 backdrop-blur-sm border border-white/80 p-4 space-y-3 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Color & remove
            </p>
            {uniqueIds.map((id) => {
              const def = FLOWERS.find((f) => f.id === id)!;
              const current = colorByFlower[id];
              return (
                <div key={id} className="flex items-center gap-3">
                  <span className="font-serif w-20 text-stone-700">{def.name}</span>
                  <div className="flex gap-1.5 flex-1">
                    {def.colors.map((c) => (
                      <motion.button
                        key={c}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => onColorChange(id, c)}
                        className={`w-6 h-6 rounded-full border transition-shadow ${
                          current === c
                            ? "ring-2 ring-offset-2 ring-[color:var(--primary)] shadow-md"
                            : "border-white/80 shadow-sm"
                        }`}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => onRemove(id)}
                    className="text-xs text-muted-foreground hover:text-[color:var(--primary)] transition-colors"
                  >
                    remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}