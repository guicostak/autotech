import { enviarEmailRecuperacaoSenha, recuperarSenha } from "@/services/userService";
import { validateConfirmSenha, validateEmail, validateSenha } from "@/utils/validators/usuarioValidator";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

export default function useResetSenha() {
    const [emailRecuperacao, setEmailRecuperacao] = useState<string>(""); 
    const [errorMsgEmailRecuperacao, setErrorMsgEmailRecuperacao] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [countdown, setCountdown] = useState<number>(0);
    const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
    const [modalEmailEnviadoVisible, setModalEmailEnviadoVisible] = useState(false);
    const [modalFalhaVisible, setModalFalhaVisible] = useState<boolean>(false);
    const [msgErrorEmailRecuperacaoModal, setMsgErrorEmailRecuperacaoModal] = useState<string>();
    const [responseMsgEmail, setResponseMsgEmail] = useState<string>();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [tokenResetSenha, setTokenResetSenha] = useState("");
    const [msgErrorResetSenha, setMsgErrorResetSenha] = useState<string>();
    const [modalRecuperarSenhaFalha, setmodalRecuperarSenhaFalha] = useState(false);
    const [modalRecuperarSenhaSucesso, setmodalRecuperarSenhaSucesso] = useState(false);

    const [errors, setErrors] = useState({
        senha: '',
        confirmSenha: '',
    });

    const [formSenha, setFormSenha] = useState({
        senha: '',
        confirmSenha: '',
    });

    const validateFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
    
        const validators: { [key: string]: (val: string) => string[] } = {
            senha: validateSenha,
            confirmSenha: validateConfirmSenha,
        };
    
        const validate = validators[name];
        const errorMsg = validate ? validate(value) : [];
    
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMsg.length > 0 ? errorMsg.join(', ') : '',
        }));
    
        if (formSenha.senha && formSenha.confirmSenha) {
            if (formSenha.senha !== formSenha.confirmSenha) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    confirmSenha: 'As senhas não coincidem',
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    confirmSenha: '', 
                }));
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormSenha((prevData) => ({ ...prevData, [name]: value }));

        clearFieldError(name);  
    };

    const handleEmailRecuperacaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailRecuperacao(e.target.value)
        setErrorMsgEmailRecuperacao("");
    }

    const clearFieldError = (name: string) => {
        setErrors({
            ...errors,
            [name]: '', 
        });
    };

    const validateEmailRecuperacaoBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setErrorMsgEmailRecuperacao(validateEmail(e.target.value)[0]);
    };

    const validateSubmitRecuperacaoSenha = (): boolean => {
        let error = validateEmail(emailRecuperacao);
        setErrorMsgEmailRecuperacao(error[0]); 
        return !error.length;
    };

    const handleSubmitEnvioEmailRecuperacao = async (e: React.FormEvent) => {
        e.preventDefault(); 

        if(validateSubmitRecuperacaoSenha()) {
            try {
                setLoading(true);
                const response = await enviarEmailRecuperacaoSenha(emailRecuperacao);
                console.log(response);

                if (response.status === 201 || response.status === 200) {
                    setResponseMsgEmail(response.data);
                    setModalEmailEnviadoVisible(true); 
                }
            } catch (error: any) {
                console.log(error)
                setModalFalhaVisible(true);
                if(error == undefined) { 
                    setMsgErrorEmailRecuperacaoModal("Erro ao enviar email para redefinição de senha.")
                } else { 
                    setMsgErrorEmailRecuperacaoModal(error.data);
                }
            } finally {
                setLoading(false); 
            }
        }
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else {
            setIsResendDisabled(false);
        }

        return () => clearInterval(timer);
    }, [countdown]);

    const closeModalEmailEnviado = () => {
        setModalEmailEnviadoVisible(false);
        setLoading(false);
    };

    const handleResendEmailHook = async () => {
        try {
            console.log('Reenviando email...');
            setCountdown(30);
            setIsResendDisabled(true);
            await enviarEmailRecuperacaoSenha(emailRecuperacao);
        } catch (error) {
            console.error("Erro ao reenviar e-mail:", error);
        }
    };

    const closeModalFalha = () => {
        setModalFalhaVisible(false);
        setLoading(false);  
    };

    const closeModalRecuperarSenhaFalha = () => {
        setmodalRecuperarSenhaFalha(false);
        setLoading(false);  
    };

    const closeModalRecuperarSenhaSucesso = () => {
        setmodalRecuperarSenhaSucesso(false);
        setLoading(false);  
    };

    const clearFormSenha = () => {
        setFormSenha({
            senha: '',
            confirmSenha: ''
        });
    };

    const handleSubmitRecuperarSenha = async (e: React.FormEvent) => { 
        e.preventDefault(); 

        if(validateFormSenha()) {
            try {
                setLoading(true);
                const response = await recuperarSenha(formSenha.senha, tokenResetSenha);
                console.log(response);

                if (response.status === 201 || response.status === 200) {
                    setmodalRecuperarSenhaSucesso(true);
                    clearFormSenha();

                    setTimeout(() => {
                        window.location.href = '/entrar';
                    }, 3000); 
                }   

            } catch (error: any) {
                console.log(error)
                setmodalRecuperarSenhaFalha(true);
                setMsgErrorResetSenha(error.response.data)
                
            } finally {
                setLoading(false); 
            }
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    const validateFormSenha = () => {
        const newErrors = {
            senha: validateSenha(formSenha.senha).join(', '),
            confirmSenha: validateConfirmSenha(formSenha.confirmSenha).join(', '),
        };
    
        if (formSenha.senha !== formSenha.confirmSenha) {
            newErrors.confirmSenha = 'As senhas não coincidem';
        }
    
        setErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    };
    
    
    return {
        emailRecuperacao,
        handleSubmitEnvioEmailRecuperacao,
        setEmailRecuperacao,
        errorMsgEmailRecuperacao,
        validateEmailRecuperacaoBlur,
        loading,
        countdown,
        isResendDisabled,
        modalEmailEnviadoVisible,
        closeModalEmailEnviado,
        handleResendEmailHook,
        msgErrorEmailRecuperacaoModal,
        modalFalhaVisible,
        closeModalFalha,
        responseMsgEmail,
        handleSubmitRecuperarSenha,
        showPassword,
        formSenha,
        handleChange,
        togglePasswordVisibility,
        showConfirmPassword,
        toggleConfirmPasswordVisibility,
        handleEmailRecuperacaoChange,
        errors,
        validateFieldBlur,
        setTokenResetSenha,
        msgErrorResetSenha,
        modalRecuperarSenhaFalha,
        closeModalRecuperarSenhaFalha,
        modalRecuperarSenhaSucesso,
        closeModalRecuperarSenhaSucesso
    };
}
