import React, { useEffect, useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            setTimeout(() => setIsVisible(true), 100); 
        } else {
            setIsVisible(false);
            setTimeout(() => setIsMounted(false), 300);
        }
    }, [isOpen]);

    if (!isMounted) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-1/3 transform transition-transform duration-300 ${isVisible ? 'scale-100' : 'scale-95'}`}>
                <button onClick={onClose} className="text-3xl absolute top-2 right-2 text-gray-600 hover:text-gray-800">
                    &times;
                </button>
                <div className="mt-4">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
