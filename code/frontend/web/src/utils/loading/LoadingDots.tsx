import React from 'react';

interface LoadingDotsProps {
    isLoading: boolean;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ isLoading }) => {
    if (!isLoading) {
        return null;
    }

    return (
        <div className="flex space-x-4 align-middle justify-center mb-4 mt-4">
            <div className="dot bg-mainColor"></div>
            <div className="dot bg-mainColor"></div>
            <div className="dot bg-mainColor"></div>
            <style jsx>{`
                .dot {
                    width: 9px;
                    height: 9px;
                    border-radius: 50%;
                    animation: bounce 1s infinite alternate;
                }
                .dot:nth-child(1) {
                    animation-delay: 0s;  
                }
                .dot:nth-child(2) {
                    animation-delay: 0.4s;  
                }
                .dot:nth-child(3) {
                    animation-delay: 0.6s; 
                }
                
                @keyframes bounce {
                    0% {
                        transform: translateY(0) scale(1);
                        filter: brightness(1.2); 
                    }
                    100% {
                        transform: translateY(10px) scale(1.4); 
                        filter: brightness(1.5); 
                    }
                }
            `}</style>
        </div>
    );
};

export default LoadingDots;
