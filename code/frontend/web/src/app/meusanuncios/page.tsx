"use client";

import Navbar from "@/components/Navbar";
import MenuLateral from "@/components/MenuLateral";
import 'react-toastify/dist/ReactToastify.css';
import MeuAnuncio from "@/components/MeuAnuncio";
import { ToastContainer } from "react-toastify";
import { useMeusAnuncios } from "@/hooks/useMeusAnuncios"; 
import withAuth from "@/common/auth/Hok/withAuth";

function MeusAnuncios() {
  const { meusAnuncios } = useMeusAnuncios();

  return (
    <body className="bg-mainBackground h-screen flex flex-col">
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
      <div className="flex flex-1 overflow-auto">
        <MenuLateral />
        <main className="flex-1 p-4 w-full h-full flex flex-col items-center justify-start py-10 pb-20 overflow-y-auto gap-y-6"> 
        <div className=" w-full px-24">
              <h1 className="text-4xl mb-2 text-left text-mainColor">Meus anúncios</h1>
              <h2 className="text-md mb-6 text-left font-light text-gray-500">Gerencie seus anúncios</h2>
          </div>
        {meusAnuncios.length > 0 && meusAnuncios.map((anuncio: any) => (
            <MeuAnuncio
              key={anuncio.id}
              id={anuncio.id}
              titulo={anuncio.titulo}
              preco={anuncio.preco}
              quantidadeProdutos={anuncio.quantidadeProdutos}
              ativo={anuncio.ativo}
              dataCriacao={anuncio.dataCriacao}
              descricao={anuncio.descricao}
              imagem={anuncio.imagem}
            />
          ))}
        </main>
      </div>
    </body>
  );
}

export default withAuth(MeusAnuncios);