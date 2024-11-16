import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserInfo {
  id: string | null;
  name: string | null;
  email: string | null;
  imagem: string | null; 
}

interface UserState {
  refreshToken: string | null;
  token: string | null;
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
  expires: number | null; 
}

const initialState: UserState = {
  refreshToken: null,
  token: null,
  userInfo: null,
  isLoggedIn: false,
  expires: null, 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ refreshToken: string; token: string; userInfo: UserInfo; expires: string }>) => {
      const { refreshToken, token, userInfo, expires } = action.payload;
      state.refreshToken = refreshToken;
      state.token = token;
      state.userInfo = userInfo;
      state.isLoggedIn = true;
      state.expires = new Date(expires).getTime(); 

      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('token', token);
      localStorage.setItem('expires', state.expires.toString()); 
      if (userInfo.id) localStorage.setItem('id', userInfo.id);
      if (userInfo.name) localStorage.setItem('name', userInfo.name);
      if (userInfo.email) localStorage.setItem('email', userInfo.email);
      if (userInfo.imagem) localStorage.setItem('imagem', userInfo.imagem);
    },

    logout: (state) => {
      state.refreshToken = null;
      state.token = null;
      state.userInfo = null;
      state.isLoggedIn = false;
      state.expires = null;

      localStorage.removeItem('refreshToken');
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('imagem');
      localStorage.removeItem('expires');
    },

    checkUserSession: (state) => {
      const refreshToken = localStorage.getItem('refreshToken');
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id');
      const name = localStorage.getItem('name');
      const email = localStorage.getItem('email');
      const imagem = localStorage.getItem('imagem');
      const expires = localStorage.getItem('expires');
      const currentTime = Date.now();

      if (refreshToken && token && id && name && email && imagem && expires) {
        state.refreshToken = refreshToken;
        state.token = token;
        state.userInfo = { id, name, email, imagem };
        state.isLoggedIn = true;
        state.expires = parseInt(expires, 10);

        if (currentTime > state.expires) {
          console.warn("Token expirado, mas o usuário permanece logado.");
        }
      }
    },

    updateUserInfo: (state, action: PayloadAction<{ name: string; email: string }>) => {
      if (state.userInfo) {
        const { name, email } = action.payload;
        state.userInfo.name = name;
        state.userInfo.email = email;

        if (name) localStorage.setItem('name', name);
        if (email) localStorage.setItem('email', email);
      }
    },
  },
});

export const { login, logout, checkUserSession, updateUserInfo } = userSlice.actions;
export default userSlice.reducer;
