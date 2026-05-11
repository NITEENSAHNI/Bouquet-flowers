import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  BouquetCanvas,
  type BouquetFlower,
} from "./BouquetCanvas";
import { GiftTag } from "./GiftTag";

interface Props {
  flowers: BouquetFlower[];
  toName: string;
  fromName: string;
  occasion: string;
  message: string;
  onReset: () => void;
}

export function SendStep(p: Props) {
  const [link, setLink] =
    useState<string | null>(null);

  const [copied, setCopied] =
    useState(false);

  const generate = async () => {
    try {
      const payload = {
        flowers: p.flowers,
        toName: p.toName,
        fromName: p.fromName,
        occasion: p.occasion,
        message: p.message,
      };

      const res = await fetch(
        "/api/bouquet",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(
          data.error || "Failed"
        );
      }

      setLink(data.url);
    } catch (err) {
      console.error(err);

      alert(
        "Failed to create bouquet link"
      );
    }
  };

  const copy = async () => {
    if (!link) return;

    await navigator.clipboard.writeText(
      link
    );

    setCopied(true);

    setTimeout(
      () => setCopied(false),
      1800
    );
  };

  if (!link) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl bg-white/60 backdrop-blur-sm border border-white/80 p-5 shadow-sm space-y-3">
          <h2 className="font-serif text-xl text-stone-800">
            Almost there
          </h2>

          <div className="text-sm text-stone-700 space-y-1">
            <p>
              <span className="text-muted-foreground">
                To:
              </span>{" "}
              {p.toName || "—"}
            </p>

            {p.fromName && (
              <p>
                <span className="text-muted-foreground">
                  From:
                </span>{" "}
                {p.fromName}
              </p>
            )}

            <p>
              <span className="text-muted-foreground">
                Bouquet:
              </span>{" "}
              {p.flowers.length} flower
              {p.flowers.length !== 1
                ? "s"
                : ""}
            </p>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
     <Button
  onClick={() => {
    console.log("BUTTON CLICKED");
    generate();
  }}
            disabled={
              !p.toName.trim() ||
              p.flowers.length === 0
            }
            className="w-full h-12 text-base rounded-full shadow-lg"
          >
            Generate bouquet link 🌸
          </Button>
        </motion.div>
      </div>
    );
  }

  const waText = encodeURIComponent(
    `A bouquet for you 🌸 ${link}`
  );

  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="font-serif text-2xl text-stone-800">
          Your bouquet is ready ✨
        </p>

        <p className="text-sm text-muted-foreground mt-1">
          Share the link below —
          flowers bloom on arrival.
        </p>
      </div>

      <div className="flex justify-center">
        <BouquetCanvas
          flowers={p.flowers}
        />
      </div>

      <GiftTag
        toName={p.toName}
        fromName={p.fromName}
        occasion={p.occasion}
        message={p.message}
      />

      <div className="rounded-2xl bg-white/70 border border-white p-3 flex items-center gap-2 shadow-sm">
        <input
          readOnly
          value={link}
          className="flex-1 bg-transparent text-xs text-stone-600 outline-none truncate"
        />

        <Button
          onClick={copy}
          size="sm"
          className="rounded-full"
        >
          {copied
            ? "✓ Copied!"
            : "Copy link"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <a
          href={`https://wa.me/?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center h-10 rounded-full bg-emerald-500 text-white text-sm font-medium shadow hover:bg-emerald-600 transition-colors"
        >
          Share via WhatsApp
        </a>

        <Button
          variant="outline"
          onClick={p.onReset}
          className="rounded-full"
        >
          Make another
        </Button>
      </div>
    </div>
  );
}