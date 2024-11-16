import axios from 'axios';
import { IVendedor } from '../interfaces/IVendedor';
import { convertFileToBase64 } from '@/utils/base64Utils';
import { store } from '@/store/store';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_USUARIOS_URL,
});

const vendedorApiUrl = process.env.NEXT_PUBLIC_API_VENDEDORES as string;

const getAuthToken = () => {
    const state = store.getState();
    return state.user.token;
};

export const getVendedorByUsuarioId = async (id: number) => {
    try {
        const response = await api.get(`${vendedorApiUrl}/${id}`,  {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data || 'Erro ao buscar vendedor';
            throw new Error(errorMessage);
        } else {
            throw new Error('Erro inesperado ao buscar vendedor');
        }
    }
};

export const createVendedor = async (usuarioId: number, vendedorData: IVendedor, imagem?: File | null) => {
    try {
        let imagemBase64: string | null = null;
        
        if (imagem) {
            imagemBase64 = await convertFileToBase64(imagem);
        }

        const requestBody = {
            ...vendedorData,
            imagemPerfil: imagemBase64 
        };
        console.log(requestBody)
        const response = await api.post(`${vendedorApiUrl}/${usuarioId}`, requestBody, 
            {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            }
        );
        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Erro na requisição de criação do vendedor:', error.response?.data);
            throw new Error(error.response?.data || 'Erro ao criar vendedor');
        } else {
            throw new Error('Erro inesperado ao criar vendedor');
        }
    }
};

export const updateVendedor = async (id: number, vendedorData: IVendedor, imagem?: File | null) => {
    try {
        let imagemBase64: string | null = null;

        if (imagem) {
            imagemBase64 = await convertFileToBase64(imagem);
        }

        const requestBody = {
            ...vendedorData,
            imagemPerfil: imagemBase64 
        };

        const response = await api.put(`${vendedorApiUrl}/${id}`, requestBody,  {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.data.errors[0]) {
                throw new Error(error.response?.data.errors[0].message);
            }
            const generalErrorMessage = error.response?.data || 'Erro ao atualizar vendedor';
            throw new Error(generalErrorMessage);
        } else {
            throw new Error('Erro inesperado ao atualizar vendedor');
        }
    }
};

export const deleteVendedor = async (id: number) => {
    try {
        await api.delete(`${vendedorApiUrl}/${id}`);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data || 'Erro ao deletar vendedor';
            throw new Error(errorMessage);
        } else {
            throw new Error('Erro inesperado ao deletar vendedor');
        }
    }
};

export const preencherEnderecoVendedor = async (id: number, enderecoData: any) => {
    try {
        const response = await api.post(`${vendedorApiUrl}/endereco/${id}`, enderecoData,  {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data || 'Erro ao preencher endereço do vendedor';
            throw new Error(errorMessage);
        } else {
            throw new Error('Erro inesperado ao preencher endereço do vendedor');
        }
    }
};

export const atualizarEnderecoVendedor = async (id: number, enderecoData: any) => {
    try {
        await api.patch(`${vendedorApiUrl}/endereco/${id}`, enderecoData,  {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data || 'Erro ao atualizar endereço do vendedor';
            throw new Error(errorMessage);
        } else {
            throw new Error('Erro inesperado ao atualizar endereço do vendedor');
        }
    }
};
