"use client";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CardsRecomendados from "@/components/CardsRecomendados";
import Footer from "@/components/Footer";
import { ListaItensCarrinho } from "@/components/ListaItensCarrinho";
import { TotalCarrinho } from "@/components/TotalCarrinho";
import { IitemCarrinho } from "@/interfaces/IitemCarrinho";
import useCarrinhoDeCompras from "@/hooks/useCarrinhoDeCompras";

export default function Loja() {
  const { isLoggedIn } = useAppSelector((state) => state.user); 
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/entrar');    
    }
  }, [isLoggedIn, router]);

  const { getListaItens } = useCarrinhoDeCompras();
  const anuncios: IitemCarrinho[] = getListaItens();

  return (
    <div className="bg-mainBackground font-sans flex flex-col min-h-screen">
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
      <main className="flex-grow w-full px-24 mt-10 pb-10">
          <h1 className="text-4xl mb-2 text-left text-mainColor">Meu carrinho</h1>
          <h2 className="text-md mb-2 text-left font-light text-gray-500">Adicione itens ao seu carrinho de compras</h2>
          {anuncios.length > 0 ? (
            <div className="flex flex-row space-x-20 mb-10">
              <ListaItensCarrinho />
              <TotalCarrinho />
            </div>
          ) : (
            <div className="mt-10 mb-20">
              <p className="font-extralight text-gray-400">Nenhum item no carrinho.</p>
            </div>
          )}
          <CardsRecomendados />
      </main>
      <Footer />
    </div>
  );
}
