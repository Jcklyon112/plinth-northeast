import { useEffect, useRef, useState } from "react";
import AnimatedSection from "./AnimatedSection";
import type { PlinthModel } from "@/data/models";

interface Props {
  model: PlinthModel;
  showDivider?: boolean;
}

const ALLOWED_SPECS = ["FOOTPRINT", "CEILING HEIGHT", "BEDROOMS", "BATHROOMS", "KITCHEN"];

const SLIDE_MS = 5000;

export default function ModelDetailSection({ model, showDivider = false }: Props) {
  const images = [model.image, ...model.gallery];
  const specs = model.specs.filter((s) => ALLOWED_SPECS.includes(s.label));

  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1
  const [paused, setPaused] = useState(false);
  const startRef = useRef<number>(performance.now());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = performance.now();
    setProgress(0);

    const tick = (now: number) => {
      if (!paused) {
        const elapsed = now - startRef.current;
        const p = Math.min(elapsed / SLIDE_MS, 1);
        setProgress(p);
        if (p >= 1) {
          setIdx((i) => (i + 1) % images.length);
          return;
        }
      } else {
        // keep start aligned with current progress while paused
        startRef.current = now - progress * SLIDE_MS;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, paused, images.length]);

  const goTo = (i: number) => {
    setIdx(i);
  };

  const secondsLeft = Math.max(0, Math.ceil((SLIDE_MS * (1 - progress)) / 1000));

  return (
    <>
      {showDivider && (
        <div className="content-max">
          <hr className="border-border" />
        </div>
      )}

      <AnimatedSection className="section-light py-16 md:py-20">
        <div className="content-max flex flex-col gap-10 md:gap-14">
          {/* Auto-advancing carousel */}
          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="relative aspect-[21/9] overflow-hidden bg-muted">
              {images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${model.title} ${i + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                    i === idx ? "opacity-100" : "opacity-0"
                  }`}
                  loading="lazy"
                />
              ))}

              {/* Countdown */}
              <div className="absolute top-3 right-3 small-label bg-background/80 text-foreground px-2 py-1">
                {secondsLeft}s
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex gap-1.5 mt-3">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className="flex-1 h-0.5 bg-border relative overflow-hidden"
                >
                  <span
                    className="absolute inset-y-0 left-0 bg-foreground"
                    style={{
                      width:
                        i < idx ? "100%" : i === idx ? `${progress * 100}%` : "0%",
                      transition: i === idx ? "none" : "width 0.2s linear",
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Variant labels */}
            <div className="flex gap-6 md:gap-10 mt-3">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="flex-1 text-left"
                >
                  <span
                    className={`small-label transition-colors ${
                      i === idx ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")} VARIANT {i}-000
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="small-label text-muted-foreground mb-3">MODEL {model.number}</p>
            <h2
              className="display-heading text-foreground mb-2"
              style={{ fontSize: "clamp(28px, 3.4vw, 44px)" }}
            >
              {model.title}
            </h2>
            <p className="small-label text-muted-foreground mb-1">{model.specLine}</p>
            <p
              className="display-heading text-foreground mb-8"
              style={{ fontSize: "clamp(28px, 3.4vw, 44px)" }}
            >
              {model.price}
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {model.description}
            </p>

            <div className="mb-8">
              <p className="small-label text-muted-foreground mb-3">SPECIFICATIONS</p>
              <div className="space-y-0">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex flex-col sm:flex-row sm:justify-between py-2.5 border-b border-border"
                  >
                    <span className="small-label text-muted-foreground">{spec.label}</span>
                    <span className="text-sm text-foreground mt-0.5 sm:mt-0">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="small-label text-muted-foreground mb-3">PRICING</p>
              <div className="space-y-0">
                {model.pricing.map((item) => (
                  <div
                    key={item.label}
                    className={`flex flex-col sm:flex-row sm:justify-between py-2.5 border-b border-border ${
                      item.emphasized ? "py-3.5" : ""
                    }`}
                  >
                    <span className="small-label text-muted-foreground">{item.label}</span>
                    <span
                      className={`mt-0.5 sm:mt-0 ${
                        item.emphasized
                          ? "display-heading text-base text-foreground"
                          : "text-sm text-foreground"
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="/#contact"
              className="small-label bg-primary text-primary-foreground px-6 py-3 hover:bg-accent transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] inline-block"
            >
              Start permitting
            </a>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
