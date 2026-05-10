import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BouquetCanvas, type BouquetFlower } from "@/components/pixel-bouquet/BouquetCanvas";
import { FlowerPicker } from "@/components/pixel-bouquet/FlowerPicker";
import { ArrangeStep } from "@/components/pixel-bouquet/ArrangeStep";
import { MessageStep } from "@/components/pixel-bouquet/MessageStep";
import { SendStep } from "@/components/pixel-bouquet/SendStep";
import { ReceivedView } from "@/components/pixel-bouquet/ReceivedView";
import { StepProgress } from "@/components/pixel-bouquet/StepProgress";
import { decodeBouquet, type BouquetState } from "@/lib/pixel-bouquet/encode";
import { FLOWERS } from "@/lib/pixel-bouquet/flowers";

export const Route = createFileRoute("/")({
  component: Index,
});

type View = "loading" | "builder" | "received" | "broken";

function Index() {
  const [view, setView] = useState<View>("loading");
  const [received, setReceived] = useState<BouquetState | null>(null);

  const [step, setStep] = useState(1);
  const [flowers, setFlowers] = useState<BouquetFlower[]>([]);
  const [toName, setToName] = useState("");
  const [fromName, setFromName] = useState("");
  const [occasion, setOccasion] = useState("justbecause");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) {
      setView("builder");
      return;
    }
    const decoded = decodeBouquet(hash);
    if (decoded && decoded.flowers.length > 0) {
      setReceived(decoded);
      setView("received");
    } else {
      setView("broken");
    }
  }, []);

  const reset = () => {
    window.history.replaceState(null, "", window.location.pathname);
    setReceived(null);
    setStep(1);
    setFlowers([]);
    setToName("");
    setFromName("");
    setOccasion("justbecause");
    setMessage("");
    setView("builder");
  };

  const addFlower = (id: string) => {
    if (flowers.length >= 6) return;
    const def = FLOWERS.find((f) => f.id === id)!;
    const existing = flowers.find((f) => f.id === id);
    setFlowers([...flowers, { id, color: existing?.color || def.colors[0] }]);
  };
  const removeFlower = (id: string) => {
    const idx = [...flowers].reverse().findIndex((f) => f.id === id);
    if (idx === -1) return;
    const realIdx = flowers.length - 1 - idx;
    setFlowers(flowers.filter((_, i) => i !== realIdx));
  };
  const setColor = (id: string, color: string) => {
    setFlowers(flowers.map((f) => (f.id === id ? { ...f, color } : f)));
  };

  const canNext = useMemo(() => {
    if (step === 1) return flowers.length > 0;
    if (step === 3) return toName.trim().length > 0;
    return true;
  }, [step, flowers.length, toName]);

  if (view === "loading") {
    return <div className="min-h-screen" />;
  }

  if (view === "received" && received) {
    return <ReceivedView bouquet={received} onReset={reset} />;
  }

  if (view === "broken") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-sm text-center rounded-3xl bg-white/70 backdrop-blur-sm border border-white/80 p-8 shadow-xl">
          <p className="text-5xl">🥀</p>
          <h1 className="font-serif text-2xl mt-4 text-stone-800">
            This bouquet link seems broken
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            But you can craft a brand new one — it only takes a minute.
          </p>
          <Button
            onClick={reset}
            className="mt-5 rounded-full h-11 px-6 shadow-lg"
          >
            Make a new bouquet 🌸
          </Button>
        </div>
      </div>
    );
  }

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="min-h-screen pb-28 md:pb-12">
      <header className="px-6 pt-8 pb-4 text-center md:text-left max-w-5xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl text-stone-800">
          Pixel Bouquet
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Hand-craft a bouquet, send a little joy.
        </p>
      </header>

      <div className="max-w-5xl mx-auto px-6 grid gap-8 md:grid-cols-[300px_1fr]">
        {/* Canvas column */}
        <div className="md:sticky md:top-6 md:self-start flex justify-center">
          <div key={`canvas-${flowers.length}`} className="animate-fade-in">
            <BouquetCanvas flowers={flowers} size={step === 2 ? "lg" : "sm"} />
          </div>
        </div>

        {/* Controls column */}
        <div className="space-y-6 max-w-[520px] w-full mx-auto md:mx-0">
          <StepProgress step={step} />

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 && (
                  <FlowerPicker
                    flowers={flowers}
                    onAdd={addFlower}
                    onRemove={removeFlower}
                    onColorChange={setColor}
                  />
                )}
                {step === 2 && <ArrangeStep flowers={flowers} />}
                {step === 3 && (
                  <MessageStep
                    toName={toName}
                    fromName={fromName}
                    occasion={occasion}
                    message={message}
                    setToName={setToName}
                    setFromName={setFromName}
                    setOccasion={setOccasion}
                    setMessage={setMessage}
                  />
                )}
                {step === 4 && (
                  <SendStep
                    flowers={flowers}
                    toName={toName}
                    fromName={fromName}
                    occasion={occasion}
                    message={message}
                    onReset={reset}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {step < 4 && (
            <div className="hidden md:flex gap-2 justify-end pt-2">
              {step > 1 && (
                <Button variant="outline" onClick={back} className="rounded-full">
                  Back
                </Button>
              )}
              <Button
                onClick={next}
                disabled={!canNext}
                className="rounded-full px-6 shadow-md"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile fixed nav */}
      {step < 4 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 px-4 py-3 bg-white/80 backdrop-blur-md border-t border-white/80 flex gap-2 z-30">
          {step > 1 && (
            <Button variant="outline" onClick={back} className="rounded-full flex-1">
              Back
            </Button>
          )}
          <Button
            onClick={next}
            disabled={!canNext}
            className="rounded-full flex-[2] shadow-md"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
