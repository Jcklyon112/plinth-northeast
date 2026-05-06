import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ModelDetailSection from "@/components/ModelDetailSection";
import AnimatedSection from "@/components/AnimatedSection";
import { models } from "@/data/models";

export default function Models() {
  return (
    <>
      <Navbar />

      {/* Page header */}
      <section className="section-dark pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="content-max">
          <AnimatedSection>
            <p className="mono-label text-muted-foreground mb-4">THE LINEUP</p>
            <h1 className="display-heading text-foreground mb-6" style={{ fontSize: "clamp(40px, 7vw, 96px)" }}>
              Three models. Built to order.
            </h1>
            <p className="reading-column text-muted-foreground">
              Three signature designs, refined with our manufacturer over time. Choose one, lock the price, and we'll handle the rest.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {models.map((model, i) => (
        <ModelDetailSection key={model.id} model={model} showDivider={i > 0} />
      ))}

      <Footer />
    </>
  );
}
