// src/types/Message.ts

export interface Message {
    id: number;
    image: string; // Tipo string para suportar URLs dinâmicas no futuro
    title: string;
    preview: string;
    price: string;
    conversation: string[];
  }
  