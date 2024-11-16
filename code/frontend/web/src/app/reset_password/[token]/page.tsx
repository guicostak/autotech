"use client";
import { useParams } from "next/navigation"
import Navbar from "@/components/Navbar";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingDots from "@/utils/loading/LoadingDots";
import Botao from "@/components/Botao";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useResetSenha from "@/hooks/useResetSenha";
import { useEffect } from "react";
import Modal from "@/components/Modal";

export default function ResetSenha() {
  const { token } = useParams<{ token: string | string[] }>(); 
  const tokenString = Array.isArray(token) ? token[0] : token;

  const { handleSubmitRecuperarSenha, showPassword, formSenha, handleChange, togglePasswordVisibility, showConfirmPassword,
    toggleConfirmPasswordVisibility, loading, errors, validateFieldBlur, setTokenResetSenha, msgErrorResetSenha, modalRecuperarSenhaFalha,
    closeModalRecuperarSenhaFalha, modalRecuperarSenhaSucesso, closeModalRecuperarSenhaSucesso
   } = useResetSenha();

   useEffect(() => {
    setTokenResetSenha(tokenString);
  }, [tokenString, setTokenResetSenha]);

  return (
    <body className="bg-mainBackground pb-10 h-full w-full">
      <Navbar isOnAuthPage={false} />

      <div className="max-w-lg mx-auto bg-white border border-gray-300 shadow-md mt-24 rounded-xl m-32">
        <div className="bg-mainColor w-full py-8 px-14 flex justify-center items-center rounded-xl">
          <h2 className="text-2xl font-semibold text-white">Recupere sua senha</h2>
        </div>

        <form onSubmit={handleSubmitRecuperarSenha} className="px-16 py-8">

            <div className="mb-4">
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                    Senha
                </label>
                <div className="relative mt-1">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="senha"
                        name="senha"
                        value={formSenha.senha}
                        onChange={handleChange}
                        onBlur={validateFieldBlur}
                        placeholder='********************'
                        className="block w-full p-2 border border-gray-300 rounded-md pl-2 pr-10"
                    />
                    <FontAwesomeIcon
                        style={{ fontSize: '1rem' }}
                        className='absolute right-2 top-1/2 transform -translate-y-1/2 text-mainColor cursor-pointer'
                        icon={showPassword ? faEyeSlash : faEye}
                        onClick={togglePasswordVisibility}
                    />
                </div>
            </div>

            {errors.senha && <ErrorMessage message={errors.senha} />}

            <div className="mb-4 mt-6">
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                    Confirmar senha
                </label>
                <div className="relative mt-1">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmSenha"
                        name="confirmSenha"
                        value={formSenha.confirmSenha}
                        onChange={handleChange}
                        onBlur={validateFieldBlur}
                        placeholder='********************'
                        className="block w-full p-2 border border-gray-300 rounded-md pl-2 pr-10"
                    />
                    <FontAwesomeIcon
                        style={{ fontSize: '1rem' }}
                        className='absolute right-2 top-1/2 transform -translate-y-1/2 text-mainColor cursor-pointer'
                        icon={showPassword ? faEyeSlash : faEye}
                        onClick={toggleConfirmPasswordVisibility}
                    />
                </div>
            </div>

          {errors.confirmSenha && <ErrorMessage message={errors.confirmSenha} />}

          <LoadingDots isLoading={loading} />
                
          <Botao
              type="submit"
              className="w-full h-11 py-2 px-4 bg-mainColor text-white font-semibold rounded-xl mt-6"
          >
              Atualizar senha
          </Botao>
        </form>
      </div>
      <Modal isOpen={modalRecuperarSenhaSucesso} onClose={closeModalRecuperarSenhaSucesso}>
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg">
            <FontAwesomeIcon style={{fontSize: '4rem'}} className='text-mainColor mb-5' icon={faCircleCheck} />
            <h1 className="text-3xl font-bold text-center text-mainColor mb-4">Senha alterada com sucesso!</h1>
            <p className="text-gray-600 mt-4 text-center">
                Você será redirecionado para a página de login...
            </p>
        </div>
      </Modal>

      <Modal isOpen={modalRecuperarSenhaFalha} onClose={closeModalRecuperarSenhaFalha}>
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg">
            <FontAwesomeIcon style={{fontSize: '4rem'}} className='text-errorColor mb-5' icon={faCircleXmark} />
            <h1 className="text-3xl font-bold text-errorColor mb-4">Erro ao recuperar senha!</h1>
            <p className="text-gray-500 mt-4 text-center">
                {msgErrorResetSenha}
            </p>
            <Botao 
                type="button" 
                onClick={closeModalRecuperarSenhaFalha} 
                className="mt-8 bg-errorColor text-white font-semibold px-6 py-3">
                Fechar
            </Botao>
        </div>
        </Modal>



    </body>
  );
}
