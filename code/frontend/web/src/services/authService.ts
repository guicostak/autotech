import IUsuarioLogin from '@/interfaces/IUsuarioLogin';
import axios from 'axios';
import { login as reduxLogin } from '@/store/userSlice'; 
import { AppDispatch } from '@/store/store'; 
import IAuthValidate from '@/interfaces/IAuthValidate';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_USUARIOS_URL,
});

const loginUrl = `${process.env.NEXT_PUBLIC_API_AUTH_LOGIN}`;
const authenticateUrl = `${process.env.NEXT_PUBLIC_API_AUTH}`;

export const login = async (credentials: IUsuarioLogin, dispatch: AppDispatch) => {
    try {
        const response = await api.post(loginUrl, credentials);

        if (response.status === 200 || response.status === 201) {
            const { expires, refresh_token,  access_token, name, email, id, imagem } = response.data;

            localStorage.setItem('id', id);
            localStorage.setItem('refreshToken', refresh_token);
            localStorage.setItem('token', access_token);
            localStorage.setItem('name', name);
            localStorage.setItem('email', email);
            localStorage.setItem('imagem', imagem);
            localStorage.setItem('expires', expires);

            dispatch(reduxLogin({expires: expires , refreshToken: refresh_token, token: access_token, userInfo: { name, email, id, imagem } }));

            return response;
        }

    } catch (error) {

        if (axios.isAxiosError(error) && error.response) {
            throw error.response;
        } else {
            throw new Error('Servidor indisponível');
        }
    }
};

export const authenticate = async (credentials: IAuthValidate, dispatch: AppDispatch) => {
    try {
        const response = await api.post(`${authenticateUrl}`, {
            refresh_token: credentials.refreshToken,
            email: credentials.email
        });

        if (response.status === 200 || response.status === 201) {
            const { expires, refresh_token,  access_token, name, email, id, imagem } = response.data;

            localStorage.setItem('id', id);
            localStorage.setItem('refreshToken', refresh_token);
            localStorage.setItem('token', access_token);
            localStorage.setItem('name', name);
            localStorage.setItem('email', email);
            localStorage.setItem('imagem', imagem);
            localStorage.setItem('expires', expires);

            dispatch(reduxLogin({expires: expires , refreshToken: refresh_token, token: access_token, userInfo: { name, email, id, imagem } }));

            return response;
        }

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response;
        } else {
            throw new Error('Servidor indisponível');
        }
    }
};


