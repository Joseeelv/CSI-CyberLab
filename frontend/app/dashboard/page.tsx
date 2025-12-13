import Dashboard from "@/components/dashboard";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header/>
      <main>
        <section>
          <Dashboard />
        </section>
      </main>
      <Footer />
    </div>
  );
}