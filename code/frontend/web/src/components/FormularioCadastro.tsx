"use client";
import useFormularioCadastroUsuario from '../hooks/useCadastroUsuario';
import Botao from './Botao';
import Link from 'next/link';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import ErrorMessage from './ErrorMessage'; 
import LoadingDots from '@/utils/loading/LoadingDots';

const FormularioCadastro: React.FC = () => {
    const { formData, handleChange, handleSubmit, validateFieldBlur, errors, modalSucessoVisible, closeModalSucesso, 
        handleResendEmailHook, loading, modalFalhaVisible, closeModalFalha, countdown, isResendDisabled, showPassword,
        togglePasswordVisibility, msgError
     } = useFormularioCadastroUsuario();

    return (
        <div className="max-w-lg mx-auto bg-white border border-gray-300 shadow-md mt-24 rounded-xl mb-6">
            <div className="bg-mainColor w-full py-8 px-14 flex justify-center items-center rounded-xl">
                <h2 className="text-2xl font-semibold text-white">Crie sua conta. É grátis!</h2>
            </div>

            <form onSubmit={handleSubmit} className="px-16 py-8 justify-center align-middle flex flex-col">
                <div className="mb-4">
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                        Nome completo
                    </label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        maxLength={100} 
                        placeholder='Ex: João Gomes'
                        alt='nome'
                        value={formData.nome}
                        onChange={handleChange}
                        onBlur={validateFieldBlur}
                        className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
                    />
                    {errors.nome && <ErrorMessage message={errors.nome} />}
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        maxLength={100}
                        placeholder='usuario@gmail.com'
                        alt='email'
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={validateFieldBlur}
                        className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
                    />
                    {errors.email && <ErrorMessage message={errors.email} />} 
                </div>
                <div className="mb-4">
                    <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                        Senha
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="senha"
                            name="senha"
                            value={formData.senha}
                            onChange={handleChange}
                            placeholder='********************'
                            className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-10" 
                        />
                        <FontAwesomeIcon
                            className='absolute right-2 top-1/2 transform -translate-y-1/2 text-mainColor cursor-pointer select-none'
                            icon={showPassword ? faEyeSlash : faEye}
                            onClick={togglePasswordVisibility}
                        />
                    </div>
                    {errors.senha && <ErrorMessage message={errors.senha} />}
                </div>
                <div className="mb-4">
                    <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                        CPF
                    </label>
                    <input
                        type="text"
                        id="cpf"
                        name="cpf"
                        maxLength={14}
                        placeholder='000.000.000-00'
                        alt='cpf'
                        value={formData.cpf}
                        onChange={handleChange}
                        onBlur={validateFieldBlur}
                        autoComplete='none'
                        className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
                    />
                    {errors.cpf && <ErrorMessage message={errors.cpf} />}
                </div>
                <LoadingDots isLoading={loading} />
                <Botao
                    type="submit"
                    className="w-full h-11 py-2 px-4 bg-mainColor text-white font-semibold rounded-xl mt-6"
                >
                    Cadastre-se
                </Botao>
                <p className="text-xs text-center mt-6">
                    Ao continuar você concorda com os{' '}
                    <Link href="/termosepoliticas" className="text-secondaryColor no-underline">
                        Termos de Uso
                    </Link>{' '}
                    da Autotech.
                </p>
                <p className="text-md text-center mt-8">
                    Já possui cadastro?{' '}
                    <Link href="/entrar" className="text-secondaryColor no-underline">
                        Entrar.
                    </Link>
                </p>
            </form>

            <Modal isOpen={modalSucessoVisible} onClose={closeModalSucesso}>
                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg">
                    <FontAwesomeIcon style={{fontSize: '4rem'}} className='text-mainColor mb-5' icon={faCircleCheck} />
                    <h1 className="text-3xl font-bold text-mainColor mb-4">Cadastro Concluído!</h1>
                    <p className="text-gray-600 mt-4 text-center">
                        Parabéns! Seu cadastro foi realizado com sucesso. <br/>
                        Um e-mail de confirmação foi enviado para o endereço informado.
                    </p>
                    <div className='flex-row gap-5 flex'>
                        <Botao  
                            type="button" 
                            onClick={() => handleResendEmailHook()}
                            className="mt-8 border border-mainColor text-mainColor font-semibold px-6 py-3"
                            disabled={isResendDisabled}
                        >
                            {countdown > 0 ? `Reenviar e-mail (${countdown})` : 'Reenviar e-mail'}
                        </Botao>
                        <Botao 
                            type="button" 
                            onClick={closeModalSucesso} 
                            className="mt-8 bg-mainColor text-white font-semibold px-6 py-3">
                            Fechar
                        </Botao>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={modalFalhaVisible} onClose={closeModalFalha}>
                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg">
                    <FontAwesomeIcon style={{fontSize: '4rem'}} className='text-errorColor mb-5' icon={faCircleXmark} />
                    <h1 className="text-3xl font-bold text-errorColor mb-4">Erro ao cadastrar!</h1>
                    <p className="text-gray-500 mt-4 text-center">
                        {msgError}
                    </p>
                    <Botao 
                        type="button" 
                        onClick={closeModalFalha} 
                        className="mt-8 bg-errorColor text-white font-semibold px-6 py-3">
                        Fechar
                    </Botao>
                </div>
            </Modal>
        </div>
    );
};

export default FormularioCadastro;
