import { deleteAnuncio, getAnunciosByIdUsuario, updateStatusAnuncio } from '@/services/anuncioService'; 
import { useState, useEffect } from 'react';
import { useAppSelector } from "@/store/store";
import { IMeuAnuncioResponse } from '@/interfaces/IMeuAnuncioResponse';
import { toast } from 'react-toastify';

export const useMeusAnuncios = () => {
  const userId = useAppSelector((state) => state.user.userInfo?.id);

  const [meusAnuncios, setMeusAnuncios] = useState<IMeuAnuncioResponse[]>([]);
  const [modalConfirmarExclusao, setModalConfirmarExclusao] = useState(false);

  const updateStatusAnuncioSubmit = async (idAnuncio: number, status: boolean) => {
    try {
      console.log(`Atualizando anúncio ${idAnuncio} para status: ${status}`);
      await updateStatusAnuncio(idAnuncio, status);

      setTimeout(() => {
        toast.success('Status atualizado com sucesso!', {}); 
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error('Erro ao atualizar o status do anúncio', err);
    }
  };

  const updateListaAnuncios = async () => {
    try {
      const response = await getAnunciosByIdUsuario(userId);
      if (response?.content) {
        const anunciosFormatados = response.content.map((anuncio: any) => ({
          id: anuncio.id,
          titulo: anuncio.titulo,
          preco: anuncio.preco,
          quantidadeProduto: anuncio.quantidadeProdutos,
          ativo: anuncio.ativo,
          dataCriacao: anuncio.dataCriacao,
          descricao: anuncio.descricao,
          imagem: anuncio.imagensLinks[0],
        }));
        setMeusAnuncios(anunciosFormatados);
      } else {
        setMeusAnuncios([]);
      }
    } catch (err) {
      console.error('Erro ao buscar seus anúncios', err);
    }
  };

  const deleteAnuncioSubmit = async (idAnuncio: number) => {
    try {
      await deleteAnuncio(idAnuncio);
      setModalConfirmarExclusao(false);
      setTimeout(() => {
        toast.success('Anúncio excluído com sucesso!', { autoClose: 2000 });
      }, 500);
      
      setTimeout(() => {
        window.location.reload(); 
      }, 500);

    } catch (err) {
      console.error('Erro ao excluir o anúncio', err);
    }
  };

  useEffect(() => {
    if (userId) {
      updateListaAnuncios();
    }
  }, [userId]);

  const closeModalConfirmarExclusao = () => {
    setModalConfirmarExclusao(false);
  };

  return {
    updateStatusAnuncioSubmit,
    meusAnuncios, 
    setMeusAnuncios,
    deleteAnuncioSubmit,
    modalConfirmarExclusao,
    setModalConfirmarExclusao,
    closeModalConfirmarExclusao
  };
};
