import { useEffect, useRef, useState } from "react";
import AnimatedSection from "./AnimatedSection";
import type { PlinthModel } from "@/data/models";

interface Props {
  model: PlinthModel;
  showDivider?: boolean;
}

const ALLOWED_SPECS = ["FOOTPRINT", "CEILING HEIGHT", "BEDROOMS", "BATHROOMS", "KITCHEN"];

export default function ModelDetailSection({ model, showDivider = false }: Props) {
  const images = [model.image, ...model.gallery];
  const specs = model.specs.filter((s) => ALLOWED_SPECS.includes(s.label));

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      setIdx(i);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <>
      {showDivider && (
        <div className="content-max">
          <hr className="border-border" />
        </div>
      )}

      <AnimatedSection className="section-light py-16 md:py-20">
        <div className="content-max flex flex-col gap-10 md:gap-14">
          {/* Scroll-snap carousel */}
          <div className="relative">
            <div
              ref={scrollerRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide aspect-[21/9] bg-muted"
              style={{ scrollbarWidth: "none" }}
            >
              {images.map((src, i) => (
                <div key={i} className="relative shrink-0 w-full h-full snap-start">
                  <img
                    src={src}
                    alt={`${model.title} ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            {/* Variant tabs */}
            <div className="flex gap-6 md:gap-10 mt-4 border-t border-border pt-3">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="flex-1 text-left group"
                  aria-label={`Go to image ${i + 1}`}
                >
                  <div
                    className={`h-px -mt-3 mb-3 transition-colors ${
                      i === idx ? "bg-foreground" : "bg-transparent"
                    }`}
                  />
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
