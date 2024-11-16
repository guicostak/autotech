'use client';

import React from 'react';

const QuemSomos = () => {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-6">
      <div className="bg-white p-8 w-full max-w-4xl border border-gray-300 shadow-lg rounded-md font-sans">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Quem Somos</h1>
        <p className="text-gray-700 mb-6">
          Bem-vindo à <span className="font-semibold">Autotech</span>, o marketplace líder para peças de carro no Brasil.
          Nossa plataforma conecta compradores a fornecedores de peças automotivas de qualidade, oferecendo uma ampla variedade de componentes para todos os tipos de veículos, desde carros de passeio até utilitários.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">Nossa Missão</h2>
        <p className="text-gray-700 mb-6">
          Nossa missão é simplificar a compra de peças automotivas, proporcionando uma experiência prática, segura e eficiente para nossos clientes.
          Queremos ajudar motoristas, mecânicos e entusiastas a encontrar as peças de que precisam de maneira rápida e confiável, enquanto oferecemos suporte aos fornecedores para expandirem seus negócios.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">Nossos Valores</h2>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>Variedade:</strong> Garantimos uma ampla seleção de peças automotivas para todas as marcas e modelos.</li>
          <li><strong>Confiabilidade:</strong> Trabalhamos apenas com fornecedores confiáveis, garantindo produtos de alta qualidade para nossos clientes.</li>
          <li><strong>Transparência:</strong> Oferecemos informações claras sobre produtos, preços e prazos de entrega, para uma compra sem surpresas.</li>
          <li><strong>Inovação:</strong> Buscamos constantemente novas soluções para melhorar a experiência de compra online no setor automotivo.</li>
        </ul>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">Nossa História</h2>
        <p className="text-gray-700 mb-6">
          Desde a nossa fundação, a Autotech se estabeleceu como um dos principais marketplaces de peças de carro no Brasil, ajudando milhares de clientes a encontrar peças confiáveis para seus veículos.
          Com uma interface amigável e um suporte ao cliente dedicado, estamos transformando o mercado de peças automotivas.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">Entre em Contato</h2>
        <p className="text-gray-700">
          Para saber mais sobre a Autotech ou para entrar em contato conosco, envie um e-mail para
          <a href="mailto:contato@autotech.com" className="text-blue-500 hover:underline"> contato@autotech.com</a>.
          Estamos prontos para ajudar!
        </p>
      </div>
    </div>
  );
};

export default QuemSomos;
