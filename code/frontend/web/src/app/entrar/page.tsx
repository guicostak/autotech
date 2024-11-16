"use client";
import { usePathname } from "next/navigation"
import FormularioLogin from "@/components/FormularioLogin";
import Navbar from "@/components/Navbar";
import { useAppSelector } from "@/store/store";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function Entrar() {
  const { isLoggedIn } = useAppSelector((state) => state.user); 
  const pathname = usePathname()
  const isOnAuthPage = pathname === '/cadastro' || pathname === '/entrar';
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');    
    }
  }, [isLoggedIn, router]);
  
  return (
    <div className="bg-mainBackground pb-10 min-h-screen">
      <Navbar isOnAuthPage={isOnAuthPage}  />
      <FormularioLogin />
    </div>
  );
}
