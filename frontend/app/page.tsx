import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
// import { Stats } from "@/components/stats";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";
import HeaderSwitcher from "@/components/headerSwitcher";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <HeaderSwitcher />
      <main >
        <Hero />
        <Features />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
