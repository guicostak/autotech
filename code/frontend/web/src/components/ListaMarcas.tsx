'use client';

import Link from 'next/link';
import Marca from "./Marca";
import bmwLogo from "@/assets/img/marca/bmw_logo.png";
import toyotaLogo from "@/assets/img/marca/toyota_logo.png";
import renaultLogo from "@/assets/img/marca/renault_logo.png";
import volks_logo from "@/assets/img/marca/volks_logo.png";
import nissan_logo from "@/assets/img/marca/nissan_logo.png";
import hyundaiLogo from "@/assets/img/marca/hyundai_logo.png";

export default function Marcas() {
    return (
        <>
            <h1 className="font-bold text-mainColor ml-48 mt-10 text-xl text-left">Aqui você encontra peças das melhores marcas</h1>
            <div className="navbar-menu h-40 flex flex-row items-center justify-center space-x-24 mb-6 mt-4">
                <Link href="/anuncios?marca=BMW&campoOrdenacao=dataCriacao&ordenacao=desc&tipoAnuncio=AMBOS&page=0&size=30">
                    <Marca imageSrc={bmwLogo} />
                </Link>
                <Link href="/anuncios?marca=Toyota&campoOrdenacao=dataCriacao&ordenacao=desc&tipoAnuncio=AMBOS&page=0&size=30">
                    <Marca imageSrc={toyotaLogo} />
                </Link>
                <Link href="/anuncios?marca=Renault&campoOrdenacao=dataCriacao&ordenacao=desc&tipoAnuncio=AMBOS&page=0&size=30">
                    <Marca imageSrc={renaultLogo} />
                </Link>
                <Link href="/anuncios?marca=Volkswagen&campoOrdenacao=dataCriacao&ordenacao=desc&tipoAnuncio=AMBOS&page=0&size=30">
                    <Marca imageSrc={volks_logo} />
                </Link>
                <Link href="/anuncios?marca=Nissan&campoOrdenacao=dataCriacao&ordenacao=desc&tipoAnuncio=AMBOS&page=0&size=30">
                    <Marca imageSrc={nissan_logo} />
                </Link>
                <Link href="/anuncios?marca=Hyundai&campoOrdenacao=dataCriacao&ordenacao=desc&tipoAnuncio=AMBOS&page=0&size=30">
                    <Marca imageSrc={hyundaiLogo} />
                </Link>
            </div>
        </>
    );
}
