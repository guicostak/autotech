"use client";
import FormularioCadastro from "@/components/FormularioCadastro";
import Navbar from "@/components/Navbar";
import { useAppSelector } from "@/store/store";
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react";

export default function Cadastro() {
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
    <div className="bg-mainBackground h-auto pb-10 min-h-screen">
            <Navbar isOnAuthPage={isOnAuthPage} />
      <FormularioCadastro />
    </div>
  );
}
