import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { OCCASIONS } from "@/lib/pixel-bouquet/flowers";
import { GiftTag } from "./GiftTag";

interface Props {
  toName: string;
  fromName: string;
  occasion: string;
  message: string;
  setToName: (v: string) => void;
  setFromName: (v: string) => void;
  setOccasion: (v: string) => void;
  setMessage: (v: string) => void;
}

export function MessageStep(p: Props) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            To <span className="text-[color:var(--primary)]">*</span>
          </label>
          <Input
            value={p.toName}
            onChange={(e) => p.setToName(e.target.value)}
            placeholder="Their name"
            className="mt-1 bg-white/70"
          />
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            From
          </label>
          <Input
            value={p.fromName}
            onChange={(e) => p.setFromName(e.target.value)}
            placeholder="Your name"
            className="mt-1 bg-white/70"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Occasion
        </label>
        <div className="flex flex-wrap gap-2 mt-2">
          {OCCASIONS.map((o) => {
            const active = p.occasion === o.id;
            return (
              <motion.button
                key={o.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => p.setOccasion(o.id)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                  active
                    ? "bg-[color:var(--primary)] text-white border-transparent shadow"
                    : "bg-white/70 border-white text-stone-700 hover:shadow-sm"
                }`}
              >
                {o.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex justify-between">
          <span>Message</span>
          <span className={p.message.length > 180 ? "text-[color:var(--primary)]" : ""}>
            {p.message.length}/200
          </span>
        </label>
        <Textarea
          value={p.message}
          onChange={(e) => p.setMessage(e.target.value.slice(0, 200))}
          placeholder="A few words from the heart…"
          className="mt-1 bg-white/70 min-h-[100px] font-serif"
        />
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
          Live preview
        </p>
        <GiftTag
          toName={p.toName}
          fromName={p.fromName}
          occasion={p.occasion}
          message={p.message}
        />
      </div>
    </div>
  );
}