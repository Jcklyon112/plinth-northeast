import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import UnlockYardSection from "@/components/UnlockYardSection";
import ContactForm from "@/components/ContactForm";
import ModelModal from "@/components/ModelModal";
import { models } from "@/data/models";
import heroHeader from "@/assets/hero-header.png";
import backyardImg from "@/assets/backyard-deployment.png";
import clusterImg from "@/assets/cluster-deployment.png";
import backyardRender from "@/assets/backyard-render.png";
import clusterRender from "@/assets/cluster-render.png";

const BODY_TEXT = "Most homeowners never realize what their property is actually capable of. Our intelligence layer scans your parcel against zoning, setbacks, utilities, and environmental constraints — then tells you exactly what you can build, where it fits, and what it's worth. From there, we manage the entire process: permits, manufacturing, and delivery.";
const ACCENT_TEXT = "One platform, from address to dwelling.";
const ALL_WORDS = [...BODY_TEXT.split(" "), ...ACCENT_TEXT.split(" ")];
const ACCENT_START = BODY_TEXT.split(" ").length;

function ScrollRevealSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const sectionHeight = rect.height;
    const viewportHeight = window.innerHeight;
    const rawProgress = (viewportHeight - rect.top) / (sectionHeight + viewportHeight);
    setProgress(Math.max(0, Math.min(1, rawProgress)));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const totalWords = ALL_WORDS.length;

  return (
    <section ref={sectionRef} className="section-dark">
      <div className="px-6 md:px-12 py-16 md:py-24 mx-auto" style={{ maxWidth: "1400px" }}>
        <p className="small-label mb-3" style={{ color: "hsl(var(--dark-muted))" }}>*PLINTH-LABS</p>
        <h2
          className="display-heading mb-8"
          style={{
            color: "hsl(var(--dark-fg))",
            fontSize: "clamp(28px, 3.4vw, 44px)",
          }}
        >
          The Opportunity.
        </h2>
        <p
          style={{
            fontSize: "clamp(15px, 1.4vw, 19px)",
            lineHeight: 1.55,
            maxWidth: "780px",
          }}
        >
          {ALL_WORDS.map((word, i) => {
            const wordProgress = (progress - 0.15) / 0.55;
            const wordThreshold = i / totalWords;
            const isLit = wordProgress > wordThreshold;
            const isAccent = i >= ACCENT_START;

            return (
              <span
                key={i}
                style={{
                  color: isLit
                    ? isAccent
                      ? "hsl(var(--dark-muted))"
                      : "hsl(var(--dark-fg))"
                    : "hsl(var(--dark-fg) / 0.15)",
                  transition: "color 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {word}{" "}
              </span>
            );
          })}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mt-12 md:mt-16">
          {[
            { stat: "$60K+", desc: "in average annual rental income from a permitted ADU in the Northeast." },
            { stat: "30%", desc: "average property value lift from adding a permitted accessory dwelling." },
            { stat: "8M+", desc: "single-family parcels with backyard space large enough for an ADU." },
            { stat: "<48 hrs", desc: "to know whether your property qualifies — at no cost." },
          ].map((item) => (
            <div key={item.stat}>
              <p
                className="display-heading mb-2"
                style={{
                  color: "hsl(var(--dark-fg) / 0.55)",
                  fontSize: "clamp(20px, 2.4vw, 32px)",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                }}
              >
                {item.stat}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--dark-muted))" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

  );
}

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Study",
    heading: "Know What's Possible Before You Commit.",
    body: "We analyze your parcel — zoning, setbacks, utility access, and financial projections — so you have a clear picture of what can be built, what it will cost, and what it will earn. No guesswork, no surprises.",
  },
  {
    number: "02A",
    title: "Permit",
    heading: "We Handle the Part That Stops Everyone Else.",
    body: "Permitting is where most ADU projects die. Plinth manages every submission, every agency response, and every approval milestone. You never call the building department.",
    isOurs: true,
  },
  {
    number: "02B",
    title: "Build",
    heading: "Your Unit Builds While Permits Process.",
    body: "Traditional construction waits for permits. Ours doesn't. Manufacturing runs in parallel — so by the time your permit is approved, your unit is ready to ship.",
  },
  {
    number: "03",
    title: "Install",
    heading: "From Flatbed to Front Door.",
    body: "Plinth coordinates delivery, site prep, crane logistics, utility connections, and final inspections.",
  },
];

function ProcessStepsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);

  useEffect(() => {
    const computeTarget = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const total = sectionRef.current.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      targetRef.current = Math.max(0, Math.min(0.9999, scrolled / total));
    };
    const tick = () => {
      // Smooth lerp toward target for buttery transitions
      currentRef.current += (targetRef.current - currentRef.current) * 0.08;
      setProgress(currentRef.current);
      if (Math.abs(targetRef.current - currentRef.current) > 0.0002) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };
    const onScroll = () => {
      computeTarget();
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    computeTarget();
    currentRef.current = targetRef.current;
    setProgress(targetRef.current);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const stepFloat = progress * PROCESS_STEPS.length;
  const activeStep = Math.min(PROCESS_STEPS.length - 1, Math.floor(stepFloat));
  const localProgress = Math.max(0, Math.min(1, stepFloat - activeStep));

  const renderRevealBody = (heading: string, body: string) => {
    const tokens = body.split(/(\s+)/); // keep whitespace tokens
    const wordCount = tokens.filter((t) => t.trim().length > 0).length;
    // Stretch so all words finish white before the step ends
    const reveal = Math.min(1, localProgress / 0.85);
    let wIdx = -1;
    return (
      <>
        <span style={{ color: "hsl(var(--dark-fg))" }}>{heading}</span>{" "}
        {tokens.map((tok, i) => {
          if (!tok.trim()) return <span key={i}>{tok}</span>;
          wIdx++;
          const pos = wIdx / Math.max(1, wordCount - 1);
          const win = 0.2;
          const t = Math.max(0, Math.min(1, (reveal - pos + win) / win));
          const eased = t * t * (3 - 2 * t);
          const opacity = 0.18 + eased * 0.82;
          return (
            <span
              key={i}
              style={{
                color: `hsl(var(--dark-fg) / ${opacity})`,
                transition: "color 220ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {tok}
            </span>
          );
        })}
      </>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="section-dark relative"
      style={{ height: `${PROCESS_STEPS.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="px-6 md:px-12 mx-auto w-full" style={{ maxWidth: "1400px" }}>
          {/* Step headers — 4 columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {PROCESS_STEPS.map((step, i) => {
              // Distance from this step to current scroll position (0 = exact)
              const distance = Math.abs(stepFloat - i);
              // Smooth proximity 1 (this step) → 0 (far). Falls off across ~1.4 step widths
              // so adjacent headers overlap and the gray→white change is continuous.
              const proximity = Math.max(0, 1 - distance / 1.4);
              // Ease for a softer ramp (smoothstep)
              const eased = proximity * proximity * (3 - 2 * proximity);
              // Wide range: deep gray (0.08) → full white (1.0) so the change is obvious
              const opacity = 0.08 + eased * 0.92;
              return (
                <div key={step.number} className="text-left">
                  <p
                    className="display-heading mb-2"
                    style={{
                      fontSize: "clamp(28px, 4vw, 56px)",
                      color: `hsl(var(--dark-fg) / ${opacity})`,
                      fontWeight: 700,
                      transition: "color 280ms cubic-bezier(0.22, 1, 0.36, 1)",
                      willChange: "color",
                    }}
                  >
                    {step.number}
                  </p>
                  <p
                    className="display-heading"
                    style={{
                      fontSize: "clamp(22px, 3vw, 44px)",
                      color: `hsl(var(--dark-fg) / ${opacity})`,
                      fontWeight: 400,
                      transition: "color 280ms cubic-bezier(0.22, 1, 0.36, 1)",
                      willChange: "color",
                    }}
                  >
                    {step.title}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Active step content row — appears under the active column */}
          <div className="hidden md:grid grid-cols-4 gap-6 md:gap-8 mt-8">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.number}>
                {activeStep === i && (
                  <div key={`content-${i}`}>
                    <p
                      className="mb-6 leading-relaxed step-enter"
                      style={{
                        color: "hsl(var(--dark-muted))",
                        fontSize: "clamp(13px, 1.1vw, 15px)",
                      }}
                    >
                      {renderRevealBody(step.heading, step.body)}
                    </p>
                    <div
                      className="aspect-square rounded-lg overflow-hidden"
                      style={{ background: "hsl(var(--dark-fg) / 0.08)" }}
                    >
                      <div
                        className="w-full h-full flex items-center justify-center text-xs"
                        style={{ color: "hsl(var(--dark-muted))" }}
                      >
                        Step {step.number}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile: stacked content under headers */}
          <div className="md:hidden mt-8">
            <div key={`m-${activeStep}`}>
              <p
                className="mb-6 leading-relaxed step-enter"
                style={{
                  color: "hsl(var(--dark-muted))",
                  fontSize: "14px",
                }}
              >
                {renderRevealBody(PROCESS_STEPS[activeStep].heading, PROCESS_STEPS[activeStep].body)}
              </p>
              <div
                className="aspect-square rounded-lg overflow-hidden"
                style={{ background: "hsl(var(--dark-fg) / 0.08)" }}
              >
                <div
                  className="w-full h-full flex items-center justify-center text-xs"
                  style={{ color: "hsl(var(--dark-muted))" }}
                >
                  Step {PROCESS_STEPS[activeStep].number}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const backyardImages = [backyardImg, backyardRender];

function BackyardCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % backyardImages.length);
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + backyardImages.length) % backyardImages.length);

  return (
    <div className="relative w-full group">
      <div className="relative overflow-hidden bg-background">
        {/* Sizer keeps the container at the natural image aspect ratio */}
        <img
          src={backyardImages[0]}
          alt=""
          aria-hidden="true"
          className="w-full object-contain invisible"
        />
        {backyardImages.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Backyard ADU view ${i + 1}`}
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity]"
            style={{ opacity: i === currentIndex ? 1 : 0 }}
          />
        ))}
      </div>
      <h3
        className="display-heading absolute bottom-16 left-0 right-0 px-6 md:px-12 transition-colors duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ fontSize: "clamp(32px, 5vw, 64px)", color: currentIndex === 0 ? "hsl(var(--foreground))" : "#fff" }}
      >
        The Backyard
      </h3>
      {/* Navigation arrows */}
      <button
        onClick={goPrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-background/70 hover:bg-background border border-foreground/20 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 group-hover:opacity-100"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-background/70 hover:bg-background border border-foreground/20 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 group-hover:opacity-100"
        aria-label="Next image"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
      </button>
      {/* Dots indicator */}
      {backyardImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {backyardImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${i === currentIndex ? "bg-foreground" : "bg-foreground/30"}`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const clusterImages = [clusterImg, clusterRender];

function ClusterCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % clusterImages.length);
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + clusterImages.length) % clusterImages.length);

  return (
    <div className="relative w-full group">
      <div className="relative overflow-hidden bg-background">
        <img
          src={clusterImages[0]}
          alt=""
          aria-hidden="true"
          className="w-full object-contain invisible"
        />
        {clusterImages.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Cluster development view ${i + 1}`}
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity]"
            style={{ opacity: i === currentIndex ? 1 : 0 }}
          />
        ))}
      </div>
      <h3
        className="display-heading absolute bottom-16 left-0 right-0 px-6 md:px-12 transition-colors duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ fontSize: "clamp(32px, 5vw, 64px)", color: currentIndex === 0 ? "hsl(var(--foreground))" : "#fff" }}
      >
        The Cluster
      </h3>
      <button
        onClick={goPrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-background/70 hover:bg-background border border-foreground/20 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 group-hover:opacity-100"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-background/70 hover:bg-background border border-foreground/20 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 group-hover:opacity-100"
        aria-label="Next image"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
      </button>
      {clusterImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {clusterImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${i === currentIndex ? "bg-foreground" : "bg-foreground/30"}`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RivianModelScroller({ onViewDetails }: { onViewDetails: (model: typeof models[0]) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const numModels = models.length;
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollDistance = containerRef.current.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollDistance));
      targetRef.current = progress;
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
    };
    const tick = () => {
      currentRef.current += (targetRef.current - currentRef.current) * 0.06;
      const maxTranslate = (numModels - 1) * 100;
      setTranslateX(currentRef.current * maxTranslate);
      setActiveIndex(Math.min(numModels - 1, Math.floor(currentRef.current * numModels)));
      if (Math.abs(targetRef.current - currentRef.current) > 0.0002) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
    currentRef.current = targetRef.current;
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [numModels]);

  return (
    <section
      ref={containerRef}
      className="relative section-light"
      style={{ height: `${numModels * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 md:px-12 pt-16 md:pt-24 pb-6">
          <p className="small-label text-muted-foreground" style={{ letterSpacing: "0.2em" }}>THE LINEUP</p>
        </div>

        {/* Sliding models track */}
        <div className="flex-1 relative overflow-hidden">
          <div
            className="flex h-full will-change-transform"
            style={{ transform: `translateX(-${translateX}vw)`, width: `${numModels * 100}vw` }}
          >
            {models.map((model) => (
              <div
                key={model.id}
                className="flex flex-col items-center justify-start"
                style={{ width: "100vw", minWidth: "100vw" }}
              >
                {/* Big model name */}
                <div className="relative w-full flex flex-col items-center">
                  <h2
                    className="display-heading text-center select-none"
                    style={{
                      fontSize: "clamp(64px, 11vw, 170px)",
                      color: "hsl(var(--foreground))",
                      lineHeight: 1.05,
                      paddingTop: "0.18em",
                      paddingBottom: "0.04em",
                      marginTop: 0,
                      marginBottom: 0,
                      position: "relative",
                      zIndex: 0,
                      overflow: "visible",
                    }}
                  >
                    {model.title.replace("The ", "")}
                  </h2>

                  {/* Model image overlapping the bottom 1/5 of the text */}
                  <div
                    className="relative z-10 w-full flex items-end justify-center overflow-hidden"
                    style={{
                      marginTop: "-0.21em",
                      fontSize: "clamp(64px, 11vw, 170px)",
                      height: "34vh",
                    }}
                  >
                    <img
                      src={model.image}
                      alt={model.title}
                      className="block w-auto"
                      style={{ height: "100%", maxWidth: "none" }}
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Description + specs */}
                <div className="w-full px-6 md:px-12 mt-4" style={{ maxWidth: "900px" }}>
                  <p
                    className="text-center text-foreground mb-1"
                    style={{ fontSize: "clamp(14px, 1.6vw, 20px)", fontWeight: 500 }}
                  >
                    {model.description.split(".")[0]}.
                  </p>
                  <p
                    className="text-center text-muted-foreground mb-4"
                    style={{ fontSize: "clamp(12px, 1.2vw, 15px)" }}
                  >
                    {model.price} · {model.specLine}
                  </p>

                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
                    {model.specs.slice(0, 5).map((spec) => (
                      <div key={spec.label} className="text-center">
                        <p className="small-label text-muted-foreground mb-0.5">{spec.label}</p>
                        <p className="text-sm text-foreground font-medium">{spec.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center gap-4">
                    <a
                      href="/#contact"
                      className="small-label inline-block border border-foreground px-6 py-3 text-foreground hover:bg-foreground hover:text-background transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    >
                      On Your Property Now
                    </a>
                    <button
                      onClick={() => onViewDetails(model)}
                      className="small-label inline-block px-6 py-3 text-muted-foreground hover:text-foreground transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model tabs at bottom */}
        <div className="flex justify-center gap-3 pt-6 pb-10 md:pb-12 shrink-0">
          {models.map((model, i) => (
            <button
              key={model.id}
              className={`small-label px-4 py-2 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] border-b-2 ${
                i === activeIndex
                  ? "text-foreground border-foreground"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {model.title.replace("The ", "")}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Index() {
  const [modalModel, setModalModel] = useState<typeof models[0] | null>(null);

  return (
    <>
      <Navbar />
      {/* ——— HERO IMAGE ——— */}
      <section className="relative w-full" style={{ height: "100vh" }}>
        <img
          src={heroHeader}
          alt="Plinth ADU units in a forest setting"
          className="absolute -top-[16%] left-0 w-full h-[116%] object-cover"
        />
        <div className="absolute top-6 left-6 md:top-10 md:left-10 z-[60]">
          <span
            className="display-heading text-foreground"
            style={{ fontSize: "clamp(14px, 1.6vw, 20px)", letterSpacing: "0.04em" }}
          >
            *PLINTH-HOME
          </span>
        </div>
        <div className="absolute bottom-8 md:bottom-12 left-6 md:left-10 z-10 max-w-[720px]">
          <h1
            className="display-heading text-white"
            style={{
              fontSize: "clamp(52px, 9vw, 110px)",
              lineHeight: 1,
              marginBottom: "20px",
              fontWeight: 700,
            }}
          >
            Plinth-Home
          </h1>
          <p
            className="text-white/90 max-w-[640px]"
            style={{
              fontSize: "clamp(16px, 2vw, 22px)",
              lineHeight: 1.45,
              marginBottom: "28px",
              fontWeight: 500,
            }}
          >
            Your land is worth more than you think. We make adding a dwelling to it as simple as entering your address — permits, build, and delivery, all handled.
          </p>
          <a
            href="#contact"
            className="small-label inline-block text-white border border-white/60 px-6 py-3 hover:bg-white hover:text-foreground transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          >
            Feasibility study
          </a>
        </div>
      </section>

      {/* ——— SECTION 2: THE OPPORTUNITY ——— */}
      <ScrollRevealSection />
      <UnlockYardSection />

      {/* ——— SECTION 4: MODELS ——— */}
      <RivianModelScroller onViewDetails={(model) => setModalModel(model)} />

      {/* ——— SECTION 2B: TYPES OF DEPLOYMENT ——— */}
      <section className="section-light">

        {/* — The Backyard — */}
        <AnimatedSection>
          <BackyardCarousel />
          <div className="px-6 md:px-12 pt-8 pb-24 md:pb-32 mx-auto" style={{ maxWidth: "1400px" }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 items-start">
              <div>
                <p
                  className="text-foreground mb-4"
                  style={{ fontSize: "13px", lineHeight: 1.55, fontWeight: 500 }}
                >
                  For aging parents, extra income, or a recent grad priced out of their first apartment — <span style={{ fontWeight: 500, color: "hsl(var(--foreground))" }}>the answer is already in your backyard.</span>
                </p>
                <p
                  className="text-muted-foreground mb-6"
                  style={{ fontSize: "13px", lineHeight: 1.55, fontWeight: 400 }}
                >
                  Plinth's end-to-end process takes you from zoning check to move-in day.
                </p>
                <a
                  href="#contact"
                  className="small-label inline-block border-b border-foreground pb-1 text-foreground hover:text-accent hover:border-accent transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                >
                  View solutions →
                </a>
              </div>
              {[
                {
                  title: "Our Aging Parents",
                  stat: "$75K",
                  desc: "Average annual cost of assisted living. Keep loved ones close and save thousands.",
                },
                {
                  title: "The Missing Middle",
                  stat: "10M",
                  desc: "U.S. housing-unit deficit. Rent to teachers, nurses and the workers your community depends on.",
                },
                {
                  title: "A Priced-Out Generation",
                  stat: "40",
                  desc: "Average age of a first-time homebuyer. Give your recent graduate a place to land.",
                },
              ].map((item) => (
                <div key={item.stat}>
                  <p
                    className="small-label mb-3 text-muted-foreground"
                  >
                    {item.title}
                  </p>
                  <p
                    className="mb-3"
                    style={{
                      fontSize: "clamp(28px, 3.2vw, 44px)",
                      color: "hsl(var(--foreground))",
                      fontWeight: 400,
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    {item.stat}
                  </p>
                  <p style={{ fontSize: "13px", lineHeight: 1.55, color: "hsl(var(--muted-foreground))" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* — Cluster Development — */}
        <AnimatedSection delay={100}>
          <ClusterCarousel />
          <div className="px-6 md:px-12 pt-8 pb-24 md:pb-32 mx-auto" style={{ maxWidth: "1400px" }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 items-start">
              <div>
                <p
                  className="text-foreground mb-4"
                  style={{ fontSize: "13px", lineHeight: 1.55, fontWeight: 500 }}
                >
                  Group multiple units on a single parcel or across adjacent lots — <span style={{ fontWeight: 500 }}>purpose-built micro-communities at scale.</span>
                </p>
                <p
                  className="text-muted-foreground mb-6"
                  style={{ fontSize: "13px", lineHeight: 1.55, fontWeight: 400 }}
                >
                  Meet zoning, maximize density, deliver attainable housing where it's needed most.
                </p>
                <a
                  href="#contact"
                  className="small-label inline-block border-b border-foreground pb-1 text-foreground hover:text-accent hover:border-accent transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                >
                  View solutions →
                </a>
              </div>
              {[
                {
                  title: "Workforce Housing",
                  stat: "8M+",
                  desc: "Single-family parcels with space for multi-unit infill across the Northeast.",
                },
                {
                  title: "Revenue at Scale",
                  stat: "3–8×",
                  desc: "Revenue potential versus a single backyard unit when clustering dwellings.",
                },
                {
                  title: "Instant Feasibility",
                  stat: "<48h",
                  desc: "To know whether your site qualifies for cluster development — at no cost.",
                },
              ].map((item) => (
                <div key={item.stat}>
                  <p className="small-label mb-3 text-muted-foreground">{item.title}</p>
                  <p
                    className="mb-3"
                    style={{
                      fontSize: "clamp(28px, 3.2vw, 44px)",
                      color: "hsl(var(--foreground))",
                      fontWeight: 400,
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    {item.stat}
                  </p>
                  <p style={{ fontSize: "13px", lineHeight: 1.55, color: "hsl(var(--muted-foreground))" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ——— SECTION 3: HOW IT WORKS ——— */}
      <ProcessStepsSection />

      {/* ——— SECTION 5: CONTACT ——— */}

      {/* ——— SECTION 8: CONTACT ——— */}
      <section id="contact" className="section-dark">
        <div className="content-max py-24 md:py-40">
          <div className="max-w-[560px]">
            <AnimatedSection>
              <h2 className="display-heading mb-4" style={{ color: "hsl(var(--dark-fg))", fontSize: "clamp(32px, 5vw, 48px)" }}>
                Tell us about your property.
              </h2>
              <p className="mb-12" style={{ color: "hsl(var(--dark-muted))" }}>
                We'll come back within 48 hours with what's possible.
              </p>
            </AnimatedSection>
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />

      {modalModel && (
        <ModelModal model={modalModel} onClose={() => setModalModel(null)} />
      )}
    </>
  );
}
