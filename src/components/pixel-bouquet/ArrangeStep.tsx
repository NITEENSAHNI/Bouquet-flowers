import { FLOWERS } from "@/lib/pixel-bouquet/flowers";
import type { BouquetFlower } from "./BouquetCanvas";

export function ArrangeStep({ flowers }: { flowers: BouquetFlower[] }) {
  const uniqueIds = [...new Set(flowers.map((f) => f.id))];
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-serif text-2xl text-stone-800">Your bouquet</h2>
        <p className="text-sm text-muted-foreground mt-1">
          A quiet moment to read what each bloom whispers.
        </p>
      </div>
      <div className="rounded-2xl bg-white/60 backdrop-blur-sm border border-white/80 p-5 shadow-sm">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">
          Meanings
        </p>
        <ul className="space-y-2">
          {uniqueIds.map((id) => {
            const f = FLOWERS.find((x) => x.id === id)!;
            return (
              <li key={id} className="flex justify-between items-baseline gap-3">
                <span className="font-serif text-stone-800">{f.name}</span>
                <span className="text-sm text-muted-foreground italic text-right">
                  {f.meaning}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}