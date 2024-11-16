import { useState, useEffect } from 'react';
import { validateNome, validateEmail, validateSenha, validateCpf, validateNomeChange, validateCpfChange } from '@/utils/validators/usuarioValidator';
import { formatCpf } from '@/utils/regex/cpfRegex';
import { createUser, resendEmail } from '@/services/userService';
import { formatNome } from '@/utils/regex/nomeRegex';

export default function useFormularioCadastroUsuario() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        cpf: '',
    });

    const [errors, setErrors] = useState({
        nome: '',
        email: '',
        senha: '',
        cpf: '',
    });

    const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
    const [modalFalhaVisible, setModalFalhaVisible] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<number>(0);
    const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [msgError, setMsgError] = useState<string>();
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        clearFieldError(name);
    
        validateFieldChange(e);

        const formatters: { [key: string]: (val: string) => string } = {
            cpf: formatCpf,
            nome: formatNome,
        };
    
        const formattedValue = formatters[name] ? formatters[name](value) : value;
        setFormData((prevData) => ({ ...prevData, [name]: formattedValue }));
    };

    const validateFieldChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;

        const validators: { [key: string]: (val: string) => string[] } = {
            nome: validateNomeChange,
            cpf: validateCpfChange,
        };
    
        const validate = validators[name];
        const errorMsg = validate ? validate(value) : [];

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMsg.length > 0 ? errorMsg.join(', ') : '',
        }));
    };
    

    const validateFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
    
        const validators: { [key: string]: (val: string) => string[] } = {
            nome: validateNome,
            email: validateEmail,
            senha: validateSenha,
            cpf: validateCpf,
        };
    
        const validate = validators[name];
        const errorMsg = validate ? validate(value) : [];
    
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMsg.length > 0 ? errorMsg.join(', ') : '',
        }));
    };
    
    const clearFieldError = (name: string) => {
        setErrors({
            ...errors,
            [name]: '', 
        });
    };
    
    const validateAllFields = () => {
        const newErrors = {
            nome: validateNome(formData.nome).join(', '),
            email: validateEmail(formData.email).join(', '),
            senha: validateSenha(formData.senha).join(', '),
            cpf: validateCpf(formData.cpf).join(', '),
        };

        setErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validateAllFields()) {
            try {
                setLoading(true);
    
                const sanitizedCpf = formData.cpf.replace(/\D/g, '');
                
                const response = await createUser({
                    nome: formData.nome,
                    email: formData.email,
                    password: formData.senha,
                    cpf: sanitizedCpf, 
                });
    
                if (response.status === 201 || response.status === 200) {
                    setModalSucessoVisible(true); 
                }

            } catch (error: any) {
                console.log(error)

                setModalFalhaVisible(true);
                setMsgError(error.data || "Erro ao criar usuário.");
            } finally {
                setLoading(false); 
            }
        }
    };    

    const closeModalSucesso = () => {
        setModalSucessoVisible(false);
        setLoading(false);
        setFormData({
            nome: '',
            email: '',
            senha: '',
            cpf: ''
        });
    };

    const closeModalFalha = () => {
        setModalFalhaVisible(false);
        setLoading(false);  
    };

    const handleResendEmailHook = async () => {
        try {
            console.log('Reenviando email...');
            setCountdown(30);
            setIsResendDisabled(true);
            console.log(formData.email)
            await resendEmail(formData.email);
        } catch (error) {
            console.error("Erro ao reenviar e-mail:", error);
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

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return {
        formData,
        handleChange,
        handleSubmit,
        validateFieldBlur,
        errors,
        modalSucessoVisible,
        closeModalSucesso,
        handleResendEmailHook,
        isResendDisabled,
        countdown,
        loading,  
        modalFalhaVisible,
        closeModalFalha,
        msgError,
        showPassword,
        togglePasswordVisibility
    };
};
