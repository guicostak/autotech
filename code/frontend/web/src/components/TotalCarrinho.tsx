import useCarrinhoDeCompras from "@/hooks/useCarrinhoDeCompras";
import { IitemCarrinho } from "@/interfaces/IitemCarrinho";
import { formatarValorBRL, truncateString } from "@/utils/stringUtils";
import Botao from "./Botao";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCardAlt } from "@fortawesome/free-solid-svg-icons";

export function TotalCarrinho () {
  const { getListaItens, getTotal } = useCarrinhoDeCompras();
  const anuncios: IitemCarrinho[] = getListaItens();

  return (
    <div className="flex flex-col h-fit items-center bg-white w-3/6 rounded-xl py-8 shadow-lg">
      <h2 className=" w-5/6 text-center text-lg pb-4 border-b border-gray-300">Resumo da compra</h2>
      <div className="flex flex-col mt-4 w-5/6">
        {anuncios.map((anuncio) => (
          <div key={anuncio.id} className="flex flex-row text-sm justify-between bg-red w-full mb-2">
            <span className="flex-grow text-left w-3/6">
              {truncateString(anuncio.titulo, 20)}
            </span>
            <span className="flex-grow text-center w-1/6">{anuncio.quantidade}x</span>
            <span className="flex-grow text-right w-2/6">
              {formatarValorBRL(anuncio.quantidade * Number(anuncio.preco))}
            </span>
          </div>
        ))}
        <div className="flex flex-row text-lg font-light justify-between bg-red w-full pt-4 mt-6 border-t">
          <span>Total:</span>
          <span className="font">{formatarValorBRL(getTotal())}</span>
        </div>
        <Botao className="bg-mainColor text-white mt-6 flex items-center justify-center py-3"> 
          <FontAwesomeIcon className='text-secondaryColor mr-2' icon={faCreditCardAlt} />
          Comprar Agora
        </Botao>
      </div>  
    </div>
  );
};