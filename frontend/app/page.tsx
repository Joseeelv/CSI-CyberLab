import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
// import { Stats } from "@/components/stats";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
    <Header />
      <main >
        <section>
          <Hero />
        </section>
        <section>

          <Features />
        </section>
        <section>

          <CTA />
        </section>

        <section>
          <Footer />
        </section>

      </main>
    </div>
  );
}
