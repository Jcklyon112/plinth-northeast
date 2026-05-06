import { useState, useRef } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import ContactForm from "@/components/ContactForm";
import ModelModal from "@/components/ModelModal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { models, type PlinthModel } from "@/data/models";
import heroImage from "@/assets/hero-home.jpg";
import factoryImage from "@/assets/factory.jpg";

export default function Index() {
  const [selectedModel, setSelectedModel] = useState<PlinthModel | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const scrollCarousel = (dir: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const cardWidth = el.children[0]?.clientWidth ?? 0;
    const gap = 24;
    const newIndex = Math.max(0, Math.min(2, carouselIndex + dir));
    el.scrollTo({ left: newIndex * (cardWidth + gap), behavior: "smooth" });
    setCarouselIndex(newIndex);
  };

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="relative h-screen min-h-[600px]">
        <img
          src={heroImage}
          alt="Plinth accessory dwelling unit"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 pb-24 md:pb-32">
          <p className="mono-label text-muted-foreground mb-4">ACCESSORY HOMES · NORTHEAST US</p>
          <h1 className="display-heading text-foreground mb-4" style={{ fontSize: "clamp(56px, 10vw, 144px)" }}>
            A foundation for<br />what comes next.
          </h1>
          <p className="text-lg text-muted-foreground mb-8">Three models. Built to order.</p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#lineup"
              className="mono-label bg-primary text-primary-foreground px-6 py-3 hover:bg-accent hover:text-accent-foreground transition-colors inline-block"
            >
              Explore Models
            </a>
            <a
              href="#contact"
              className="mono-label border border-foreground text-foreground px-6 py-3 hover:border-accent hover:text-accent transition-colors inline-block"
            >
              Check My Property
            </a>
          </div>
        </div>
        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-px h-8 bg-muted-foreground/40 animate-pulse" />
        </div>
      </section>

      {/* MISSION */}
      <AnimatedSection className="section-light section-padding">
        <div className="content-max max-w-[800px] mx-auto text-center">
          <p className="mono-label mb-8" style={{ color: "hsl(var(--light-muted))" }}>WHY PLINTH</p>
          <h2
            className="display-heading"
            style={{
              fontSize: "clamp(40px, 6vw, 80px)",
              color: "hsl(var(--light-fg))",
              lineHeight: 1.1,
            }}
          >
            America has a housing problem. The fastest way to grow the value of property you already own is to put another home on it.
          </h2>
        </div>
      </AnimatedSection>

      {/* PROCESS */}
      <AnimatedSection className="section-dark section-padding">
        <div className="content-max">
          <p className="mono-label text-muted-foreground mb-4">01 — HOW IT WORKS</p>
          <h2 className="display-heading text-3xl md:text-5xl text-foreground mb-16">
            Four steps. No surprises.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {[
              { n: "01", title: "PICK YOUR UNIT", desc: "Choose from three signature models. Lock pricing and finishes in one conversation." },
              { n: "02", title: "FAST-TRACK PERMITTING", desc: "Sign up for our managed permit service. We handle municipal applications, zoning compliance, and approvals end to end. Priced separately." },
              { n: "03", title: "BUILT IN-FACTORY", desc: "Your unit is manufactured at our partner facility in upstate New York. Quality-controlled, built indoors." },
              { n: "04", title: "DELIVERED ON-SITE", desc: "Delivered fully built within months. We coordinate site preparation and final connections." },
            ].map((step) => (
              <div key={step.n}>
                <p className="mono-label text-accent mb-3">{step.n}</p>
                <p className="mono-label text-foreground mb-3">{step.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <p className="mono-label text-muted-foreground text-center mt-16">
            TYPICAL TIMELINE — 22 TO 28 WEEKS
          </p>
        </div>
      </AnimatedSection>

      {/* MODEL LINEUP */}
      <section id="lineup" className="section-dark section-padding">
        <div className="content-max">
          <AnimatedSection>
            <p className="mono-label text-muted-foreground mb-4">02 — THE LINEUP</p>
            <h2 className="display-heading text-3xl md:text-5xl text-foreground mb-6">
              Three models. Not three hundred.
            </h2>
            <p className="reading-column text-muted-foreground mb-12">
              We don't sell custom designs. We sell three models we believe in — refined over time with our manufacturer, priced honestly, and engineered for the lots and the climates of the Northeast.
            </p>
          </AnimatedSection>

          {/* Carousel */}
          <div className="relative">
            <div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              onScroll={(e) => {
                const el = e.currentTarget;
                const cardWidth = el.children[0]?.clientWidth ?? 1;
                setCarouselIndex(Math.round(el.scrollLeft / (cardWidth + 24)));
              }}
            >
              {models.map((model) => (
                <div
                  key={model.id}
                  className="snap-start shrink-0 cursor-pointer group"
                  style={{ width: "min(80vw, 900px)", height: "70vh", minHeight: "500px" }}
                  onClick={() => setSelectedModel(model)}
                >
                  <div className="relative w-full h-full overflow-hidden bg-secondary">
                    <img
                      src={model.image}
                      alt={model.title}
                      className="absolute inset-0 w-full h-[65%] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-secondary p-6 md:p-8 flex flex-col justify-center">
                      <p className="mono-label text-muted-foreground mb-2">MODEL {model.number}</p>
                      <h3 className="display-heading text-xl md:text-2xl text-foreground mb-2">{model.title}</h3>
                      <p className="mono-label text-muted-foreground mb-2">{model.specLine}</p>
                      <p className="display-heading text-base text-foreground mb-3">{model.price}</p>
                      <p className="mono-label text-muted-foreground group-hover:text-accent transition-colors">
                        View Details →
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop arrows */}
            <button
              onClick={() => scrollCarousel(-1)}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 items-center justify-center bg-secondary/80 text-foreground hover:text-accent transition-colors"
              aria-label="Previous"
            >
              ←
            </button>
            <button
              onClick={() => scrollCarousel(1)}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 items-center justify-center bg-secondary/80 text-foreground hover:text-accent transition-colors"
              aria-label="Next"
            >
              →
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-3 mt-6">
              {models.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === carouselIndex ? "bg-foreground" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <AnimatedSection className="section-dark section-padding">
        <div className="content-max">
          <p className="mono-label text-muted-foreground mb-4">03 — APPROACH</p>
          <h2 className="display-heading text-3xl md:text-5xl text-foreground mb-16">
            Designed for the Northeast.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              { title: "BUILT FOR THE CLIMATE", desc: "Insulation, roofing, and structural specs are engineered for Northeast winters and humidity. Not a Sun Belt design dropped into Long Island." },
              { title: "FAST-TRACK PERMITTING", desc: "Our managed permitting service moves applications through municipal review faster than DIY. Available as an add-on for clients who want everything handled." },
              { title: "PRICED HONESTLY", desc: "We publish starting prices. We tell you what's included and what's not. We give you a full cost picture before you commit." },
            ].map((item) => (
              <div key={item.title}>
                <p className="mono-label text-foreground mb-4">{item.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* MANUFACTURING */}
      <AnimatedSection className="section-light section-padding">
        <div className="content-max">
          <p className="mono-label mb-4" style={{ color: "hsl(var(--light-muted))" }}>MANUFACTURING</p>
          <h2 className="display-heading text-3xl md:text-5xl mb-8" style={{ color: "hsl(var(--light-fg))" }}>
            Made in New York.
          </h2>
          <p className="reading-column text-base leading-relaxed mb-12" style={{ color: "hsl(var(--light-muted))" }}>
            Every Plinth unit is built at our manufacturer's facility in upstate New York. Factory conditions, controlled materials, and a quality standard that doesn't exist on a typical job site. Then delivered, fully built, to your property.
          </p>
          <div className="aspect-[16/9] overflow-hidden">
            <img src={factoryImage} alt="Plinth manufacturing facility" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </AnimatedSection>

      {/* CONTACT */}
      <section id="contact" className="section-contact section-padding">
        <div className="content-max max-w-[540px] mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="display-heading text-3xl md:text-5xl text-foreground mb-4">
              See what's possible on your lot.
            </h2>
            <p className="text-muted-foreground">
              Send us your address. We'll send back a brief assessment within 48 hours.
            </p>
          </AnimatedSection>
          <ContactForm />
        </div>
      </section>

      <Footer />

      {selectedModel && (
        <ModelModal model={selectedModel} onClose={() => setSelectedModel(null)} />
      )}
    </>
  );
}
