import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store'; 
import { addItem, removeItem, clearCart, incrementQuantity, decrementQuantity } from '@/store/cartSlice'; 
import { toast } from 'react-toastify';
import { IitemCarrinho } from '@/interfaces/IitemCarrinho';
import { getAnunciosByListIDs } from '@/services/anuncioService';

const useCarrinhoDeCompras = () => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.carrinhoDeCompras.items);

  const adicionarItem = (item: IitemCarrinho) => {
    dispatch(addItem(item));
    setTimeout(() => {
      toast.success('Item adicionado ao carrinho!', {});
    }, 500);
  };

  const removerItem = (itemId: number) => {
    dispatch(removeItem(itemId)); 
    setTimeout(() => {
      toast.success('Item removido do carrinho!', {});
    }, 500);
  };

  const limparCarrinho = () => {
    dispatch(clearCart());
    toast.success('Carrinho limpo com sucesso!');
  };

  const isItemInCart = (itemId: number): boolean => {
    return items.some(item => item.id === itemId);
  };

  const incrementarQuantidade = (itemId: number) => {
    dispatch(incrementQuantity(itemId));
  };

  const decrementarQuantidade = (itemId: number) => {
    dispatch(decrementQuantity(itemId));
  };

  const getQuantidadeItem = (itemId: number): number => {
    const item = items.find(item => item.id === itemId);
    return item ? item.quantidade : 0;
  };

  const getListaItens = (): IitemCarrinho[] => {
    return items;
  };

  const getListaIds = (): number[] => {
    return items.map(item => item.id);
  };

  const atualizarCarrinho = async (): Promise<void> => {
    try {
        const listaIds = getListaIds();
        if (listaIds.length === 0) return;

        const anunciosAtualizados: any[] = await getAnunciosByListIDs(listaIds); 

        dispatch(clearCart());

        anunciosAtualizados.forEach((anuncioAtualizado: any) => { 
            const itemExistente = items.find(item => item.id === anuncioAtualizado.id);

            dispatch(addItem({
                ...anuncioAtualizado,
                quantidade: itemExistente ? itemExistente.quantidade : 1,
                imagem: anuncioAtualizado.imagensLinks?.[0] || anuncioAtualizado.imagem
            }));
        });
    } catch (error) {
        console.error('Erro ao atualizar o carrinho:', error);
    }
};

  const getTotal = (): number => {
    return items.reduce((total, item) => total + item.quantidade * Number(item.preco), 0);
  };

  const getQuantidadeItensCarrinho = (): number => {
    return items.reduce((total, item) => total + item.quantidade, 0);
  };

  return {
    items,
    adicionarItem,
    removerItem,
    limparCarrinho,
    isItemInCart,
    getQuantidadeItem,
    getListaItens,
    incrementarQuantidade, 
    decrementarQuantidade,
    getTotal,
    atualizarCarrinho,
    getQuantidadeItensCarrinho  
  };
};

export default useCarrinhoDeCompras;
