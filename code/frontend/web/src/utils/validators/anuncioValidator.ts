
export const validateTitulo = (titulo: string): string[] => {
    const errors: string[] = [];
    if (!titulo) {
        errors.push('Título é obrigatório');
    } else if (titulo.length < 3) {
        errors.push('Título deve ter no mínimo 3 caracteres');
    } else if (titulo.length > 50) {
        errors.push('Título deve ter no máximo 40 caracteres');
    }
    return errors;
};

export const validateModelo = (modelo: string): string[] => {
    const errors: string[] = [];
    if (!modelo) {
        errors.push('Modelo é obrigatório');
    } else if (modelo.length < 2) {
        errors.push('Modelo deve ter no mínimo 2 caracteres');
    }
    return errors;
};

export const validateDescricao = (descricao: string): string[] => {
    const errors: string[] = [];
    if (!descricao) {
        errors.push('Descrição é obrigatória');
    } else if (descricao.length < 10) {
        errors.push('Descrição deve ter no mínimo 10 caracteres');
    } else if (descricao.length > 300) {
        errors.push('Descrição deve ter no máximo 300 caracteres');
    }
    return errors;
};


export const validateMarca = (marca: string): string[] => {
    const errors: string[] = [];
    if (!marca) {
        errors.push('Marca é obrigatória');
    }
    return errors;
};


export const validateCategoria = (categoria: string): string[] => {
    const errors: string[] = [];
    if (!categoria) {
        errors.push('Categoria é obrigatória');
    }
    return errors;
};


export const validatePreco = (preco: string): string[] => {
    const errors: string[] = [];

    if (!preco || preco.trim().length === 0) {
        errors.push('Preço é obrigatório');
        return errors;
    }

    preco = preco.replace(/\D/g, '');

    if (preco.length < 3) {
        errors.push('Preço deve ser maior que R$ 0,00');
        return errors;
    }

    const precoNumber = parseFloat(preco) / 100;

    if (precoNumber <= 0) {
        errors.push('Preço deve ser um número positivo');
    }

    return errors;
};


export const validateAnoFabricacao = (anoFabricacao: string): string[] => {
    const errors: string[] = [];
    const anoFabricacaoNumber = parseInt(anoFabricacao, 10); 
    const currentYear = new Date().getFullYear();

    if (isNaN(anoFabricacaoNumber) || anoFabricacaoNumber < 1900 || anoFabricacaoNumber > currentYear) {
        errors.push(`Deve ser fabricado entre 1900 e ${currentYear}`);
    }

    return errors;
};

export const validateImagens = (imagens: (File | null)[] | null): string[] => {
    const errors: string[] = [];

    if (!imagens || imagens.every(image => image === null)) {
        errors.push("Por favor, adicione ao menos uma imagem ao seu anúncio.");
    }

    return errors;
};


