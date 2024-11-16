import { IitemCarrinho } from '@/interfaces/IitemCarrinho';
import Botao from './Botao';
import useCarrinhoDeCompras from '@/hooks/useCarrinhoDeCompras';

interface ICardAnuncioProps {
  anuncio: IitemCarrinho;
}

const ItemCarrinho: React.FC<ICardAnuncioProps> = ({ anuncio }) => {
  const { removerItem, incrementarQuantidade, decrementarQuantidade, getQuantidadeItem } = useCarrinhoDeCompras();

  return (
    <div className="bg-white h-32 text-left rounded-xl p-4 items-center flex flex-row justify-start shadow-lg">
      <img
        src={anuncio.imagem || '/path/to/default/image.png'}
        alt={`Imagem do ${anuncio.titulo}`}
        className="h-full border-r w-36 pr-2 rounded-lg"
      />
      <div className='justify-between flex flex-row w-full'>
        <div className="ml-12 flex flex-col items-start justify-center">
        <h2 className="text-xl w-80 text-[#2A2C2F] break-words">{anuncio.titulo}</h2>
          <Botao onClick={() => removerItem(anuncio.id)} className='text-secondaryColor font-light text-xs pl-0'>remover anúncio</Botao>
        </div>
        <div className="ml-12 flex flex-row items-center justify-center">
          <div className="flex justify-center items-center">
            <button
              onClick={() => decrementarQuantidade(anuncio.id)}
              className="w-4 h-4 flex items-center justify-center bg-secondaryColor text-sm text-white rounded-l"
            >
              -
            </button>
            <span className="w-6 h-4 flex items-center justify-center bg-white border-y text-xs">
              {getQuantidadeItem(anuncio.id)}
            </span>
            <button
              onClick={() => incrementarQuantidade(anuncio.id)}
              className="w-4 h-4 flex items-center justify-center bg-secondaryColor text-sm text-white rounded-r"
            >
              +
            </button>
          </div>
          <p className="text-lg ml-10">R$ {anuncio.preco}</p>
        </div>
      </div>
    </div>
  );
};

export default ItemCarrinho;
