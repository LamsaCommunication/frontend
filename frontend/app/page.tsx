import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";

const OfferingsSection = dynamic(() =>
  import("@/components/sections/offerings-section").then((m) => m.OfferingsSection)
);
const EtapesSection = dynamic(() =>
  import("@/components/sections/etape-section").then((m) => m.EtapesSection)
);
const ContactSection = dynamic(() =>
  import("@/components/sections/contact-section").then((m) => m.ContactSection)
);

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <OfferingsSection />
        <EtapesSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
