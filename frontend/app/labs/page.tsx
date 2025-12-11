import { Footer } from '@/components/footer';
import { HeaderSwitcher } from '@/components/headerSwitcher';
import { LabComponent } from '@/components/lab';

export default function LabsPage(){
  return(
    <div className="min-h-screen flex flex-col bg-black">
      <HeaderSwitcher />
      <main>
        <section>
          <LabComponent />
        </section>
      </main>
      <Footer />
    </div>
  );
}