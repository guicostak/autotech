import { useState, useEffect, useRef } from 'react';
import { getUserById, updateUser } from '@/services/userService';
import { validateNome, validateEmail, validateCpf, validateTelefone, validateDataNascimento } from '@/utils/validators/usuarioValidator';
import { formatCpf } from '@/utils/regex/cpfRegex';
import { formatPhone } from '@/utils/regex/telefoneRegex';
import { IUsuarioPerfil } from '@/interfaces/IUsuarioPerfil';
import { toast } from 'react-toastify';
import { formatNome } from '@/utils/regex/nomeRegex';

import { useAppSelector, useAppDispatch } from '@/store/store';
import { login, updateUserInfo } from '@/store/userSlice'; 


export default function useDadosPessoais() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState(''); 
    const [isEditing, setIsEditing] = useState(false);
    const [msgError, setMsgError] = useState<string>();
    const [formData, setFormData] = useState<IUsuarioPerfil>({
        nome: '',
        email: '',
        cpf: '',
        dataNascimento: '',
        telefone: '',
    });

    const [initialFormData, setInitialFormData] = useState<IUsuarioPerfil | null>(null);
    const [initialImage, setInitialImage] = useState<File | null>(null);
    const [errors, setErrors] = useState({
        nome: '',
        email: '',
        cpf: '',
        dataNascimento: '',
        telefone: '',
    });

    const initialErrors = {
        nome: '',
        email: '',
        cpf: '',
        dataNascimento: '',
        telefone: '',
    };

    const { id } = useAppSelector((state) => state.user.userInfo || { id: null });
    const { token } = useAppSelector((state) => state.user || { token: null });
    const userId = id ? parseInt(id, 10) : null;
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [perfilIncompleto, setPerfilIncompleto] = useState({
        dataNascimento: false,
        telefone: false,
    });

    const dispatch = useAppDispatch();


    useEffect(() => {
        const getUserData = async () => {
            if (userId === null) {
                setError('Usuário não está logado ou ID do usuário é nulo.');
                return;
            }

            console.log("Fetching user data for ID:", userId);

            try {
                const response = await getUserById(userId);

                if (!response) {
                    throw new Error('Dados do usuário estão indefinidos ou inválidos.');
                }

                setFormData({
                    nome: response.nome || '', 
                    email: response.email || '',
                    cpf: formatCpf(response.cpf) || '',  
                    dataNascimento: response.dataNascimento ? response.dataNascimento.split('T')[0] : '',  
                    telefone: response.telefone || '',
                });

                setInitialFormData({
                    nome: response.nome || '', 
                    email: response.email || '',
                    cpf: formatCpf(response.cpf) || '',  
                    dataNascimento: response.dataNascimento ? response.dataNascimento.split('T')[0] : '',  
                    telefone: response.telefone || '',
                });

                if (response.imagem) {
                    setInitialImage(response.imagem);
                    setSelectedImage(response.imagem);
                }

                if (!response.dataNascimento) {
                    setPerfilIncompleto((prevErrors) => ({
                        ...prevErrors,
                        dataNascimento: true,
                    }));
                }

                if (!response.telefone) {
                    setPerfilIncompleto((prevErrors) => ({
                        ...prevErrors,
                        telefone: true,
                    }));
                }

            } catch (err) {
                setIsEditing(false)
                console.error("Erro ao carregar dados do usuário:", err);
                setError('Erro ao carregar dados do usuário.'); 
            }
        };

        getUserData();
    }, [userId]);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        clearFieldError(name);
        setMsgError('');
        setError('');
    
        
        const formatters: { [key: string]: (val: string) => string } = {
            nome: formatNome,
            cpf: formatCpf,
            telefone: formatPhone,
        };

        const formattedValue = formatters[name] ? formatters[name](value) : value;

        setFormData((prevData) => ({ ...prevData, [name]: formattedValue }));
    };

    const validateFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        const validators: { [key: string]: (val: string) => string[] } = {
            nome: validateNome,
            email: validateEmail,
            cpf: validateCpf,
            dataNascimento: validateDataNascimento,
            telefone: validateTelefone,
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
            cpf: validateCpf(formData.cpf).join(', '),
            dataNascimento: '',
            telefone: '',
        };

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === '');
    };

    const checarPerfilCompleto = () => {
        setPerfilIncompleto({
            dataNascimento: formData.dataNascimento.trim() === '',
            telefone: formData.telefone.trim() === '',
        });
    };    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateAllFields() || userId === null) {
            return;
        }
    
        try {
            setLoading(true);
            const cpfNumeros = formData.cpf.replace(/\D/g, '');
            const updatedData = { ...formData, cpf: cpfNumeros };
            console.log(selectedImage)
            await updateUser(updatedData,userId, token, selectedImage);

            setLoading(false);
            setTimeout(() => {
                toast.success('Perfil atualizado com sucesso!', {});
                setIsEditing(false)

                checarPerfilCompleto(); 
            }, 500); 

            const response = await getUserById(userId);

            if (!response) {
                throw new Error('Dados do usuário estão indefinidos ou inválidos.');
            }

            localStorage.setItem('name', response.nome || '');

            setFormData({
                nome: response.nome || '', 
                email: response.email || '',
                cpf: formatCpf(response.cpf) || '',  
                dataNascimento: response.dataNascimento ? response.dataNascimento.split('T')[0] : '',  
                telefone: response.telefone || '',
            });

            setInitialFormData({
                nome: response.nome || '', 
                email: response.email || '',
                cpf: formatCpf(response.cpf) || '',  
                dataNascimento: response.dataNascimento ? response.dataNascimento.split('T')[0] : '',  
                telefone: response.telefone || '',
            });

           
            dispatch(updateUserInfo({ name: response.nome , email: response.email }));
            
        } catch (err: any) {
            if (err.message) {
                if (err.message.toLowerCase().includes('cpf')) {

                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        cpf: err.message,
                    }));

                } else {
                    setError(err.message);
                }
            } else {
                console.error('Erro inesperado:', err);
                setError('Erro ao salvar Loja.');
            }
        
            console.error('Erro ao atualizar perfil:', err);
        } finally {
            setLoading(false);            
        }
    };

    const clearAllErrors = () => {
        setErrors(initialErrors);
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    
        if (isEditing && initialFormData) {
            setFormData(initialFormData);
            if(initialImage != selectedImage) {
                setSelectedImage(initialImage);
            }
            clearAllErrors();
            setMsgError('');
            setError('');
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedImage(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
      
    return {
        loading,
        error,
        formData,
        errors,
        handleChange,
        handleSubmit,
        validateFieldBlur,
        toggleEditing,
        isEditing,
        selectedImage,
        handleImageChange,
        handleRemoveImage, 
        fileInputRef,
        perfilIncompleto,
        msgError,
    };
}
