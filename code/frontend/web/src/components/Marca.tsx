"use client";

import React from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image, { StaticImageData } from 'next/image';

interface MarcaProps {
  imageSrc: StaticImageData;
}

const Marca: React.FC<MarcaProps> = ({ imageSrc }) => {
  return (
    <div className="bg-white border w-28 h-28 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow-md">
      <Image src={imageSrc} alt="Category image" width={80} height={80} className="rounded-2xl" />
    </div>
  );
};

export default Marca;
