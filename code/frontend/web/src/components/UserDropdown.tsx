'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSignOutAlt, faChevronDown, faBoxOpen, faStore } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '@/store/store';
import useLogin from '@/hooks/useLogin';

export default function UserDropdown() {
  const { userInfo } = useAppSelector((state) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const { handleLogout } = useLogin();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="relative flex items-center gap-2">
      <span className="text-white">{userInfo?.name?.split(' ')[0]}</span>
      
      <div 
        className="relative flex items-center cursor-pointer user-dropdown"
        onClick={toggleDropdown}
      >
        <div 
          className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faUserCircle} className="text-mainColor text-3xl" />
        </div>
        <FontAwesomeIcon icon={faChevronDown} className="ml-1 text-white text-xs" />
      </div>

      {isDropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 user-dropdown"
          style={{ top: '100%', right: '0' }}
        >
          <div className="p-2 border-b border-gray-200 hover:bg-gray-100 rounded-md">
            <Link href="/perfil">
              <button className="w-full flex items-center text-left text-gray-700 p-2 rounded-md">
                <FontAwesomeIcon icon={faUserCircle} size="lg" className="mr-2 text-mainColor text-1xl" />
                Perfil
              </button>
            </Link>
          </div>
          <div className="p-2 border-b border-gray-200 hover:bg-gray-100">
            <Link href="/loja">
              <button className="w-full flex items-center text-left text-gray-700 p-2 rounded-md">
                <FontAwesomeIcon icon={faStore} size="lg" className="mr-2 text-mainColor text-1xl" />
                Loja
              </button>
            </Link>
          </div>
          <div className="p-2 border-b border-gray-200 hover:bg-gray-100">
            <Link href="/meusanuncios">
              <button className="w-full flex items-center text-left text-gray-70 p-2 rounded-md">
                <FontAwesomeIcon icon={faBoxOpen} size="lg" className="mr-2 text-mainColor text-1xl" />
                Meus anúncios
              </button>
            </Link>
          </div>
          <div className="p-2 hover:bg-gray-100 rounded-md">
            <button
              onClick={handleLogout}
              className="w-full flex items-center text-left text-secondaryColor p-2 rounded-md"
            >
              <FontAwesomeIcon icon={faSignOutAlt} size="lg" className="mr-2 text-secondaryColor" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
