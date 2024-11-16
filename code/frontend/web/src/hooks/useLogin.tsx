import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { validateEmptyField } from '@/utils/validators/usuarioValidator'; 
import { login as loginService } from '@/services/authService'; 
import { resendEmail } from '@/services/userService'; 
import { useAppDispatch } from '@/store/store';
import { logout } from '@/store/userSlice';
import { toast } from 'react-toastify';

export default function useLogin() {
    const router = useRouter(); 
    const dispatch = useAppDispatch(); 

    const [formData, setFormData] = useState({
        email: '',
        senha: '',
    });
    
    const [countdown, setCountdown] = useState<number>(0);
    const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
    const [modalReenviarEmail, setModalReenviarEmail] = useState<boolean>(false);
    const [modalErro, setModalErro] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [msgError, setMsgError] = useState<string>(""); 
    const [msgErrorLogin, setMsgErrorLogin] = useState<string>(""); 
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMsgError(""); 
        setFormData({ ...formData, [name]: value }); 
    };
    
    const validateAllFields = () => {
        if(validateEmptyField(formData.email) || validateEmptyField(formData.senha)){
            setMsgError("Por favor preencha todos os campos para acessar sua conta");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        if (validateAllFields()) {
            try {
                setLoading(true);
                
                await new Promise(resolve => setTimeout(resolve, 1000));
    
                const response = await loginService({
                    email: formData.email,
                    password: formData.senha,
                }, dispatch);
    
                console.log(response);
    
                if (response && (response.status === 201 || response.status === 200)) {
                    router.push('/');
                } else {
                    throw new Error('Erro ao efetuar o login.');
                }
    
            } catch (error: any) {
                console.log(error);
    
                if (error.status === 403) {
                    setModalReenviarEmail(true); 
                    return;
                }
    
                if (error.status === 401) {
                    setMsgError(error.data.message || 'E-mail ou senha incorretos');
                    return;
                }
    
                setModalErro(true);
                setMsgErrorLogin(error.data.message || 'Erro ao efetuar o login.');
            } finally {
                setLoading(false);
            }
        }
    };
    
    
    const handleResendEmailHook = async () => {
        try {
            console.log('Reenviando email...');
            setCountdown(30);
            setIsResendDisabled(true);
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

    const closeModalReenviarEmail = () => {
        setModalReenviarEmail(false);
    };

    const closeModalErro = () => {
        setModalErro(false);
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleLogout = () => {
    
        dispatch(logout());
    
        setTimeout(() => {
          toast.success('Você saiu do sistema!', {
            position: "top-center",
            autoClose: 1300,
          });
    
          if (window.location.pathname !== '/') {
            setTimeout(() => {
              router.push('/');
            });
          }
        }, 500);
      };

    return {
        formData,
        handleChange,
        handleSubmit,
        handleResendEmailHook, 
        isResendDisabled,
        countdown,
        modalReenviarEmail,
        closeModalReenviarEmail,
        msgError,
        modalErro,
        msgErrorLogin,
        closeModalErro,
        loading,
        showPassword,
        togglePasswordVisibility,
        handleLogout
    };
}
