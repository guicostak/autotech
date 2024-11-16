import React from 'react';
import Image from 'next/image'; 
import Link from 'next/link';
import motorfromcategorias from '../assets/img/categoria/motorfromcategorias.png';
import suspensao from '../assets/img/categoria/suspensao.png';
import transmissao from '../assets/img/categoria/transmissao.png';
import freios from '../assets/img/categoria/freios.png';
import filtros from '../assets/img/categoria/filtros.png';
import bateria from '../assets/img/categoria/bateria.png';
import farol from '../assets/img/categoria/farol.png';
import pneu from '../assets/img/categoria/pneu.png';

const Categorias = () => {
  return (
    <div className="container mx-auto p-5 text-center mb-20 w-11/12">
      <h2 className="text-2xl text-left text-mainColor mb-10 mt-6 ml-16">Categorias em destaque</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-32 max-w-6xl mx-auto">
        
        <Link href="/anuncios?categoria=Motor&campoOrdenacao=dataCriacao&ordenacao=desc&tipoAnuncio=AMBOS&page=0&size=30" className="flex flex-col items-center cursor-pointer justify-center text-center transition-transform duration-300 hover:scale-110">
          <h3 className="mb-2 text-lg font-bold text-[#2A2C2F]">Motor</h3>
          <div className="w-60 h-50 border bg-mainColor rounded-xl overflow-hidden">
            <Image src={motorfromcategorias} alt="Motor" className="object-cover w-full h-full" />
          </div>
        </Link>
        
        <Link href="/anuncios?categoria=Suspensao&campoOrdenacao=dataCriacao&ordenacao=desc&tipoAnuncio=AMBOS&page=0&size=30" className="flex flex-col items-center cursor-pointer justify-center text-center transition-transform duration-300 hover:scale-110">
          <h3 className="mb-2 text-lg font-bold text-[#2A2C2F]">Suspensão</h3>
          <div className="w-60 h-50 border bg-mainColor rounded-xl overflow-hidden">
            <Image src={suspensao} alt="Suspensão" className="object-cover w-full h-full" />
          </div>
        </Link>
        
        <Link href="/anuncios?categoria=Transmissao&campoOrdenacao=dataCriacao&ordenacao=desc&tipoAnuncio=AMBOS&page=0&size=30" className="flex flex-col items-center cursor-pointer justify-center text-center transition-transform duration-300 hover:scale-110">
          <h3 className="mb-2 text-lg font-bold text-[#2A2C2F]">Transmissão</h3>
          <div className="w-60 h-40 border bg-mainColor rounded-xl overflow-hidden">
            <Image src={transmissao} alt="Transmissão" className="object-cover w-full h-full" />
          </div>
        </Link>
        
        <Link href="/anuncios?categoria=Freio&campoOrdenacao=dataCriacao&ordenacao=desc&tipoAnuncio=AMBOS&page=0&size=30" className="flex flex-col items-center cursor-pointer justify-center text-center transition-transform duration-300 hover:scale-110">
          <h3 className="mb-2 text-lg font-bold text-[#2A2C2F]">Freios</h3>
          <div className="w-60 h-40 border bg-mainColor rounded-xl overflow-hidden">
            <Image src={freios} alt="Freios" className="object-cover w-full h-full" />
          </div>
        </Link>
        
        <Link href="/anuncios?categoria=Filtro&campoOrdenacao=dataCriacao&ordenacao=desc&tipoAnuncio=AMBOS&page=0&size=30" className="flex flex-col items-center cursor-pointer justify-center text-center mt-10 transition-transform duration-300 hover:scale-110">
          <h3 className="mb-2 text-lg font-bold text-[#2A2C2F]">Filtros</h3>
          <div className="w-60 h-40 border white rounded-xl overflow-hidden">
            <Image src={filtros} alt="Filtros" className="object-cover w-full h-full" />
          </div>
        </Link>
        
        <Link href="/anuncios?categoria=Bateria&campoOrdenacao=dataCriacao&ordenacao=desc&tipoAnuncio=AMBOS&page=0&size=30" className="flex flex-col items-center cursor-pointer justify-center text-center mt-10 transition-transform duration-300 hover:scale-110">
          <h3 className="mb-2 text-lg font-bold text-[#2A2C2F]">Bateria</h3>
          <div className="w-60 h-40 border white rounded-xl overflow-hidden">
            <Image src={bateria} alt="Bateria" className="object-contain w-full h-full" />
          </div>
        </Link>
        
        <Link href="/anuncios?categoria=Farol&campoOrdenacao=dataCriacao&ordenacao=desc&tipoAnuncio=AMBOS&page=0&size=30" className="flex flex-col items-center cursor-pointer justify-center text-center mt-10 transition-transform duration-300 hover:scale-110">
          <h3 className="mb-2 text-lg font-bold text-[#2A2C2F]">Farol</h3>
          <div className="w-60 h-40 border bg-mainColor rounded-xl overflow-hidden">
            <Image src={farol} alt="Farol" className="object-cover w-full h-full" />
          </div>
        </Link>
        
        <Link href="/anuncios?categoria=Pneu&campoOrdenacao=dataCriacao&ordenacao=desc&tipoAnuncio=AMBOS&page=0&size=30" className="flex flex-col items-center cursor-pointer justify-center text-center mt-8 transition-transform duration-300 hover:scale-110">
          <h3 className="mb-2 text-lg font-bold text-[#2A2C2F]">Pneu</h3>
          <div className="w-60 h-40 border white rounded-xl overflow-hidden">
            <Image src={pneu} alt="Pneu" className="object-contain w-full h-full" />
          </div>
        </Link>

      </div>
    </div>
  );
};

export default Categorias;
