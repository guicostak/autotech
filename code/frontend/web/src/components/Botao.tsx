'use client';

import React from "react";

interface BotaoProps {
    readonly className?: string; 
    readonly onClick?: () => void; 
    readonly children: React.ReactNode;
    readonly disabled?: boolean;
    readonly type?: "button" | "submit" | "reset";
}

export default function Botao({ className, onClick, children, type = "button", disabled = false }: BotaoProps) { 
    return (
        <button 
            type={type}
            className={`rounded-lg p-2 font-bold text-sm transition-all duration-300 ${className} 
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:filter hover:opacity-90'}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
