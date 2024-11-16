import { useEffect } from 'react';
import { IitemCarrinho } from '@/interfaces/IitemCarrinho';
import ItemCarrinho from './ItemCarrinho';
import useCarrinhoDeCompras from '@/hooks/useCarrinhoDeCompras';
import Botao from './Botao';

export function ListaItensCarrinho() {
  const { getListaItens, limparCarrinho, atualizarCarrinho } = useCarrinhoDeCompras();
  const anuncios: IitemCarrinho[] = getListaItens();

  useEffect(() => {
    const atualizar = async () => {
      await atualizarCarrinho();
    };
    atualizar();
  }, []);

  return (
    <div className="container mx-auto py-5 text-center mb-10">
      <div className="flex flex-col items-start">
        <div className="flex flex-col text-left w-full space-y-4">
          {anuncios.map((anuncio) => (
            <ItemCarrinho key={anuncio.id} anuncio={anuncio} />
          ))}
        </div>
        
        {anuncios.length > 0 && (
          <Botao onClick={limparCarrinho} className="font-medium mt-5">
            Limpar Carrinho
          </Botao>
        )}
      </div>
    </div>
  );
}

export default ListaItensCarrinho;
