import { useState, useEffect, useRef } from 'react';
import { createVendedor, getVendedorByUsuarioId, updateVendedor } from '@/services/vendedorService'; 
import { validateCnpj, validateNomeFantasia, validateEmailEmpresa, validateDescricao, validateTelefoneEmpresa } from '@/utils/validators/vendedorValidator';
import { formatCnpj } from '@/utils/regex/cnpjRegex'; 
import { formatPhone } from '@/utils/regex/telefoneRegex';
import { useAppSelector } from '@/store/store';
import { IVendedor } from '@/interfaces/IVendedor';
import { toast } from 'react-toastify';

export default function useDadosJuridicos() {
    const [userData, setUserData] = useState<IVendedor | null>(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(''); 
    const [msgError, setMsgError] = useState<string>();
    const [formData, setFormData] = useState<IVendedor>({
        nomeFantasia: '',
        emailEmpresa: '',
        cnpj: '',
        descricao: '',
        telefoneEmpresa: '',
    });

    const [vendedorExiste, setVendedorExiste] = useState(false);
    const [initialFormData, setInitialFormData] = useState<IVendedor>({
        nomeFantasia: '',
        emailEmpresa: '',
        cnpj: '',
        descricao: '',
        telefoneEmpresa: '',
    }); 

    const [errors, setErrors] = useState({
        nomeFantasia: '',
        emailEmpresa: '',
        cnpj: '',
        descricao: '',
        telefoneEmpresa: '',
    });

    const { id } = useAppSelector((state) => state.user.userInfo || { id: null });
    const userId = id ? parseInt(id, 10) : null;
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [initialImage, setInitialImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [perfilIncompleto, setPerfilIncompleto] = useState(false);
    const [isModalLojaCriada, setIsModalLojaCriada] = useState(false);

    useEffect(() => {
        const getVendedorData = async () => {
            if (userId === null) {
                setError('Usuário não está logado ou ID do usuário é nulo.');
                return;
            }
    
            try {
                const response = await getVendedorByUsuarioId(userId);
                
                if (!response || Object.keys(response).length === 0) {
                    setVendedorExiste(false); 
                    return; 
                }
    
                setVendedorExiste(true);
                setUserData(response);
                setFormData({
                    nomeFantasia: response.nomeFantasia || '', 
                    emailEmpresa: response.emailEmpresa || '',
                    cnpj: formatCnpj(response.cnpj) || '',  
                    descricao: response.descricao || '',  
                    telefoneEmpresa: response.telefoneEmpresa || '',
                });
    
                setInitialFormData({
                    nomeFantasia: response.nomeFantasia || '', 
                    emailEmpresa: response.emailEmpresa || '',
                    cnpj: formatCnpj(response.cnpj) || '',  
                    descricao: response.descricao || '',  
                    telefoneEmpresa: response.telefoneEmpresa || '',
                });

                if (response.imagem_perfil) {
                    setInitialImage(response.imagem_perfil);
                    setSelectedImage(response.imagem_perfil);
                }
    
                if (!response.cnpj) {
                    setPerfilIncompleto(true);
                }
    
            } catch (error: any) {
                console.error('Erro ao buscar dados do vendedor:', error);
                setPerfilIncompleto(true);
            } finally {
                setLoading(false);
            }
        };
    
        getVendedorData();
    }, [userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        clearFieldError(name);
        setMsgError('');
        setError('');
    
        const formatters: { [key: string]: (val: string) => string } = {
            cnpj: formatCnpj,
            telefoneEmpresa: formatPhone,
        };
    
        const formattedValue = formatters[name] ? formatters[name](value) : value;
    
        setFormData((prevData) => ({ 
            ...prevData, 
            [name]: name === 'emailEmpresa' && value === '' ? null : formattedValue 
        }));
    
        validateField(name, formattedValue);
    };
    

    const validateField = (name: string, value: string) => {
        const validators: { [key: string]: (val: string) => string[] } = {
            nomeFantasia: validateNomeFantasia,
            emailEmpresa: validateEmailEmpresa,
            cnpj: validateCnpj,
            descricao: validateDescricao,
            telefoneEmpresa: validateTelefoneEmpresa,
        };
    
        const validate = validators[name];
    
        const errorMsg = name === 'emailEmpresa' && !value ? [] : (validate ? validate(value) : []);
    
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
            nomeFantasia: validateNomeFantasia(formData.nomeFantasia).join(', '),
            emailEmpresa: formData.emailEmpresa ? validateEmailEmpresa(formData.emailEmpresa).join(', ') : '',
            cnpj: validateCnpj(formData.cnpj).join(', '),
            descricao: validateDescricao(formData.descricao).join(', '),
            telefoneEmpresa: validateTelefoneEmpresa(formData.telefoneEmpresa).join(', '),
        };

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (userId === null) {
            console.log('UserId é nulo');
            return;
        }
    
        try {
            if(validateAllFields()) { 
                setLoading(true);
                const cnpjNumeros = formData.cnpj.replace(/\D/g, ''); 
        
                const updatedData = { 
                    ...formData, 
                    cnpj: cnpjNumeros, 
                    usuarioId: userId,  
                };
        
                if (vendedorExiste) {
                    await updateVendedor(userId, updatedData, selectedImage); 
        
                    setTimeout(() => {
                        toast.success('Loja atualizada com sucesso!', {});
                        setIsEditing(false);
                    }, 500);
                } else {
                    console.log('Chamando createVendedor com userId:', userId);
                    const response = await createVendedor(userId, updatedData, selectedImage);  
                    console.log('Resposta do createVendedor:', response);
        
                    setIsModalLojaCriada(true);
                }
            }
    
        } catch (err: any) {

            console.log(err)

            if (err.message) {
                
                if (err.message.toLowerCase().includes('cnpj')) {

                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        cnpj: err.message,
                    }));

                    return;  
                } else {
                    console.error('Erro inesperado:', err);
                    setError('Erro ao salvar Loja.');
                }
            }
        } finally {
            setLoading(false);            
        }
    };    

    const handleUpdate = async () => {

    }

    const handleCreate = async () => {
        
    }
    
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

    const clearAllErrors = () => {
        setErrors({
            nomeFantasia: '',
            emailEmpresa: '',
            cnpj: '',
            descricao: '',
            telefoneEmpresa: '',
        });
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

    const validateFieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
    
        const validators: { [key: string]: (val: string) => string[] } = {
            nomeFantasia: validateNomeFantasia,
            emailEmpresa: validateEmailEmpresa,
            cnpj: validateCnpj,
            descricao: validateDescricao,
            telefoneEmpresa: validateTelefoneEmpresa,
        };
    
        const validate = validators[name];
        const errorMsg = validate ? validate(value) : [];

         if (name === 'emailEmpresa' && !value) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: '',
            }));
            return;
        }
    
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMsg.length > 0 ? errorMsg.join(', ') : '',
        }));

        
    };

   const closeModalLojaCriada = () => {
        setIsModalLojaCriada(false);
        window.location.reload(); 
    };
      
    return {
        loading,
        error,
        formData,
        errors,
        handleChange,
        handleSubmit,
        selectedImage, 
        handleRemoveImage, 
        fileInputRef, 
        handleImageChange, 
        isEditing,
        toggleEditing,
        validateFieldBlur,
        perfilIncompleto,
        isModalLojaCriada,
        closeModalLojaCriada,
        msgError,
        initialImage
    };
}
