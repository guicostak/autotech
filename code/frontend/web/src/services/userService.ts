import axios from 'axios';
import IUsuario from '../interfaces/IUsuario';
import { IUsuarioPerfil } from '@/interfaces/IUsuarioPerfil';
import { convertFileToBase64 } from '@/utils/base64Utils';
import { store } from '@/store/store';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_USUARIOS_URL,
});

const usuarioUrl = process.env.NEXT_PUBLIC_API_USUARIO as string;
const confirmEmailUrl = process.env.NEXT_PUBLIC_API_CONFIRM_EMAIL_TOKEN as string;
const resendEmailUrl = process.env.NEXT_PUBLIC_API_USUARIO_RESEND_EMAIL as string;
const emailRecuperarSenhaUrl = process.env.NEXT_PUBLIC_API_RECUPERAR_SENHA_EMAIL as string;
const recuperarSenhaUrl = process.env.NEXT_PUBLIC_API_RECUPERAR_SENHA as string;
const viacep = process.env.NEXT_PUBLIC_API_ENDERECO_VIACEP as string;

const getAuthToken = () => {
    const state = store.getState();
    return state.user.token;
};

export const getUserById = async (id: number) => {
    try {
        const response = await api.get(`${usuarioUrl}/${id}`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data || 'Erro ao buscar usuário';
            throw new Error(errorMessage);
        } else {
            throw new Error('Erro inesperado ao buscar usuário');
        }
    }
};

export const preencherEndereco = async (id: number, enderecoData: any) => {
    try {
        const response = await api.post(`${usuarioUrl}/endereco/${id}`, enderecoData, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        }
            
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data || 'Erro ao preencher endereço';
            throw new Error(errorMessage);
        } else {
            throw new Error('Erro inesperado ao preencher endereço');
        }
    }
};

export const atualizarEndereco = async (id: number, enderecoData: any) => {
    try {
        const response = await api.patch(`${usuarioUrl}/endereco/${id}`, enderecoData, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data || 'Erro ao atualizar endereço';
            throw new Error(errorMessage);
        } else {
            throw new Error('Erro inesperado ao atualizar endereço');
        }
    }
};


export const completarPerfil = async (id: number, profileData: any) => {
    try {
        const response = await api.patch(
            `${usuarioUrl}/${id}`,
            profileData,
            {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data || 'Erro ao completar perfil';
            throw new Error(errorMessage);
        } else {
            throw new Error('Erro inesperado ao completar perfil');
        }
    }
};

export const updateUser = async (userData: IUsuarioPerfil, id: number, token?: string | null, imagem?: File | null) => {
    try {
        console.log(imagem)
        let imagemBase64: string | null = null;
        
        if (imagem) {
            imagemBase64 = await convertFileToBase64(imagem);
        }

        const requestBody = {
            ...userData,
            imagemPerfil: imagemBase64 
        };

        const response = await api.put(`${usuarioUrl}/${id}`, requestBody, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${getAuthToken()}`
            },
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if(error.response?.data.errors[0]) {
                throw new Error(error.response?.data.errors[0].message);
            }
            
            const errorData = error.response?.data;
            console.log(error)

            const generalErrorMessage = errorData || 'Erro ao atualizar usuário';
            throw new Error(generalErrorMessage);
        } else {
           
            throw new Error('Erro inesperado ao atualizar usuário');
        }
    }
};

export const createUser = async (userData: IUsuario) => {
    try {
        const response = await api.post(usuarioUrl, userData);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response;
        } else {
            throw new Error('Servidor indisponível');
        }
    }
};

export const confirmEmail = async (token: string) => {
    try {
        console.log('Iniciando confirmação de e-mail com o token:', token);

        const response = await api.get(`${usuarioUrl}${confirmEmailUrl}/${token}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data;
            throw new Error(errorMessage);
        } else {
            throw new Error('Erro inesperado ao confirmar o e-mail');
        }
    }
};

export const resendEmail = async (email: string) => {
    try {
        const response = await api.post(resendEmailUrl, { email });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data || 'Erro ao reenviar e-mail';
            throw new Error(errorMessage);
        } else {
            throw new Error('Erro inesperado ao reenviar e-mail');
        }
    }
};

export const enviarEmailRecuperacaoSenha = async (email: string): Promise<any> => {
    try {
        const response = await api.post(`${emailRecuperarSenhaUrl}?email=${email}`);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response
        }
    }
};

export const recuperarSenha = async (senha: string, token: string): Promise<any> => {
    try {
        const response = await api.post(recuperarSenhaUrl, { senha, token });
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error;
        }
    }
};

export const buscarEnderecoPorCep = async (cep: string) => {
    try {
        const response = await axios.get(`${viacep}/${cep}/json/`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data || 'Erro ao buscar endereço pelo CEP';
            throw new Error(errorMessage);
        } else {
            throw new Error('Erro inesperado ao buscar endereço pelo CEP');
        }
    }
};




