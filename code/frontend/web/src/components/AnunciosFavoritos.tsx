'use client';

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export default function AnunciosFavoritos() {
    const [number, setNumber] = useState(0);

    useEffect(() => {
        const fetchCartNumber = () => {
            const storedNumber = localStorage.getItem('numberOfItems');
            setNumber(storedNumber ? parseInt(storedNumber, 10) : 0);
        };

        fetchCartNumber();
    }, []);

    return (
        <Link href="/favoritos" passHref>
            <div className="flex cursor-pointer">
                <FontAwesomeIcon
                    style={{ cursor: 'pointer' }}
                    className="text-secondaryColor text-xl"
                    icon={faHeart}
                />
                <div className="rounded-xl bg-secondaryColor text-white w-5 flex items-center justify-center text-xs ml-1 font-bold">
                    {number}
                </div>
            </div>
        </Link>
    );
}
