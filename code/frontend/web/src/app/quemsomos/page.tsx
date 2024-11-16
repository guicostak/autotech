'use client';

import Navbar from "@/components/Navbar";
import Quemsomos from "@/components/Quemsomos";
import Footer from "@/components/Footer";

export default function QuemSomos() {
  return (
    <div className="bg-mainBackground h-auto">
      <Navbar />
      <Quemsomos />
      <Footer />
    </div>
  );
}
