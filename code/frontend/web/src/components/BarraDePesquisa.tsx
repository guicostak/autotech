import React, { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Botao from "./Botao";
import { useAnuncios } from "@/hooks/useAnuncios";
import { useSearchParams } from "next/navigation";

export default function BarraDePesquisa() {
  const { handleValorPesquisadoChange, filtros, handleFiltroChange, handleEnterPress, handlePesquisarButton } = useAnuncios(); 

  const searchParams = useSearchParams();

     useEffect(() => {
      const valorPesquisado = searchParams.get('valorPesquisado') || "";
      console.log(valorPesquisado);

      handleFiltroChange({ valorPesquisado }); 
  }, [searchParams]); 

  return (
    <div className="bg-white h-8 flex items-center pl-2 justify-end border-none rounded-xl w-64 pr-1 text-sm">
      <input
        type="text"
        value={filtros.valorPesquisado}
        onChange={handleValorPesquisadoChange}
        onKeyPress={handleEnterPress}
        placeholder="Digite o valor para pesquisa"
        className="w-full outline-none"
      />
      <Botao className="p-0" onClick={handlePesquisarButton}>
        <FontAwesomeIcon className="text-mainColor cursor-pointer" icon={faSearch} />
      </Botao>
    </div>
  );
}
