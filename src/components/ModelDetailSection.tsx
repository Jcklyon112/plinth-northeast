import AnimatedSection from "./AnimatedSection";
import type { PlinthModel } from "@/data/models";

interface Props {
  model: PlinthModel;
  showDivider?: boolean;
}

export default function ModelDetailSection({ model, showDivider = false }: Props) {
  return (
    <>
      {showDivider && (
        <div className="content-max">
          <hr className="border-border" />
        </div>
      )}

      {/* Section A: Hero */}
      <div className="relative h-[70vh] min-h-[400px]">
        <img src={model.image} alt={model.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16">
          <p className="mono-label text-muted-foreground mb-3">MODEL {model.number}</p>
          <h2 className="display-heading text-4xl md:text-6xl text-foreground mb-3">{model.title}</h2>
          <p className="mono-label text-muted-foreground mb-2">{model.specLine}</p>
          <p className="display-heading text-xl text-foreground">{model.price}</p>
        </div>
      </div>

      {/* Section B: Description */}
      <AnimatedSection className="section-dark section-padding">
        <div className="content-max">
          <p className="reading-column mx-auto text-center text-lg text-muted-foreground leading-relaxed">
            {model.description}
          </p>
        </div>
      </AnimatedSection>

      {/* Section C: Specifications */}
      <AnimatedSection className="section-light section-padding">
        <div className="content-max max-w-[800px] mx-auto">
          <p className="mono-label mb-10" style={{ color: "hsl(var(--light-muted))" }}>SPECIFICATIONS</p>
          <div className="space-y-0">
            {model.specs.map((spec) => (
              <div key={spec.label} className="flex flex-col md:flex-row md:justify-between py-4 border-b" style={{ borderColor: "hsl(var(--light-border))" }}>
                <span className="mono-label" style={{ color: "hsl(var(--light-muted))" }}>{spec.label}</span>
                <span className="text-sm mt-1 md:mt-0" style={{ color: "hsl(var(--light-fg))" }}>{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Section D: Pricing */}
      <AnimatedSection className="section-dark section-padding">
        <div className="content-max max-w-[800px] mx-auto">
          <p className="mono-label text-muted-foreground mb-10">PRICING</p>
          <div className="space-y-0">
            {model.pricing.map((item) => (
              <div key={item.label} className={`flex flex-col md:flex-row md:justify-between py-4 border-b border-border ${item.emphasized ? "py-6" : ""}`}>
                <span className="mono-label text-muted-foreground">{item.label}</span>
                <span className={`mt-1 md:mt-0 ${item.emphasized ? "display-heading text-xl text-foreground" : "text-sm text-foreground"}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Section E: Gallery */}
      <div className="section-dark py-8 md:py-16">
        <div className="content-max">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {model.gallery.map((img, i) => (
              <div key={i} className="aspect-[4/3] overflow-hidden">
                <img src={img} alt={`${model.title} gallery ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section F: CTA */}
      <AnimatedSection className="section-dark section-padding text-center">
        <div className="content-max">
          <h3 className="display-heading text-2xl md:text-4xl text-foreground mb-8">
            Reserve a consultation for {model.title}
          </h3>
          <a
            href="/#contact"
            className="mono-label bg-primary text-primary-foreground px-8 py-3 hover:bg-accent hover:text-accent-foreground transition-colors inline-block"
          >
            Get in touch
          </a>
        </div>
      </AnimatedSection>
    </>
  );
}
