import { useState, useEffect, useRef } from 'react';
import { criarAnuncio } from '@/services/anuncioService'; 
import { toast } from 'react-toastify';
import { 
    validateAnoFabricacao, validateCategoria, validateDescricao, validateImagens, validateModelo, validatePreco, validateTitulo 
} from '@/utils/validators/anuncioValidator';
import { formatPreco } from '@/utils/regex/precoRegex';
import { formatAno } from '@/utils/regex/anoRegex';
import { useAppSelector } from '@/store/store';
import { getUserById } from '@/services/userService';
import { enderecoToString } from '@/utils/stringUtils';
import { formatCpf } from '@/utils/regex/cpfRegex';
import { formatCnpj } from '@/utils/regex/cnpjRegex';
import { getVendedorByUsuarioId } from '@/services/vendedorService';
import { IDadosLojaAnuncio } from '@/interfaces/IDadosLojaAnuncio';
import { IDadosUsuarioAnuncio } from '@/interfaces/IDadosUsuarioAnuncio';
import { IAnuncio } from '@/interfaces/IAnuncio';
import { formatPhone } from '@/utils/regex/telefoneRegex';
import { categoriasPecaCarro } from "@/data/CategoriasPecaCarros";
import { marcasPecaCarro } from '@/data/MarcaPecaCarro';

