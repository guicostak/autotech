'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contatos from "@/components/Contatos";

export default function QuemSomos() {
  return (
    <div className="bg-mainBackground h-auto">
      <Navbar />
      <Contatos />
      <Footer />
    </div>
  );
}
