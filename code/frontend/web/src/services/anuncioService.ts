import axios from 'axios';
import { IAnuncio } from '../interfaces/IAnuncio';
import { formatarValor } from '@/utils/stringUtils';
import { IFiltros } from '@/interfaces/IFiltros';
import { store } from '@/store/store';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_ANUNCIOS_URL,
});

const getAuthToken = () => {
    const state = store.getState();
    return state.user.token;
};

const apiUrl = process.env.NEXT_PUBLIC_API_ANUNCIO as string;

    export const criarAnuncio = async (
        anuncioData: IAnuncio, 
        imagens: File[], 
        userId: number | null, 
        pessoaJuridica: boolean
    ) => {
        try {
            const body = {
                titulo: anuncioData.titulo,
                modelo: anuncioData.modelo,
                descricao: anuncioData.descricao,
                marca: anuncioData.marca,
                categoria: anuncioData.categoria,
                preco: Number(formatarValor(anuncioData.preco)),
                quantidade_produtos: anuncioData.quantidadeProduto,
                ano_fabricacao: Number(anuncioData.ano_fabricacao),
                anunciante_id: Number(userId),
                is_vendedor: pessoaJuridica,
            };

            const formData = new FormData();

            imagens.forEach((imagem) => {
                formData.append('imagens', imagem);
            });

            formData.append('anuncio', new Blob([JSON.stringify(body)], { type: 'application/json' }));

            const response = await api.post(apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
            });

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data || 'Erro ao criar anúncio';
                throw new Error(errorMessage);
            } else {
                throw new Error('Erro inesperado ao criar anúncio');
            }
        }
    };

export const updateStatusAnuncio = async (idAnuncio: number, status: boolean) => {
    try {
        const response = await api.patch(`${apiUrl}/${idAnuncio}`, {
            ativo: status 
        }, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data || 'Erro ao atualizar o status do anúncio';
            throw new Error(errorMessage);
        } else {
            throw new Error('Erro inesperado ao atualizar o status do anúncio');
        }
    }
};

export const deleteAnuncio = async (idAnuncio: number) => {
    try {
        const response = await api.delete(`${apiUrl}/${idAnuncio}`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data || 'Erro ao atualizar o status do anúncio';
            throw new Error(errorMessage);
        } else {
            throw new Error('Erro inesperado ao atualizar o status do anúncio');
        }
    }
};

export const consultarAnuncio = async (id: number): Promise<IAnuncio> => {
    try {
        const response = await api.get(`${apiUrl}/${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data || 'Erro ao consultar anúncio';
            throw new Error(errorMessage);
        } else {
            throw new Error('Erro inesperado ao consultar anúncio');

        }
    }
}

export const consultarAnunciosByIdUsuario = async (usuarioId? : string | null): Promise<IAnuncio> => {
    try {
        const response = await api.get(`${apiUrl}/usuarios/${usuarioId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data || 'Erro ao consultar anúncio';
            throw new Error(errorMessage);
        } else {
            throw new Error('Erro inesperado ao consultar anúncio');

        }
    }

}

export const getAnunciosByFiltros = async (
    filtros: IFiltros,  
) => {
    const queryParams = new URLSearchParams();
    
    if (filtros.marca) {
        queryParams.append('marca', filtros.marca);
    }
    if (filtros.modelo) {
        queryParams.append('modelo', filtros.modelo);
    }
    if (filtros.categoria) {
        queryParams.append('categoria', filtros.categoria);
    }
    if (filtros.precoMin !== null) {
        queryParams.append('precoMin', filtros.precoMin);
    }
    if (filtros.precoMax !== null) {
        queryParams.append('precoMax', filtros.precoMax);
    }
    if (filtros.anoFabricacao !== null) {
        queryParams.append('anoFabricacao', filtros.anoFabricacao.toString());
    }
    if (filtros.valorPesquisado !== null) {
        queryParams.append('valorPesquisado', filtros.valorPesquisado.toString());
    }
    if (filtros.tipoAnuncio !== null) {
        queryParams.append('tipoAnuncio', filtros.tipoAnuncio);
    }

    queryParams.append('page', filtros.page);
    queryParams.append('size', filtros.size);
    queryParams.append('campoOrdenacao', filtros.campoOrdenacao);
    queryParams.append('ordenacao', filtros.ordenacao);

    try {
        const response = await api.get(`${apiUrl}?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data || 'Erro ao buscar anúncios';
            throw new Error(errorMessage);
        } else {
            throw new Error('Erro inesperado ao buscar anúncios');
        }
    }
};

        
export const getAnuncioById = async (idAnuncio: number) => {
    try {
        const response = await api.get(`${apiUrl}/${idAnuncio}`)
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data || 'Erro ao buscar o anúncio';
            throw new Error(errorMessage);
        } else {
            throw new Error('Erro inesperado ao buscar o anúncio');
        }
    }
};

export const getAnunciosByIdUsuario = async (idUsuario?: string | null) => {
    try {
        const response = await api.get(`${apiUrl}/usuarios/${idUsuario}`,
            {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data || 'Erro ao buscar o anúncio';
            throw new Error(errorMessage);
        } else {
            throw new Error('Erro inesperado ao buscar o anúncio');
        }
    }
};

export const getAnunciosByListIDs = async (listaIds: number[]) => {
    try {
        const response = await api.post(`${apiUrl}/listagem`, {
            listaids: listaIds 
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data || 'Erro ao buscar o anúncio';
            throw new Error(errorMessage);
        } else {
            throw new Error('Erro inesperado ao buscar o anúncio');
        }
    }
};
