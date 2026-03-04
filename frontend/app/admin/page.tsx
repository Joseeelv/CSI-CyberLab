import React from "react";

import Header from "@/components/header";
import AdminPanel from "@/components/admin";
import { Footer } from "@/components/footer";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <AdminPanel />
      <Footer />
    </div>
  );
}
