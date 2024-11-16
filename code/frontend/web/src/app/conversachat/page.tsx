// src/app/conversachat/page.tsx
"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import MessageList from "@/components/MessageList";
import ChatContent from "@/components/ChatContent";
import { Message } from "@/types/Message";

const messagesData: Message[] = [
  {
    id: 1,
    image: "/assets/img/categoria/motorFromCategorias.png",
    title: "Motor v8 32 válvulas",
    preview: "Oi! Claro, estou à disposição...",
    price: "R$ 3000,00",
    conversation: [
      "Olá! Vi que você está vendendo um motor e gostaria de saber mais sobre ele.",
      "Oi! Claro, estou à disposição. Este é um motor 1.8 flex da marca Fiat, com aproximadamente 60.000 km rodados.",
      "Interessante! Você poderia me informar o valor final?",
      "Posso fazer por R$ 3000,00, considerando as condições do motor.",
    ],
  },
  {
    id: 2,
    image: "/assets/img/categoria/motorFromCategorias.png",
    title: "Motor v6 24 válvulas",
    preview: "Está disponível, posso enviar detalhes...",
    price: "R$ 2500,00",
    conversation: [
      "Boa tarde! Esse motor v6 ainda está disponível?",
      "Sim, ele está disponível. É um motor em excelente estado, com manutenção recente.",
      "Ótimo! Qual o valor que você está pedindo?",
      "Estou pedindo R$ 2500,00, mas podemos negociar um pouco.",
      "Legal, vou considerar e volto a falar contigo.",
    ],
  },
  {
    id: 3,
    image: "/assets/img/categoria/motorFromCategorias.png",
    title: "Motor 2.0 Turbo",
    preview: "Olá! Esse motor tem turbo...",
    price: "R$ 4500,00",
    conversation: [
      "Olá! Esse motor 2.0 vem com turbo de fábrica?",
      "Sim, ele vem com turbo instalado de fábrica e está em ótimo estado.",
      "Qual o tempo de uso dele?",
      "Foi utilizado por aproximadamente 40.000 km, sempre com manutenção regular.",
      "Obrigado pelas informações! Vou avaliar.",
    ],
  },
  {
    id: 4,
    image: "/assets/img/categoria/motorFromCategorias.png",
    title: "Motor 1.6 Flex",
    preview: "Perfeito para quem busca economia...",
    price: "R$ 1800,00",
    conversation: [
      "Bom dia! Esse motor é flex, certo?",
      "Isso mesmo, ele é flex e ideal para quem busca economia de combustível.",
      "Quantos quilômetros rodados ele tem?",
      "Aproximadamente 70.000 km, mas sempre com manutenção preventiva.",
      "Interessante! Vou dar uma olhada.",
    ],
  },
  {
    id: 5,
    image: "/assets/img/categoria/motorFromCategorias.png",
    title: "Motor Diesel 3.0",
    preview: "Motor diesel potente e econômico...",
    price: "R$ 5000,00",
    conversation: [
      "Esse motor diesel é para qual tipo de veículo?",
      "Ele é adequado para SUVs e caminhonetes.",
      "Qual a quilometragem e estado atual dele?",
      "Ele rodou 90.000 km e está em excelente condição.",
      "Obrigado, vou avaliar a possibilidade de compra.",
    ],
  },
];

export default function ConversaChat() {
  const [selectedMessageId, setSelectedMessageId] = useState<number>(messagesData[0].id);

  const selectedMessage = messagesData.find((message) => message.id === selectedMessageId);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row bg-white shadow-md rounded-lg overflow-hidden">
          <MessageList
            messages={messagesData}
            onSelectMessage={setSelectedMessageId}
            selectedMessageId={selectedMessageId}
          />
          {selectedMessage && <ChatContent message={selectedMessage} />}
        </div>
      </div>
    </div>
  );
}
