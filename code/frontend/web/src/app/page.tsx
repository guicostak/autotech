"use client"; 

import Navbar from "@/components/Navbar";
import Carousel from '@/components/Carousel';
import '@/common/style/globals.css';
import ListaMarcas from "@/components/ListaMarcas";
import BannerHome from "@/components/BannerHome";
import Footer from "@/components/Footer";
import CardsHome from "@/components/CardsHome";
import IconesBeneficosdaHome from "@/components/IconesBeneficosdaHome";
import Categorias from "@/components/Categorias";

export default function Home() {
  return (
    <div className="bg-mainBackground w-full">
      <Navbar isOnAuthPage={false} /> 
      <ListaMarcas/>
      <Carousel/>
      <IconesBeneficosdaHome/>
      <BannerHome/>
      <CardsHome />
      <Categorias/>
      <Footer/>
    </div>
  );
}
