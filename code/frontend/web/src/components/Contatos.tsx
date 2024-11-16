"use client";

import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";

export default function Contatos() {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-lg p-8 max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
          Fale Conosco
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Endereço */}
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-3xl mr-4 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Endereço</h3>
              <p className="text-gray-600">
                Autotech, Rua das Peças, 123.
              </p>
            </div>
          </div>

          {/* Horário de Atendimento */}
          <div className="flex items-center justify-end">
            <FaClock className="text-3xl mr-4 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Horário de Atendimento
              </h3>
              <p className="text-gray-600">
                De segunda a sexta, das 8h às 18h.
              </p>
            </div>
          </div>

          {/* Telefone */}
          <div className="flex items-center">
            <FaPhoneAlt className="text-3xl mr-4 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Telefone</h3>
              <p className="text-gray-600">(11) 1234-5678</p>
            </div>
          </div>

          {/* E-mail (modificado para centralizar ícone e texto) */}
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <FaEnvelope className="text-3xl mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">E-mail</h3>
                <p className="text-gray-600">
                  <a
                    href="mailto:contato@autotech.com"
                    className="hover:underline"
                  >
                    contato@autotech.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Contato */}
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Envie-nos uma mensagem
        </h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="nome" className="block font-medium text-gray-700">
              Nome:
            </label>
            <input
              type="text"
              id="nome"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[rgb(42,44,47)]"
              placeholder="Digite seu nome"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium text-gray-700">
              E-mail:
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[rgb(42,44,47)]"
              placeholder="Digite seu e-mail"
            />
          </div>
          <div>
            <label
              htmlFor="mensagem"
              className="block font-medium text-gray-700"
            >
              Mensagem:
            </label>
            <textarea
              id="mensagem"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[rgb(42,44,47)]"
              placeholder="Digite sua mensagem"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[rgb(42,44,47)] text-white py-3 rounded hover:bg-[rgb(32,34,37)] transition-all duration-200"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
