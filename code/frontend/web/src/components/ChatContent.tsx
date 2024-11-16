// src/components/ChatContent.tsx

import Image from "next/image";
import { Message } from "../types/Message";
import { FaUserCircle } from "react-icons/fa"; // Importação do ícone de usuário

interface ChatContentProps {
  message: Message;
}

export default function ChatContent({ message }: ChatContentProps) {
  return (
    <div className="w-full lg:w-2/3 p-4">
      {/* Área de detalhes do anúncio */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Image
            src={message.image}
            alt={message.title}
            width={50}
            height={50}
            className="rounded-lg object-cover"
          />
          <div className="ml-4">
            <span className="text-red-500 text-xs">Denunciar anúncio</span>
            <h3 className="text-lg font-semibold">{message.title}</h3>
            <p className="text-xl font-bold text-gray-700">{message.price}</p>
          </div>
        </div>
        
        {/* Ícone de perfil e nome do vendedor */}
        <div className="flex items-center">
          <FaUserCircle size={40} className="text-gray-700" />
          <div className="ml-2 text-right">
            <p className="font-semibold">João Menezes</p>
            <span className="text-red-500 text-xs">ver perfil</span>
          </div>
        </div>
      </div>

      {/* Linha de separação */}
      <hr className="border-t border-gray-300 w-full mt-" />

      {/* Área de mensagens do chat */}
      <div className="space-y-4 mt-4">
        {message.conversation.map((text, index) => (
          <div
            key={index}
            className={`p-4 max-w-xl rounded-2xl ${
              index % 2 === 0
                ? "bg-gray-100 text-gray-700 self-start rounded-tl-none mr-auto" // Mensagens recebidas mais à esquerda
                : "bg-gray-200 text-gray-700 self-end rounded-tr-none ml-auto" // Mensagens enviadas mais à direita
            }`}
            style={{ lineHeight: "1.6", fontSize: "1rem" }}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
