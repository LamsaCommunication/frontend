import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { OfferingsSection } from "@/components/sections/offerings-section";
import { EtapesSection } from "@/components/sections/etape-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <OfferingsSection key="offerings" />
        <EtapesSection key="etapes" />
        <ContactSection key="contact" />
      </main>
      <Footer />
    </>
  );
}
