
import { IAnuncio } from "@/interfaces/IAnuncio";
import { getAnuncioById } from "@/services/anuncioService";
import { useState } from "react";
import { NextRouter } from "next/router";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const useVerAnuncioDetalhado = (router: AppRouterInstance) => {
  const [anuncio, setAnuncio] = useState<IAnuncio | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getAnuncioByIdHook = async (anuncioId: number) => {
    setLoading(true);
    try {
      const response = await getAnuncioById(anuncioId);
      setAnuncio(response);
    } catch (err) {
      console.log(err)
      router.push("/anuncionaoencontrado");
    } finally {
      setTimeout(() => {
        setLoading(false); 
      }, 400)
    }
  };

  return {
    getAnuncioByIdHook,
    anuncio,
    loading,
  };
};
