import { OCCASIONS } from "@/lib/pixel-bouquet/flowers";

interface Props {
  toName: string;
  fromName: string;
  occasion: string;
  message: string;
}

export function GiftTag({ toName, fromName, occasion, message }: Props) {
  const occ = OCCASIONS.find((o) => o.id === occasion);
  return (
    <div
      className="relative rounded-2xl border border-amber-200/70 px-6 py-5 shadow-sm"
      style={{
        background:
          "linear-gradient(180deg, #fdf6e3 0%, #f7ecd1 100%)",
      }}
    >
      <div className="absolute -top-2 left-6 w-3 h-3 rounded-full bg-amber-700/40 shadow-inner" />
      {occ && (
        <p className="font-serif text-sm text-amber-800/80 mb-2">{occ.label}</p>
      )}
      <p className="font-serif text-xl text-stone-800">
        To <span className="text-[color:var(--primary)]">{toName || "…"}</span>
      </p>
      {message && (
        <p className="mt-3 font-serif italic text-stone-700 leading-relaxed whitespace-pre-wrap">
          “{message}”
        </p>
      )}
      {fromName && (
        <p className="mt-3 font-serif text-right text-stone-700">
          — with love, {fromName}
        </p>
      )}
    </div>
  );
}