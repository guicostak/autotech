'use client';
  
import React, { useEffect } from "react";
import Logo from "./Logo";
import BarraDePesquisa from "./BarraDePesquisa";
import useSearch from "../hooks/useNavbar";
import Cart from "./CarrinhoDeCompra";
import Link from 'next/link';
import Botao from "./Botao";
import UserDropdown from "./UserDropdown";
import { useAppSelector, useAppDispatch } from '@/store/store';
import { checkUserSession } from '@/store/userSlice'; 
import AnunciosFavoritos from "./AnunciosFavoritos";
import { usePathname } from 'next/navigation';
import { useAnuncios } from "@/hooks/useAnuncios";

interface NavbarProps {
  isOnAuthPage?: boolean;
}

export default function Navbar({ isOnAuthPage = false }: NavbarProps) {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = async () => {
      await dispatch(checkUserSession());
    };

    checkSession();
  }, [dispatch]);

  return (
    <nav className="bg-mainColor h-24 flex items-center px-6 justify-between shadow-md w-full">
      <div className="flex items-center gap-8">
        <Logo width="10rem" />
        <BarraDePesquisa />
      </div>

      <div className="flex items-center justify-end">
        <div className={`${pathname === "/favoritos" ? "border-b-4 border-secondaryColor" : ""} mr-6 h-24 flex items-center`}>  
          <AnunciosFavoritos />
        </div>
        <div className={`${pathname === "/carrinho" ? "border-b-4 border-secondaryColor" : ""} mr-6 h-24 flex items-center`}>
          <Cart />
        </div>

        <div className="flex items-center gap-3">
          {!isLoggedIn && !isOnAuthPage && (
            <>
              <Link href="/entrar">
                <Botao className="bg-mainColor text-white w-32 border-2 border-secondaryColor hover:bg-secondaryColor transition-all">
                  Entrar
                </Botao>
              </Link>
              <Link href="/cadastro">
                <Botao className="bg-secondaryColor text-white w-48 hover:bg-mainColor border-secondaryColor border transition-all">
                  Anuncie grátis
                </Botao>
              </Link>
            </>
          )}

          {isLoggedIn && (
            <>
              <div className="mr-6">
                <UserDropdown />
              </div>
              <Link href="/anunciar">
                <Botao className="bg-secondaryColor text-white w-48 hover:bg-mainColor border-secondaryColor border transition-all">
                  Anuncie grátis
                </Botao>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
