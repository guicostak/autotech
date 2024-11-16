"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import FormularioCriarAnuncio from "@/components/FormularioCriarAnuncio"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import withAuth from "@/common/auth/Hok/withAuth";

function CriarAnuncio() {
  const router = useRouter();

  return (
    <body className="bg-mainBackground min-h-screen font-sans flex flex-col">
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
      <FormularioCriarAnuncio router={router} />
    </body>
  );
}


export default withAuth(CriarAnuncio);