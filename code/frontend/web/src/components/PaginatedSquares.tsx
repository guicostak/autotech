import React from 'react';

interface PaginatedSquaresProps {
  totalPages: number;
  page: number; 
  onPageChange: (page: string) => void; 
}

const PaginatedSquares: React.FC<PaginatedSquaresProps> = ({ totalPages, page, onPageChange }) => {
  return (
    <div className="flex flex-wrap space-x-5 mt-4">
      {Array.from({ length: totalPages }, (_, index) => {
        const isSelected = page === index;
        return (
          <div
            key={index}
            onClick={() => onPageChange((index).toString())} 
            className={`w-12 h-12 flex items-center justify-center text-white rounded-lg cursor-pointer transition-transform duration-200 ${
              isSelected ? 'bg-secondaryColor scale-110' : 'bg-mainColor hover:scale-105'
            }`}
          >
            {index + 1}
          </div>
        );
      })}
    </div>
  );
};

export default PaginatedSquares;
