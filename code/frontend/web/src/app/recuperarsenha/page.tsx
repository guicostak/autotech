"use client";
import { usePathname } from "next/navigation"
import Navbar from "@/components/Navbar";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingDots from "@/utils/loading/LoadingDots";
import Botao from "@/components/Botao";
import Modal from "@/components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import useResetSenha from "@/hooks/useResetSenha";

export default function RecuperarSenha() {
  const pathname = usePathname()
  const { handleSubmitEnvioEmailRecuperacao, emailRecuperacao, setEmailRecuperacao, errorMsgEmailRecuperacao, loading, 
    validateEmailRecuperacaoBlur, modalEmailEnviadoVisible, closeModalEmailEnviado, isResendDisabled, countdown,
    handleResendEmailHook, responseMsgEmail, msgErrorEmailRecuperacaoModal, modalFalhaVisible, closeModalFalha, handleEmailRecuperacaoChange  
   } = useResetSenha();

  return (
    <body className="bg-mainBackground pb-10 h-full w-full">
      <Navbar/>

      <div className="max-w-lg mx-auto bg-white border border-gray-300 shadow-md mt-24 rounded-xl m-32">
        <div className="bg-mainColor w-full py-8 px-14 flex justify-center items-center rounded-xl">
          <h2 className="text-2xl font-semibold text-white">Recupere sua senha</h2>
        </div>

        <form onSubmit={handleSubmitEnvioEmailRecuperacao} className="px-16 py-8">

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
            </label>
            <input
                type="email"
                id="email"
                name="email"
                value={emailRecuperacao}
                onChange={handleEmailRecuperacaoChange}
                onBlur={validateEmailRecuperacaoBlur}
                placeholder='Digite o email cadastrado'
                className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
            />
          </div>

          {errorMsgEmailRecuperacao && <ErrorMessage message={errorMsgEmailRecuperacao} />}

          <LoadingDots isLoading={loading} />
                
          <Botao
              type="submit"
              className="w-full h-11 py-2 px-4 bg-mainColor text-white font-semibold rounded-xl mt-6"
          >
              Enviar email de recuperação
          </Botao>
        </form>
      </div>

      <Modal isOpen={modalEmailEnviadoVisible} onClose={closeModalEmailEnviado}>
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg">
            <FontAwesomeIcon style={{fontSize: '4rem'}} className='text-mainColor mb-5' icon={faCircleCheck} />
            <h1 className="text-3xl font-bold text-mainColor mb-4">Email enviado!</h1>
            <p className="text-gray-600 mt-4 text-center">
            {responseMsgEmail}
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
                    onClick={closeModalEmailEnviado} 
                    className="mt-8 bg-mainColor text-white font-semibold px-6 py-3">
                    Fechar
                </Botao>
            </div>
        </div>
      </Modal>

      <Modal isOpen={modalFalhaVisible} onClose={closeModalFalha}>
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg">
            <FontAwesomeIcon style={{fontSize: '4rem'}} className='text-errorColor mb-5' icon={faCircleXmark} />
            <h1 className="text-3xl font-bold text-errorColor mb-4">Erro ao enviar email!</h1>
            <p className="text-gray-500 mt-4 text-center">
                {msgErrorEmailRecuperacaoModal}
            </p>
            <Botao 
                type="button" 
                onClick={closeModalFalha} 
                className="mt-8 bg-errorColor text-white font-semibold px-6 py-3">
                Fechar
            </Botao>
        </div>
        </Modal>
    </body>
  );
}
