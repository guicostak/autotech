// src/components/MessageList.tsx

import Image from "next/image";
import { Message } from "../types/Message";

interface MessageListProps {
  messages: Message[];
  onSelectMessage: (id: number) => void;
  selectedMessageId: number;
}

export default function MessageList({
  messages,
  onSelectMessage,
  selectedMessageId,
}: MessageListProps) {
  return (
    <div className="w-full lg:w-1/3 p-4 border-r border-gray-300">
      <div className="flex flex-col mb-4">
        <h2 className="text-2xl font-semibold">Mensagens</h2>
        
        {/* Linha de separação alinhada com a linha da área de detalhes do anúncio */}
        <hr className="border-t border-gray-300 mt-16" />
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            onClick={() => onSelectMessage(message.id)}
            className={`flex items-center p-2 rounded-lg cursor-pointer ${
              selectedMessageId === message.id ? "bg-gray-200" : "bg-gray-100"
            }`}
          >
            <Image
              src={message.image}
              alt={message.title}
              width={50}
              height={50}
              className="rounded-lg object-cover"
            />
            <div className="ml-4">
              <h3 className="font-semibold">{message.title}</h3>
              <p className="text-sm text-gray-500">{message.preview}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
