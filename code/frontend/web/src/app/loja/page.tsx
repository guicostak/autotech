"use client";

import Navbar from "@/components/Navbar";
import MenuLateral from "@/components/MenuLateral";
import FormularioDadosJuridicosVendedor from "@/components/FormularioDadosJuridicosVendedor";
import FormularioEnderecoVendedor from "@/components/FormularioEnderecoVendedor";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import withAuth from "@/common/auth/Hok/withAuth";

function Loja() {
    return (
    <body className="bg-mainBackground font-sans flex flex-col">
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
  
      <div className="bg-mainBackground h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 overflow-auto">
          <MenuLateral />
          <main className="flex-1 p-4 w-full h-full flex flex-col items-center justify-start py-10 pb-20 overflow-y-auto"> 
          <div className=" w-full px-56">
              <h1 className="text-4xl mb-2 text-left text-mainColor">Minha loja</h1>
              <h2 className="text-md mb-6 text-left font-light text-gray-500">Configure os dados da sua loja</h2>
          </div>
          <FormularioDadosJuridicosVendedor />
          <FormularioEnderecoVendedor />
          </main>
        </div>
      </div>
    </body>
  );
}

export default withAuth(Loja)