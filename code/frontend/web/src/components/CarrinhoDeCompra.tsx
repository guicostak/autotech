'use client';

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import useCarrinhoDeCompras from "@/hooks/useCarrinhoDeCompras";

export default function CarrinhoDeCompra() {
    const { getQuantidadeItensCarrinho } = useCarrinhoDeCompras();
    const [number, setNumber] = useState(getQuantidadeItensCarrinho());

    useEffect(() => {
        setNumber(getQuantidadeItensCarrinho());
    }, [getQuantidadeItensCarrinho]);

    return (
        <Link href="/carrinho" passHref>
            <div className="flex cursor-pointer">
                <FontAwesomeIcon
                    style={{ cursor: 'pointer' }}
                    className="text-secondaryColor text-xl"
                    icon={faCartShopping}
                />
                <div className="rounded-xl bg-secondaryColor text-white w-5 flex items-center justify-center text-xs ml-1 font-bold">
                    {number}
                </div>
            </div>
        </Link>
    );
}
