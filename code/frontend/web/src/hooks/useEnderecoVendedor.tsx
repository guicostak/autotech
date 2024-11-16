import { useState, useEffect } from 'react'; 
import { validateCep, validateEstado, validateCidade, validateRua, validateNumero, validateBairro, validateOnlyNumberOnType } from '@/utils/validators/enderecoValidator'; 
import { useAppSelector } from '@/store/store'; 
import IEndereco from '@/interfaces/IEndereco';
import { removeLetters, removeSpecialChars } from '@/utils/stringUtils';
import { formatCep } from '@/utils/regex/cepRegex';
import { toast } from 'react-toastify';
import { atualizarEnderecoVendedor, getVendedorByUsuarioId, preencherEnderecoVendedor } from '@/services/vendedorService';
import { buscarEnderecoPorCep } from '@/services/userService';
import { formatNome } from '@/utils/regex/nomeRegex';
import useDadosJuridicos from './useDadosJuridicos';

export default function useEndereco() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<IEndereco>({
        cep: '',
        estado: '',
        cidade: '',
        rua: '',
        complemento: '',
        numero: '',
        bairro: '',
    });
    const [errors, setErrors] = useState({
        cep: '',
        estado: '',
        cidade: '',
        rua: '',
        numero: '',
        bairro: '',
    });

    const [initialValues, setInitialValues] = useState<IEndereco>({
        cep: '',
        estado: '',
        cidade: '',
        rua: '',
        complemento: '',
        numero: '',
        bairro: '',
    });

    const { id } = useAppSelector((state) => state.user.userInfo || { id: null });
    const userId = id ? parseInt(id, 10) : null;
    const [isAddressExisting, setIsAddressExisting] = useState(false);
    const { perfilIncompleto } = useDadosJuridicos();
    const [isEnderecoCompleto, setIsEnderecoCompleto] = useState(false);

    useEffect(() => {}, [perfilIncompleto]);

    useEffect(() => {
        const getUserData = async () => {
            if (userId === null) {
                return;
            }
    
            try {
                const response = await getVendedorByUsuarioId(userId);
                
                if (!response || !response.enderecos || response.enderecos.length === 0) {
                    throw new Error('Endereço do usuário está indefinido ou não foi encontrado.');
                }
                
                if (response && response.enderecos && response.enderecos.length > 0) {
                    const endereco = response.enderecos[0];

                    setFormData({
                        cep: formatCep(endereco.cep) || '', 
                        estado: endereco.estado || '',
                        cidade: endereco.cidade || '',  
                        rua: endereco.rua || '',  
                        complemento: endereco.complemento || '',
                        numero: endereco.numero || '',
                        bairro: endereco.bairro || '',
                    });

                    setInitialValues({
                        cep: formatCep(endereco.cep) || '', 
                        estado: endereco.estado || '',
                        cidade: endereco.cidade || '',  
                        rua: endereco.rua || '',  
                        complemento: endereco.complemento || '',
                        numero: endereco.numero || '',
                        bairro: endereco.bairro || '',
                    });

                    setIsEnderecoCompleto(true);
                    setIsAddressExisting(true); 
                } else {
                    setIsEnderecoCompleto(false);
                    setIsAddressExisting(false);
                }
    
            } catch (err) {
                console.error('Erro ao carregar dados do usuário:', err);
            } finally {
                setLoading(false);
            }
        };
    
        getUserData();
    }, [userId]);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        clearFieldError(name); 
    
        if (name === 'numero') {
            const validationErrors = validateOnlyNumberOnType(value);
    
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: validationErrors.join(', '), 
            }));
            
            const cleanedValue = removeLetters(removeSpecialChars(value));
            setFormData((prevData) => ({ ...prevData, [name]: cleanedValue }));

            return; 
        }
    
        if (name === 'cep') {
            console.log(value)  

            const cleanedValue = formatCep(value);
            setFormData((prevData) => ({ ...prevData, [name]: cleanedValue }));
            if(value.length === 9) { handleCepChange(value) }

            return; 
        }

        if (name === 'cidade' || name === 'rua') { 
            setFormData((prevData) => ({ ...prevData, [name]: formatNome(value) }));
            return; 
        }
    
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const checarEnderecoCompleto = () => {
        const isComplete = 
            formData.cep.trim() !== '' &&
            formData.estado.trim() !== '' &&
            formData.cidade.trim() !== '' &&
            formData.rua.trim() !== '' &&
            formData.numero.trim() !== '' &&
            formData.bairro.trim() !== '';
    
        setIsEnderecoCompleto(isComplete); // Atualiza o estado de `isEnderecoCompleto`
    };   

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pastedValue = e.clipboardData.getData('Text');
        const cleanedValue = formatCep(pastedValue);
        
        setFormData((prevData) => ({ ...prevData, cep: cleanedValue }));
    
        if (cleanedValue.length === 9) {
            handleCepChange(cleanedValue);
        }
    };


    const handleCepChange = async (cep: string) => {
        let cleanedCep = removeSpecialChars(cep)
        try {
            const enderecoData = await buscarEnderecoPorCep(cleanedCep);

                setFormData((prevData) => ({
                    ...prevData,
                    estado: enderecoData.uf || '',
                    cidade: enderecoData.localidade || '',
                    rua: enderecoData.logradouro || '',
                    bairro: enderecoData.bairro || '',
                    complemento: enderecoData.complemento || '',
                    numero: '', 
                }));
                
                clearAllErrors();
            
        } catch (error) {
            setError('Erro ao buscar dados do endereço pelo CEP.');
        }
    };

    const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        clearFieldError('estado');
        setFormData((prevData) => ({ ...prevData, estado: value })); 
    };

    const validateFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        const validators: { [key: string]: (val: string) => string[] } = {
            cep: validateCep,
            estado: validateEstado,
            cidade: validateCidade,
            rua: validateRua,
            numero: validateNumero,
            bairro: validateBairro,
        };

        const validate = validators[name];
        const errorMsg = validate ? validate(value) : [];

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMsg.length > 0 ? errorMsg.join(', ') : '',
        }));
    };

    const clearFieldError = (name: string) => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '', 
        }));
    };

    const validateAllFields = () => {
        const newErrors = {
            cep: validateCep(formData.cep).join(', '),
            estado: validateEstado(formData.estado).join(', '),
            cidade: validateCidade(formData.cidade).join(', '),
            rua: validateRua(formData.rua).join(', '),
            numero: validateNumero(formData.numero).join(', '),
            bairro: validateBairro(formData.bairro).join(', '),
        };

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
    
        const cleanedFormData = {
            ...formData,
            cep: removeSpecialChars(formData.cep),
        };
    
        if (!validateAllFields() || userId === null) {
            setLoading(false);
            return;
        }
    
        if(validateAllFields() || userId != null){
            try {
                if (!isAddressExisting ) {
                
                    console.log('Chamando preencherEndereco (POST) com os seguintes dados:', {
                        userId,
                        cleanedFormData 
                    });

        
                    await preencherEnderecoVendedor(userId, cleanedFormData);

                    setLoading(false);

                    setTimeout(() => {
                        toast.success('Endereço adicionado com sucesso!', {});
                        setIsEditing(false)

                        checarEnderecoCompleto();
                    }, 500);
                    
                    setIsAddressExisting(true);
                } else {
                    
                    console.log('Chamando atualizarEndereco (PATCH) com os seguintes dados:', {
                        userId,
                        cleanedFormData 
                    });
        
                    await atualizarEnderecoVendedor(userId, cleanedFormData);

                    setLoading(false);

                    setTimeout(() => {
                        toast.success('Endereço atualizado com sucesso!', {});
                        setIsEditing(false)
                    }, 500);
                }
            } catch (err) {
                console.error('Erro ao atualizar endereço:', err);
                setIsEditing(false)
                setError('Erro ao atualizar endereço.'); 
            }
        }
    };
    

    const clearAllErrors = () => {
        setErrors({
            cep: '',
            estado: '',
            cidade: '',
            rua: '',
            numero: '',
            bairro: '',
        });
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);

        if (isEditing && initialValues) {
            setFormData(initialValues);
            clearAllErrors();
        }
    };    

    return {
        loading,
        error,
        formData,
        errors,
        handleChange,        
        handleEstadoChange,
        handleSubmit,
        validateFieldBlur,
        isEditing,
        toggleEditing,
        handleCepChange,
        perfilIncompleto,
        isEnderecoCompleto,
        handlePaste
    };
}
