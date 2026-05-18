import { useState } from "react";
import AnimatedSection from "./AnimatedSection";
import type { PlinthModel } from "@/data/models";

interface Props {
  model: PlinthModel;
  showDivider?: boolean;
}

export default function ModelDetailSection({ model, showDivider = false }: Props) {
  const images = [model.image, ...model.gallery];
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <>
      {showDivider && (
        <div className="content-max">
          <hr className="border-border" />
        </div>
      )}

      <AnimatedSection className="section-light py-16 md:py-20">
        <div className="content-max flex flex-col gap-10 md:gap-14">
          {/* Carousel */}
          <div className="relative">
            <div className="relative aspect-[21/9] overflow-hidden bg-muted">
              <img
                src={images[idx]}
                alt={`${model.title} ${idx + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-background/80 hover:bg-background text-foreground transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="9,2 3,7 9,12" />
                    </svg>
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-background/80 hover:bg-background text-foreground transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="5,2 11,7 5,12" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    aria-label={`Go to image ${i + 1}`}
                    className={`h-1 flex-1 transition-colors ${i === idx ? "bg-foreground" : "bg-border"}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <p className="small-label text-muted-foreground mb-3">MODEL {model.number}</p>
            <h2 className="display-heading text-foreground mb-2" style={{ fontSize: "clamp(28px, 3.4vw, 44px)" }}>
              {model.title}
            </h2>
            <p className="small-label text-muted-foreground mb-1">{model.specLine}</p>
            <p className="display-heading text-foreground mb-8" style={{ fontSize: "clamp(28px, 3.4vw, 44px)" }}>
              {model.price}
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {model.description}
            </p>

            <div className="mb-8">
              <p className="small-label text-muted-foreground mb-3">SPECIFICATIONS</p>
              <div className="space-y-0">
                {model.specs.map((spec) => (
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
