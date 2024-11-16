"use client";

import React from 'react';
import useFormularioLogin from '../hooks/useLogin'; 
import Botao from './Botao'; 
import Link from 'next/link'; 
import ErrorMessage from './ErrorMessage'; 
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import LoadingDots from '@/utils/loading/LoadingDots';

const FormularioLogin: React.FC = () => {
    const {
        formData,
        handleChange,
        handleSubmit,
        handleResendEmailHook, 
        isResendDisabled,
        countdown,
        modalReenviarEmail,
        closeModalReenviarEmail,
        msgError,
        msgErrorLogin,
        modalErro,
        closeModalErro,
        loading,
        showPassword,
        togglePasswordVisibility
    } = useFormularioLogin(); 

    return (
        <div className="max-w-lg mx-auto bg-white border border-gray-300 shadow-md mt-24 rounded-xl m-32">
            <div className="bg-mainColor w-full py-8 px-14 flex justify-center items-center rounded-xl">
                <h2 className="text-2xl font-semibold text-white">Faça seu login</h2>
            </div>

            <form onSubmit={handleSubmit} className="px-16 py-8">
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='usuario@gmail.com'
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                        Senha
                    </label>
                    <div className="relative mt-1">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="senha"
                            name="senha"
                            value={formData.senha}
                            onChange={handleChange}
                            placeholder='********************'
                            className="block w-full p-2 border border-gray-300 rounded-md pl-2 pr-10" // Ajusta o padding direito
                        />
                        <FontAwesomeIcon
                            style={{ fontSize: '1rem' }}
                            className='absolute right-2 top-1/2 transform -translate-y-1/2 text-mainColor cursor-pointer'
                            icon={showPassword ? faEyeSlash : faEye}
                            onClick={togglePasswordVisibility}
                        />
                    </div>
                </div>

                <LoadingDots isLoading={loading} />

                <div className="mt-7">
                    {msgError && <ErrorMessage message={msgError} />}
                </div>

                <p className="text-xs text-left mt-4">
                    Esqueceu sua senha?{' '}
                    <Link href="/recuperarsenha" className="text-secondaryColor no-underline">
                        Recuperar senha
                    </Link>
                </p>

                <Botao
                    type="submit"
                    className="w-full h-11 py-2 px-4 bg-mainColor text-white font-semibold rounded-xl mt-6"
                >
                    Entrar
                </Botao>

                <p className="text-md text-center mt-8">
                    Não possui conta?{' '}
                    <Link href="/cadastro" className="text-secondaryColor no-underline">
                        Cadastre-se.
                    </Link>
                </p>
            </form>

            <Modal isOpen={modalReenviarEmail} onClose={closeModalReenviarEmail}>
                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg">
                    <FontAwesomeIcon style={{fontSize: '4rem'}} className='text-errorColor mb-5' icon={faCircleXmark} />
                    <h1 className="text-3xl font-bold text-errorColor mb-4">Oops!</h1>
                    <p className="text-gray-600 mt-4 text-center">
                        Email não confirmado. <br/>
                        Por favor, verifique sua caixa de entrada!
                    </p>
                    <div className='flex-row gap-5 flex'>
                        <Botao  
                            type="button" 
                            onClick={() => handleResendEmailHook()}
                            className="mt-8 border border-errorColor text-errorColor font-semibold px-6 py-3"
                            disabled={isResendDisabled}
                        >
                            {countdown > 0 ? `Reenviar e-mail (${countdown})` : 'Reenviar e-mail'}
                        </Botao>
                        <Botao 
                            type="button" 
                            onClick={closeModalReenviarEmail} 
                            className="mt-8 bg-errorColor text-white font-semibold px-6 py-3">
                            Fechar
                        </Botao>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={modalErro} onClose={closeModalErro}>
                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg">
                    <FontAwesomeIcon style={{fontSize: '4rem'}} className='text-errorColor mb-5' icon={faCircleXmark} />
                    <h1 className="text-3xl font-bold text-errorColor mb-4">Erro ao logar!</h1>
                    <p className="text-gray-500 mt-4 text-center">
                        {msgErrorLogin}
                    </p>
                    <Botao 
                        type="button" 
                        onClick={closeModalErro} 
                        className="mt-8 bg-errorColor text-white font-semibold px-6 py-3">
                        Fechar
                    </Botao>
                </div>
            </Modal>
        </div>
    );
};

export default FormularioLogin;
