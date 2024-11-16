"use client";

import React from "react";
import Image from "next/image";

// Importe as imagens
import parcelamento from '../assets/img/parcelamento.png';
import frete from '../assets/img/frete.png';
import chats from '../assets/img/chat.png';
import seguro from '../assets/img/seguro.png';

const ImagensInfo = () => {
  return (
    <div className="flex justify-center gap-10 py-10 bg-white">
      <div className="flex flex-col items-center">
        <Image src={parcelamento} alt="Parcelamento" width={200} height={200} />
        <p className="text-center font-bold">PARCELAMENTO</p>
        <p className="text-center text-sm">Em até 12x no cartão</p>
      </div>
      <div className="flex flex-col items-center">
        <Image src={frete} alt="Entrega" width={200} height={200} />
        <p className="text-center font-bold">COMPRE NO SITE</p>
        <p className="text-center text-sm">Receba em casa</p>
      </div>
      <div className="flex flex-col items-center">
        <Image src={chats} alt="Recomendada" width={200} height={200} />
        <p className="text-center font-bold">RECOMENDADA</p>
        <p className="text-center text-sm">Amada pelos clientes</p>
      </div>
      <div className="flex flex-col items-center">
        <Image src={seguro} alt="Seguro" width={200} height={200} />
        <p className="text-center font-bold">LOJA 100% CONFIÁVEL</p>
        <p className="text-center text-sm">Compre com tranquilidade</p>
      </div>
    </div>
  );
};

export default ImagensInfo;
