"use client";

import { useAnuncios } from "@/hooks/useAnuncios";
import CardAnuncio from "@/components/CardAnuncio";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IFiltros } from "@/interfaces/IFiltros";
import LoadingDots from "@/utils/loading/LoadingDots";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Botao from "@/components/Botao";
import PaginatedSquares from "@/components/PaginatedSquares";

export default function Anuncios() {
  const searchParams = useSearchParams();
  const {
    anuncios,
    totalDeResultados,
    handleFiltroChange,
    optionsCategoria,
    handleOrderChange,
    montarUrlComFiltros,
    filtros,
    getAnunciosPorFiltros,
    setFiltros,
    getOrdenacaoString,
    setValorPesquisado,
    removeFiltro,
    optionsMarcas,
    formatarNomeFiltro,
    loading,
    limparFiltros,
    totalPages,
    handleSizeChange
  } = useAnuncios();

  useEffect(() => {
    const valorPesquisado = searchParams.get("valorPesquisado") || "";
    const categoria = searchParams.get("categoria") || "";
    const precoMin = searchParams.get("precoMin") || "";
    const precoMax = searchParams.get("precoMax") || "";
    const marca = searchParams.get("marca") || "";
    const modelo = searchParams.get("modelo") || "";
    const anoFabricacao = searchParams.get("anoFabricacao") || "";
    const campoOrdenacao = searchParams.get("campoOrdenacao") || "dataCriacao";
    const ordenacao = searchParams.get("ordenacao") || "desc";
    const tipoAnuncio = searchParams.get("tipoAnuncio") || "";
    const page = searchParams.get("page") || "";
    const size = searchParams.get("size") || "";

    const novosFiltros: IFiltros = {
      valorPesquisado,
      categoria,
      precoMin,
      precoMax,
      marca,
      modelo,
      anoFabricacao,
      campoOrdenacao,
      ordenacao,
      tipoAnuncio,
      page,
      size,
    };
    setValorPesquisado(valorPesquisado);

    setFiltros(novosFiltros);
    getAnunciosPorFiltros(novosFiltros);
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const novaUrl = montarUrlComFiltros();
      const urlAtual = window.location.href;
      console.log(filtros);
      if (novaUrl !== urlAtual) {
        window.history.pushState({}, "", novaUrl);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [filtros]);

  const [tipoAnuncio, setTipoAnuncio] = useState("");

  const handleTipoAnuncioChange = (tipo: string) => {
    setTipoAnuncio(tipo);
    handleFiltroChange({ tipoAnuncio: tipo });
  };

  return (
    <div className="flex flex-col min-h-screen bg-mainBackground">
      <Navbar isOnAuthPage={false} />
      <main className="flex-grow w-full px-10 flex flex-row py-20 justify-between space-x-12">
        <aside className="w-3/12 bg-white rounded-xl p-6 px-12 h-[28rem] shadow-xl">
          <p className="text-gray-500 text-sm mb-4">
            {totalDeResultados} resultados
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(filtros).map(
              ([key, value]) =>
                value &&
                key !== "campoOrdenacao" &&
                key !== "ordenacao" &&
                key !== "page" &&
                key !== "size" && (
                  <div
                    key={key}
                    className="flex items-center bg-gray-200 rounded-lg p-1 text-xs"
                  >
                    <span className="mr-2">{`${formatarNomeFiltro(
                      key
                    )}: ${value}`}</span>
                    <FontAwesomeIcon
                      onClick={() => removeFiltro(key as keyof IFiltros)}
                      icon={faXmark}
                      className="text-sm text-red-500 cursor-pointer"
                    />
                  </div>
                )
            )}
          </div>

          <div className="mb-4 flex flex-col">
            <label htmlFor="category-select" className="text-sm">
              Categoria:
            </label>
            <select
              id="category-select"
              value={filtros.categoria}
              onChange={(e) =>
                handleFiltroChange({ categoria: e.target.value })
              }
              className="border border-gray-300 rounded-md text-sm p-1 py-2 w-42 outline-none"
            >
              <option value={""}>Selecione uma categoria</option>
              {optionsCategoria.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 flex flex-col">
            <label htmlFor="category-select" className="text-sm">
              Marca:
            </label>
            <select
              id="category-select"
              value={filtros.marca}
              onChange={(e) => handleFiltroChange({ marca: e.target.value })}
              className="border border-gray-300 rounded-md text-sm p-1 py-2 w-42 outline-none"
            >
              <option value={""}>Selecione uma marca</option>
              {optionsMarcas.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-row space-x-4 justify-start items-end">
            <div className="mb-4 flex flex-col">
              <label htmlFor="preco-minimo" className="text-sm">
                Preço:
              </label>
              <input
                autoComplete="off"
                type="text"
                id="preco-minimo"
                value={filtros.precoMin}
                onChange={(e) =>
                  handleFiltroChange({
                    precoMin: e.target.value,
                  })
                }
                placeholder="Min."
                className="border border-gray-300 rounded-md text-sm p-1 w-full outline-none"
              />
            </div>

            <div className="mb-4 flex flex-col">
              <input
                autoComplete="off"
                type="text"
                id="preco-maximo"
                value={filtros.precoMax}
                onChange={(e) =>
                  handleFiltroChange({
                    precoMax: e.target.value,
                  })
                }
                placeholder="Max."
                className="border border-gray-300 rounded-md text-sm p-1 w-full outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-sm mb-2">Tipo de Anúncio:</label>
            <div className="flex space-x-4">
              <div
                onClick={() => handleTipoAnuncioChange("PROFISSIONAL")}
                className={`flex text-xs items-center justify-center cursor-pointer py-2 px-4 rounded-lg transition-all ${
                  filtros.tipoAnuncio === "PROFISSIONAL"
                    ? "bg-mainColor text-white scale-110"
                    : "bg-gray-300"
                }`}
              >
                Profissional
              </div>
              <div
                onClick={() => handleTipoAnuncioChange("AMADOR")}
                className={`flex text-xs items-center justify-center cursor-pointer py-2 px-4 rounded-lg transition-all ${
                  filtros.tipoAnuncio === "AMADOR"
                    ? "bg-mainColor text-white scale-110"
                    : "bg-gray-300"
                }`}
              >
                Amador
              </div>
              <div
                onClick={() => handleTipoAnuncioChange("AMBOS")}
                className={`flex text-xs items-center justify-center cursor-pointer py-2 px-4 rounded-lg transition-all ${
                  filtros.tipoAnuncio === "AMBOS"
                    ? "bg-mainColor text-white scale-110"
                    : "bg-gray-300"
                }`}
              >
                Ambos
              </div>
            </div>
          </div>
          <Botao
            onClick={limparFiltros}
            className="text-xs text-secondaryColor    font-extralight"
          >
            Limpar filtros
          </Botao>
        </aside>
        <div className="w-9/12 flex flex-col bg-white rounded-xl items-center pt-6 text-center py-6 shadow-xl">
          <div className="w-full flex flex-row items-start px-12">
            <div className="mb-8 flex flex-col items-start">
              <label htmlFor="order-select" className="text-sm">
                Ordenar por:
              </label>
              <select
                id="order-select"
                value={getOrdenacaoString()}
                onChange={handleOrderChange}
                className="border border-gray-300 rounded-md text-sm p-1 w-36"
              >
                <option value="Mais recentes">Mais recentes</option>
                <option value="Menor preço">Menor preço</option>
                <option value="Maior preço">Maior preço</option>
              </select>
            </div>
            <div className="mb-8 flex flex-col ml-6">
              <label htmlFor="size" className="text-sm">
                Anuncios por página:
              </label>
              <select
                id="size"
                value={filtros.size}
                onChange={handleSizeChange}
                className="border border-gray-300 rounded-md text-sm p-1 w-36 outline-none"
              >
                <option value="1">1</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
                <option value="60">60</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            {loading ? (
              <LoadingDots isLoading={loading} />
            ) : anuncios.length > 0 ? (
                <>
              <div className="flex flex-row items-center justify-center flex-wrap">
                {anuncios.map((anuncio) => (
                  <CardAnuncio key={anuncio.id} anuncio={anuncio} />
                ))}
              </div>
              <PaginatedSquares totalPages={totalPages} page={Number(filtros.page)} 
                onPageChange={(page) => handleFiltroChange({page})} />
              </>
            ) : (
              <p className="font-extralight text-gray-400">
                Nenhum resultado foi encontrado para a pesquisa.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