export default function useCriarAnuncio() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { id } = useAppSelector((state) => state.user.userInfo || { id: null });
    const userId = id ? parseInt(id, 10) : null;
    const [formData, setFormData] = useState<IAnuncio>({
        titulo: '',
        modelo: '',
        descricao: '',
        marca: '',
        categoria: '',
        preco: '', 
        ano_fabricacao: '',
        quantidadeProduto: 1,
    });

    const [errors, setErrors] = useState({
        titulo: '',
        modelo: '',
        descricao: '',
        categoria: '',
        preco: '',
        ano_fabricacao: '',
        imagens: '',
    });

    const [userData, setUserData] = useState<IDadosUsuarioAnuncio>({
        id: null,
        nome: null,
        endereco: null,
        telefone: null,
        dataNascimento: null,
        cpf: null,         
    })

    const [storeData, setStoreData] = useState<IDadosLojaAnuncio>({
        id: null,
        nomeFantasia: null,
        endereco: null,
        cnpj: null,
    });    
    const [pessoaJuridica, setPessoaJuridica] = useState<boolean>(false);
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [selectedImages, setSelectedImages] = useState<(File | null)[]>(Array(5).fill(null));
    const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
    const [modalFalhaVisible, setModalFalhaVisible] = useState<boolean>(false);
    const [anuncioUnico, setAnuncioUnico] = useState<boolean>(true);
    const [idAnuncioCriado, setIdAnuncioCriado] = useState<number>();


    useEffect(() => {
        const getUserData = async () => {
            if (userId === null) {
                setError('Usuário não está logado ou ID do usuário é nulo.');
                return;
            }
    
            console.log("Fetching user data for ID:", userId);
    
            try {

  

                const response = await getUserById(userId);

                setUserData({
                    id: response.id || null,
                    nome: response.nome || '',      
                    endereco: enderecoToString(response.enderecos[0]) || '',
                    telefone: formatPhone(response.telefone) || '',
                    dataNascimento: response.dataNascimento || '',
                    cpf: formatCpf(response.cpf || ''),
                });

                const responseVendedor = await getVendedorByUsuarioId(userId);
    
                if (responseVendedor && responseVendedor.enderecos[0]) {
                    
                    setStoreData({
                        id: responseVendedor.id || null,
                        nomeFantasia: responseVendedor.nomeFantasia || '',      
                        endereco: responseVendedor.enderecos && responseVendedor.enderecos.length > 0
                            ? enderecoToString(responseVendedor.enderecos[0])
                            : '',
                        cnpj: responseVendedor.cnpj ? formatCnpj(responseVendedor.cnpj) : null,
                    });
                } else {
                    console.error("Nenhum vendedor encontrado para este usuário.");
                    setStoreData({
                        id: null,
                        nomeFantasia: '', 
                        endereco: null,  
                        cnpj: null,
                    });
                    setError("Nenhum vendedor encontrado.");
                }
    
    
            } catch (err) {
                console.error("Erro ao carregar dados do usuário:", err);
                setError('Erro ao carregar dados do usuário.');
            }
        };
    
        getUserData();
    }, [userId]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        clearFieldError(name);
    
        const formatters: { [key: string]: (val: string) => string } = {
            preco: formatPreco,
            ano_fabricacao: formatAno,
        };
    
        const formattedValue = formatters[name] ? formatters[name](value) : value;
    
        setFormData((prevData) => ({ ...prevData, [name]: formattedValue }));
    };

    const validateFieldBlur = (e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const validators: { [key: string]: (val: string) => string[] } = {
            titulo: validateTitulo,
            modelo: validateModelo,
            descricao: validateDescricao,
            preco: validatePreco,
            ano_fabricacao: validateAnoFabricacao,
        };

        const validate = validators[name];

        const errorMsg = validate ? validate(value) : [];
    
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMsg.length > 0 ? errorMsg.join(', ') : '',
        }));

    }
    
    const clearFieldError = (name: string) => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };
    

    const validateAllFields = () => {
        const newErrors = {
            titulo: validateTitulo(formData.titulo).join(', '),
            modelo: validateModelo(formData.modelo).join(', '),
            descricao: validateDescricao(formData.descricao).join(', '),
            categoria: validateCategoria(formData.categoria).join(', '),
            preco: validatePreco(formData.preco).join(', '),
            ano_fabricacao: validateAnoFabricacao(formData.ano_fabricacao).join(', '),
            imagens: validateImagens(selectedImages).join(', '),
        };

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateAllFields()) {
            setLoading(true);
            console.log("Valor de pessoaJuridica antes do envio:", pessoaJuridica); 
            try {
                const validImages = selectedImages.filter((image): image is File => image !== null);

                let response = await criarAnuncio(formData, validImages, userId, pessoaJuridica);
                setModalSucessoVisible(true);
                setIdAnuncioCriado(response.anuncio_id);
                resetForm();
            } catch (error) {
                console.error('Erro ao salvar produto:', error);
                setError('Erro ao salvar produto.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleRemoveImage = (index: number) => {
        setSelectedImages((prevImages) => {
          const newImages = [...prevImages];
          newImages[index] = null; 
          if (fileInputRefs.current[index]) {
            fileInputRefs.current[index].value = ''; 
          }
          return newImages; 
        });
      };
    
      const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null; 
        setSelectedImages((prevImages) => {
          const newImages = [...prevImages];
          newImages[index] = file; 
          return newImages; 
        });
      };
    

    const resetForm = () => {
        setFormData({
            titulo: '',
            modelo: '',
            descricao: '',
            marca: '',
            categoria: '',
            preco: '', 
            ano_fabricacao: '', 
            quantidadeProduto: 1
        });
        setSelectedImages(Array(5).fill(null));
        setErrors({
            titulo: '',
            modelo: '',
            descricao: '',
            categoria: '',
            preco: '',
            ano_fabricacao: '',
            imagens: '', 
        });
        setError('');
    };

    const handleAnuncianteChange = (isLoja: boolean) => {
        setPessoaJuridica(isLoja); 
    };

    const closeModalSucesso = () => {
        setModalSucessoVisible(false);
        setLoading(false);
        limparFormulario();
    };

    const closeModalFalha = () => {
        setModalFalhaVisible(false);
        setLoading(false);  
    };

    const limparFormulario = () => {
        setFormData({
          titulo: '',
          modelo: '',
          descricao: '',
          marca: '',
          categoria: '',
          preco: '', 
          ano_fabricacao: '',
          quantidadeProduto: 1,
        });
      
        setErrors({
          titulo: '',
          modelo: '',
          descricao: '',
          categoria: '',
          preco: '',
          ano_fabricacao: '',
          imagens: ''
        });

        setSelectedImages(Array(5).fill(null));
      };

      const handleCheckboxChange = () => {
        const novoStatus = !anuncioUnico;
        setAnuncioUnico(novoStatus); 
      };

      const optionsCategorias = categoriasPecaCarro.map((categoria) => ({
        value: categoria.value,
        label: categoria.label,
      }));

      const optionsMarcas = marcasPecaCarro.map((marca) => ({
        value: marca.value,
        label: marca.label,
      }));
    
    

    return {
        loading,
        error,
        formData,
        errors,
        handleChange,
        handleSubmit,
        selectedImages,
        handleRemoveImage,
        handleImageChange,
        fileInputRefs,
        validateFieldBlur,
        userData,
        storeData,
        handleAnuncianteChange,
        pessoaJuridica,
        modalSucessoVisible,
        modalFalhaVisible,
        closeModalSucesso,
        closeModalFalha,
        anuncioUnico,
        idAnuncioCriado,
        handleCheckboxChange,
        optionsCategorias,
        setFormData,
        optionsMarcas
    };
}
