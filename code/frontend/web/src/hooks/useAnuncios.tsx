import { getAnunciosByFiltros } from '@/services/anuncioService';
import { useState, useCallback, useEffect } from 'react';
import { IAnuncioCard } from '@/interfaces/IAnuncioCard';
import { IFiltros } from '@/interfaces/IFiltros';
import { formatarDataHora } from '@/utils/dataUtils';
import { categoriasPecaCarro } from '@/data/CategoriasPecaCarros';
import { marcasPecaCarro } from '@/data/MarcaPecaCarro';

export const useAnuncios = () => {
  const [anunciosRecentesFiltro] = useState<IFiltros>({
    valorPesquisado: "",
    categoria: "",
    precoMin: "",
    precoMax: "",
    marca: "",
    modelo: "",
    anoFabricacao: "",
    campoOrdenacao: 'dataCriacao', 
    ordenacao: 'desc',
    tipoAnuncio: 'AMBOS',
    size: '30',
    page: '0'
  });

  const [filtros, setFiltros] = useState<IFiltros>({
    valorPesquisado: "",
    categoria: "",
    precoMin: "",
    precoMax: "",
    marca: "",
    modelo: "",
    anoFabricacao: "",
    campoOrdenacao: 'dataCriacao',
    ordenacao: 'desc',
    tipoAnuncio: "AMBOS",
    size: '30',
    page: '0'
  });

  const [totalDeResultados, setTotalDeResultados] = useState<number>(0);
  const [anuncios, setAnuncios] = useState<IAnuncioCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [valorPesquisado, setValorPesquisado] = useState("");
  const [totalPages, setTotalPages] = useState<number>(0);

  const getAnunciosPorFiltros = useCallback(async (filtrosPesquisa: IFiltros) => {
    setLoading(true)
    try {
      const response = await getAnunciosByFiltros({ ...filtrosPesquisa });
      if (response?.totalElements) {
        setTotalDeResultados(response?.totalElements);
      }

      if (response?.totalPages) {
        setTotalPages(response?.totalPages);
      }
      
      if (response?.content) {
        const anunciosFormatados = response.content.map((anuncio: any) => {
          const endereco = anuncio.vendedor 
            ? `${anuncio.vendedor.enderecos[0].cidade} - ${anuncio.vendedor.enderecos[0].estado}` 
            : anuncio.usuario 
              ? `${anuncio.usuario.enderecos[0].cidade} - ${anuncio.usuario.enderecos[0].estado}` 
              : "Endereço não disponível";
          return {
            id: anuncio.id,
            titulo: anuncio.titulo,
            preco: anuncio.preco,
            categoria: anuncio.categoria,
            imagem: anuncio.imagensLinks[0],
            endereco: endereco,
            dataCriacao: formatarDataHora(anuncio.dataCriacao),
          };
        });
        setAnuncios(anunciosFormatados);
      } else {
        setAnuncios([]);
      }
    } catch (err) {
      console.error('Erro ao buscar seus anúncios', err);
    }finally {
      setTimeout(() => {
        setLoading(false);
      }, 300); 
    }
  }, []); 

  const getAnunciosRecentes = async (quantidadeItens: number) => {
    await getAnunciosPorFiltros(anunciosRecentesFiltro); 
  };

  const montarUrlComFiltros = () => {
    const url = new URL('http://localhost:3000/anuncios');
    const params = new URLSearchParams();

    Object.entries(filtros).forEach(([key, value]) => {
        if (value) { 
            params.append(key, value);
        }
    });

    url.search = params.toString();
    return url.toString();
  };

  const handleFiltroChange = (novoFiltro: Partial<IFiltros>) => {
    setFiltros(prevFiltros => ({
      ...prevFiltros,
      ...novoFiltro 
    }));
  };

  const handleValorPesquisado = (novoFiltro: Partial<IFiltros>) => { 
    setFiltros(prevFiltros => ({
      ...prevFiltros,
      ...novoFiltro
    }));
  };  

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ordenacao = e.target.value;

    let campoOrdenacao: string;
    let ordenacaoTipo: 'asc' | 'desc';

    switch (ordenacao) {
        case "Mais recentes":
            campoOrdenacao = 'dataCriacao';
            ordenacaoTipo = 'desc';
            break;
        case "Menor preço":
            campoOrdenacao = 'preco';
            ordenacaoTipo = 'asc'; 
            break;
        case "Maior preço":
            campoOrdenacao = 'preco';
            ordenacaoTipo = 'desc';
            break;
        default:
            campoOrdenacao = 'dataCriacao';
            ordenacaoTipo = 'desc';
            break;
    }

    setFiltros(prevFiltros => ({
        ...prevFiltros,
        campoOrdenacao, 
        ordenacao: ordenacaoTipo,
    }));
  };

  const getOrdenacaoString = (): string => {
    switch (filtros.campoOrdenacao) {
        case 'preco':
            return filtros.ordenacao === 'asc' ? "Menor preço" : "Maior preço";
        case 'dataCriacao':
        default:
            return "Mais recentes";
    }
};

  const optionsCategoria = categoriasPecaCarro.map((categoria) => ({
    value: categoria.value,
    label: categoria.label,
  }));

  const handleValorPesquisadoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let valorPesquisado = event.target.value;
    handleFiltroChange({ valorPesquisado }); 
  };
  
  const handleEnterPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setTimeout(() => {
        const novaUrl = montarUrlComFiltros();
        window.history.pushState({}, '', novaUrl);
      }, 300); 
    }
  };

  const handlePesquisarButton = async () => {
      setTimeout(() => {
        const novaUrl = montarUrlComFiltros();
        window.history.pushState({}, '', novaUrl);
      }, 300); 
  };

  const removeFiltro = (key: keyof IFiltros) => {
    const novosFiltros = { ...filtros, [key]: '' };
    setFiltros(novosFiltros);
  };

  const optionsMarcas = marcasPecaCarro.map((marca) => ({
    value: marca.value,
    label: marca.label,
  }));

  const formatarNomeFiltro = (key: string) => {
    switch (key) {
      case 'valorPesquisado':
        return 'Valor Pesquisado';
      case 'categoria':
        return 'Categoria';
      case 'precoMin':
        return 'Preço Mínimo';
      case 'precoMax':
        return 'Preço Máximo';
      case 'marca':
        return 'Marca';
      case 'modelo':
        return 'Modelo';
      case 'anoFabricacao':
        return 'Ano de Fabricação';
      case 'tipoAnuncio':
      return 'Tipo de Anúncio';
      default:
        return key;
    }
  };

  const limparFiltros = () => {
    setFiltros(anunciosRecentesFiltro);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = e.target.value;
    setFiltros(prevFiltros => ({
        ...prevFiltros,
        size: newSize
    }));
  };

  return {
    anuncios,
    getAnunciosRecentes,
    getAnunciosPorFiltros,
    totalDeResultados,
    setFiltros,
    handleFiltroChange,
    optionsCategoria,
    handleOrderChange,
    handleValorPesquisado,
    filtros,
    handleValorPesquisadoChange,
    montarUrlComFiltros,
    handleEnterPress,
    loading,
    setLoading,
    getOrdenacaoString,
    valorPesquisado,
    setValorPesquisado,
    removeFiltro,
    optionsMarcas,
    formatarNomeFiltro,
    handlePesquisarButton,
    limparFiltros,
    totalPages,
    handleSizeChange
  };
};
