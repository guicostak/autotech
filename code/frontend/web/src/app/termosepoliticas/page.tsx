"use client";

import Termos from "@/components/Termos";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation"; 

export default function TermosEPoliticas() {

    const pathname = usePathname();
    const isOnAuthPage = pathname === '/cadastro' || pathname === '/entrar'; 

    return (
      <div className="bg-mainBackground pb-10 min-h-screen">
        <Navbar isOnAuthPage={isOnAuthPage}/> 
        <Termos />
        <Footer />
      </div>
    );
}
