import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faTrash, faPen, faCircleCheck, faWarning } from '@fortawesome/free-solid-svg-icons';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { formatarData } from '@/utils/dataUtils';
import { useMeusAnuncios } from '@/hooks/useMeusAnuncios';
import { formatarValorBRL } from '@/utils/stringUtils';
import Modal from './Modal';
import Botao from './Botao';

interface MeuAnuncioProps {
  id: number;
  titulo: string;
  preco: string;
  quantidadeProdutos: number;
  ativo: boolean;
  dataCriacao: string;
  descricao: string;
  imagem: string;
}

const MeuAnuncio: React.FC<MeuAnuncioProps> = ({ 
  id, 
  titulo, 
  preco, 
  quantidadeProdutos, 
  ativo,  
  dataCriacao, 
  descricao, 
  imagem,
}) => {
  const { 
    updateStatusAnuncioSubmit,   
    modalConfirmarExclusao,
    closeModalConfirmarExclusao,
    setModalConfirmarExclusao,
    deleteAnuncioSubmit 
  } = useMeusAnuncios();
  const [isAnuncioAtivo, setIsAnuncioAtivo] = useState(ativo);

  const handleCheckboxChange = () => {
    const novoStatus = !isAnuncioAtivo;
    setIsAnuncioAtivo(novoStatus); 
    updateStatusAnuncioSubmit(id, novoStatus);
  };

  return (
    <>
      <div className={`bg-white rounded-lg flex flex-row border h-auto w-5/6 items-center justify-between relative shadow-md hover:shadow-xl transition-shadow duration-300 ${!isAnuncioAtivo ? 'opacity-50' : ''}`}>
        <span className="absolute top-2 right-2 text-gray-400 text-xs rounded px-2 py-1">
          #{id}
        </span>
      
        <div className="mr-4 h-full w-64 overflow-hidden rounded-xl">
          <img
            src={imagem}
            alt="Marca"
            className="w-full h-full rounded-xl transform transition-transform duration-300 hover:scale-110"
          />
        </div>

        <div className="flex flex-col w-64 border-r px-5 py-6">
          <Link className="cursor-pointer" href={`/meusanuncios/${id}`} passHref>
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faCalendar} className="text-gray-500 mr-2 text-xs" />
              <p className="text-gray-500 font-light text-xs">Criado em {formatarData(dataCriacao)}</p>
            </div>
            <h2 className="text-md font-semibold text-mainColor break-words">
              {titulo}
            </h2>
            <p className="text-mainColor font-bold text-2xl">{formatarValorBRL(Number(preco))}</p>
            <p className="text-gray-500 font-light text-xs mt-2">
              {quantidadeProdutos === null || quantidadeProdutos === undefined || quantidadeProdutos === 1 
                ? 'anúncio único' 
                : `${quantidadeProdutos} unidades`}
            </p>
          </Link>
          
          <div className="flex flex-row mt-5 align-start">
            <button className="text-xs text-secondaryColor">
              <FontAwesomeIcon icon={faPen} />
              <span className="ml-2">Editar</span>
            </button>
            <button onClick={() => setModalConfirmarExclusao(true)} className="ml-4 text-xs text-secondaryColor">
              <FontAwesomeIcon icon={faTrash} />
              <span className="ml-2">Excluir</span>
            </button>
          </div>
        </div>
        
        <Link href={`/meusanuncios/${id}`} passHref className="flex flex-col w-96 cursor-pointer ml-6">
          <p className="text-gray-500 text-sm break-words">
            {descricao}
          </p>
        </Link>

        <div className="flex items-center mr-6">
          <label className="mr-2 text-sm text-gray-700">{isAnuncioAtivo ? 'Ativo' : 'Inativo'}</label>
          <div className="relative">
            <input 
              type="checkbox" 
              id={`checkbox-${id}`} 
              checked={isAnuncioAtivo} 
              onChange={handleCheckboxChange}   
              className="absolute opacity-0 w-0 h-0"
            />
            <div 
              className={`w-10 h-6 rounded-full ${isAnuncioAtivo ? 'bg-secondaryColor' : 'bg-gray-300'} cursor-pointer`}
              onClick={handleCheckboxChange}
            >
              <div 
                className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ${isAnuncioAtivo ? 'translate-x-4' : 'translate-x-0'}`}
              />
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={modalConfirmarExclusao} onClose={closeModalConfirmarExclusao}>
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg">
          <FontAwesomeIcon style={{ fontSize: '4rem' }} className="text-errorColor mb-5" icon={faWarning} />
          <h1 className="text-gray-600 mt-4 text-center text-2xl">
            Tem certeza que deseja excluir o anúncio?
          </h1>
          <span className="text-errorColor mt-4 text-center text-sm">Essa ação é irreversível e não pode ser desfeita.</span>
          <div className="flex-row gap-5 flex">
            <Botao 
              type="button" 
              onClick={() => deleteAnuncioSubmit(id)}
              className="mt-8 bg-errorColor text-white font-semibold px-6 py-3"
            >
              Excluir anúncio
            </Botao>
            <Botao 
              type="button" 
              onClick={closeModalConfirmarExclusao} 
              className="mt-8 bg-mainColor text-white font-semibold px-6 py-3"
            >
              Voltar
            </Botao>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MeuAnuncio;
