import Dashboard from "@/components/dashboard";
import { Footer } from "@/components/footer";
import HeaderAuth from "@/components/authHeader";
export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <HeaderAuth/>
      <main>
        <section>
          <Dashboard />
        </section>
      </main>
      <Footer />
    </div>
  );
}