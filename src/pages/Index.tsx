import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Terminal } from "@/components/Terminal";
import { TrustedBy } from "@/components/TrustedBy";
import { Features } from "@/components/Features";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Terminal />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
