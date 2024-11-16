"use client";
import Navbar from "@/components/Navbar";
import { useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useParams } from "next/navigation"
import AnuncioDoProdutoDetalhado from "@/components/AnuncioDoProdutoDetalhado";

export default function VerAnuncio() {
  const { isLoggedIn } = useAppSelector((state) => state.user);
  const router = useRouter();
  const { idAnuncio } = useParams<{ idAnuncio: string}>(); 

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/entrar");
    }
  }, [isLoggedIn, router]);
  
  return (
    <body className="min-h-screen bg-mainBackground">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
     
      <Navbar />
      <AnuncioDoProdutoDetalhado router={router} idAnuncio={Number(idAnuncio)} />
    </body>
  );
}
