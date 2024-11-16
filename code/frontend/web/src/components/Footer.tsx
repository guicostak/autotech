'use client';

import React from 'react';
import { FaFacebookF, FaGoogle, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-mainColor text-white py-6">
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="https://facebook.com" className="text-xl hover:text-red-500">
            <FaFacebookF />
          </a>
          <a href="https://instagram.com" className="text-xl hover:text-red-500">
            <FaInstagram />
          </a>
          <a href="https://twitter.com" className="text-xl hover:text-red-500">
            <FaXTwitter />
          </a>
          <a href="https://google.com" className="text-xl hover:text-red-500">
            <FaGoogle />
          </a>
          <a href="https://youtube.com" className="text-xl hover:text-red-500">
            <FaYoutube />
          </a>
        </div>
        <div className="flex flex-row my-10 space-x-20 justify-center text-gray-400">
          <a href="/" className="hover:text-white">Home</a>
          <a href="termosepoliticas" className="hover:text-white">Termos de Uso</a>
          <a href="quemsomos" className="hover:text-white">Quem Somos</a>
          <a href="contatos" className="hover:text-white">Contatos</a>
          <a href="#" className="hover:text-white">Como Comprar</a>
        </div>
        <div className="text-gray-500 text-sm">
          Copyright &copy; 2024; Designed by Autotech
        </div>
      </div>
    </footer>
  );
};

export default Footer;
