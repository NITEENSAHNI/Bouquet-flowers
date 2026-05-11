import { motion } from "framer-motion";
import { OCCASIONS } from "@/lib/pixel-bouquet/flowers";

interface Props {
  toName: string;
  fromName: string;
  occasion: string;
  message: string;
}

export function GiftTag({
  toName,
  fromName,
  occasion,
  message,
}: Props) {
  const occ = OCCASIONS.find(
    (o) => o.id === occasion
  );

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
        rotate: -2,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: -1,
      }}
      transition={{
        duration: 0.8,
      }}
      className="relative overflow-hidden rounded-[28px] border border-[#ead9b7] px-7 py-6 shadow-[0_15px_50px_rgba(0,0,0,0.08)]"
      style={{
        background:
          "linear-gradient(180deg, #fffaf0 0%, #f7ecd8 100%)",
      }}
    >
      {/* paper grain */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#000 0.5px, transparent 0.5px)",
          backgroundSize: "12px 12px",
        }}
      />

      {/* tape */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-3deg]">
        <div className="w-20 h-6 bg-[#f8e7a7]/70 border border-[#ead48c]/60 shadow-sm backdrop-blur-sm" />
      </div>

      {/* occasion */}
      {occ && (
        <p className="font-serif text-sm tracking-wide text-[#9c7d4d] mb-3">
          {occ.label}
        </p>
      )}

      {/* recipient */}
      <p className="font-serif text-3xl text-stone-800 leading-tight">
        For{" "}
        <span className="text-[color:var(--primary)]">
          {toName || "you"}
        </span>
      </p>

      {/* message */}
      {message && (
        <p
          className="mt-5 text-[22px] text-stone-700 leading-relaxed whitespace-pre-wrap"
          style={{
            fontFamily: "'Caveat', cursive",
          }}
        >
          “{message}”
        </p>
      )}

      {/* signature */}
      {fromName && (
        <div className="mt-7 text-right">
          <p className="text-sm text-stone-500 mb-1">
            with love,
          </p>

          <p
            className="text-3xl text-stone-700"
            style={{
              fontFamily: "'Caveat', cursive",
            }}
          >
            {fromName}
          </p>
        </div>
      )}

      {/* subtle pressed corner */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-full h-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.15), transparent 60%)",
            clipPath:
              "polygon(100% 0%, 0% 0%, 100% 100%)",
          }}
        />
      </div>
    </motion.div>
  );
}