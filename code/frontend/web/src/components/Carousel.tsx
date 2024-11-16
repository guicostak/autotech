"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'; 
import { Navigation, Pagination, Autoplay } from 'swiper/modules'; 
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import carrossel1 from '../assets/img/carrosel/carrossel1.png';
import carrossel2 from '../assets/img/carrosel/carrossel2.png';
import ICarroselImage from '@/interfaces/ICarroselImage';

const Carrossel = () => {
  const images: ICarroselImage[] = [
    { id: 1, src: carrossel1, alt: 'Imagem 1' },
    { id: 2, src: carrossel2, alt: 'Imagem 2' },
  ];

  return (
    <div className="z-1 mb-5 shadow-xl-">
      <Swiper
        spaceBetween={0} // Set to 0 to avoid white space between slides
        slidesPerView={1}
        autoplay={{
          delay: 4000, 
          disableOnInteraction: false, 
        }}
        pagination={{ clickable: true }} 
        loop={true}
        modules={[Navigation, Pagination, Autoplay]} 
      >
        {images.map((image) => (
          <SwiperSlide key={image.id}>
            <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', height: '380px' }}>
              <Image src={image.src} alt={image.alt} fill style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carrossel;
