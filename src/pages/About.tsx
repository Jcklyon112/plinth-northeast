import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import factoryImage from "@/assets/factory.jpg";
import founderImage from "@/assets/founder.jpg";

export default function About() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="section-light pt-32 md:pt-40 py-24 md:py-40">
        <div className="content-max">
          <AnimatedSection>
            <p className="small-label text-muted-foreground mb-6">ABOUT PLINTH</p>
            <h1 className="display-heading text-foreground mb-8" style={{ fontSize: "clamp(40px, 7vw, 96px)" }}>
              A regional builder.<br />By design.
            </h1>
            <p className="reading-column text-muted-foreground text-lg leading-relaxed">
              Plinth designs and delivers accessory homes for the Northeast US. We manage the entire process — permitting, manufacturing, delivery — so you don't have to.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <hr className="border-border mx-6 md:mx-12" />

      {/* The company */}
      <AnimatedSection className="section-light py-24 md:py-40">
        <div className="content-max reading-column">
          <p className="text-muted-foreground leading-relaxed mb-8">
            We exist because the alternatives don't work for most people. Custom architecture and a ground-up build takes 18 to 24 months and costs two to three times what a factory-built unit costs. Generic prefab is cheap but doesn't fit the lots, the towns, or the aesthetic of this region.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Plinth is the middle path: real design, factory quality, regional fit, predictable timeline. We work in the markets where ADUs are actually being approved, with a process designed to remove the unknowns that derail most residential construction projects.
          </p>
        </div>
      </AnimatedSection>

      {/* Manufacturing */}
      <section className="section-dark">
        <AnimatedSection className="py-24 md:py-40">
          <div className="content-max">
            <p className="small-label mb-6" style={{ color: "hsl(var(--dark-muted))" }}>MANUFACTURING</p>
            <h2 className="display-heading text-3xl md:text-5xl mb-8" style={{ color: "hsl(var(--dark-fg))" }}>
              Made in New York.
            </h2>
            <p className="reading-column text-base leading-relaxed mb-12" style={{ color: "hsl(var(--dark-muted))" }}>
              Every Plinth unit is built at our manufacturer's facility in upstate New York. Factory conditions, controlled materials, and a quality standard that doesn't exist on a typical job site. Then delivered, fully built, to your property.
            </p>
            <div className="aspect-[16/9] overflow-hidden">
              <img src={factoryImage} alt="Plinth manufacturing facility" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Founder */}
      <AnimatedSection className="section-light py-24 md:py-40">
        <div className="content-max">
          <p className="small-label text-muted-foreground mb-10">FOUNDER</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div className="aspect-square overflow-hidden max-w-[480px]">
              <img src={founderImage} alt="Founder" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="reading-column">
              <p className="text-muted-foreground leading-relaxed mb-6">
                I started Plinth because I watched too many people spend two years and half a million dollars trying to add a small home to their property. The process was broken — not because the idea was bad, but because the path to getting it done was designed for custom construction, not for something that should be straightforward.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The hardest part was never building the unit. It was getting through permitting. That's why we built Plinth around that problem first.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                If you're thinking about adding a home to your property, send us your address. We'll tell you honestly whether it makes sense.
              </p>
              <p className="display-heading text-foreground text-lg mt-8">— James Whitfield</p>
              <p className="small-label text-muted-foreground mt-2">FOUNDER, PLINTH</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <hr className="border-border mx-6 md:mx-12" />

      {/* Service area */}
      <AnimatedSection className="section-light py-24 md:py-40">
        <div className="content-max">
          <p className="small-label text-muted-foreground mb-6">WHERE WE WORK</p>
          <h2 className="display-heading text-3xl md:text-5xl text-foreground mb-8">
            The Northeast US.
          </h2>
          <div className="reading-column">
            <p className="text-muted-foreground leading-relaxed mb-6">
              We currently serve the Northeast US, with active projects across Long Island, the Hamptons, the Connecticut shoreline, the Hudson Valley, and select markets in Vermont and New Hampshire.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If your property falls outside our active region, send us your address anyway. We'll tell you honestly whether we can serve you.
            </p>
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </>
  );
}
