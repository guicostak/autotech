
export const validateCep = (cep: string): string[] => {
    const errors: string[] = [];
    const cepRegex = /^[0-9]{5}-[0-9]{3}$/; 

    if (!cep) {
        errors.push('CEP é obrigatório');
    } else if (!cepRegex.test(cep)) {
        errors.push('Formato de CEP inválido. Exemplo: 12345-678');
    }

    return errors;
};

export const validateEstado = (estado: string): string[] => {
    const errors: string[] = [];
    const validStates = ['SP', 'RJ', 'MG', 'RS', 'SC', 'PR', 'BA', 'ES', 'DF', 'etc'];
    if (!estado) {
        errors.push('Estado é obrigatório');
    } else if (!validStates.includes(estado.toUpperCase())) {
        errors.push('Estado inválido');
    }

    return errors;
};

export const validateCidade = (cidade: string): string[] => {
    const errors: string[] = [];

    if (!cidade) {
        errors.push('Cidade é obrigatória');
    } else if (cidade.length < 2) {
        errors.push('Nome da cidade deve ter pelo menos 2 caracteres');
    }

    return errors;
};

export const validateRua = (rua: string): string[] => {
    const errors: string[] = [];

    if (!rua) {
        errors.push('Rua é obrigatória');
    } else if (rua.length < 3) {
        errors.push('Nome da rua deve ter pelo menos 3 caracteres');
    }

    return errors;
};

export const validateNumero = (numero: string): string[] => {
    const errors: string[] = [];
    const numeroRegex = /^[0-9]+$/;  

    if (!numero) {
        errors.push('Número é obrigatório');
    } else if (!numeroRegex.test(numero)) {
        errors.push('Por favor, digite apenas números');
    }

    return errors;
};

export const validateOnlyNumberOnType = (numero: string): string[] => {
    const errors: string[] = [];
    const numeroRegex = /^[0-9]+$/;  
    
    if (!numeroRegex.test(numero)) {
        errors.push('Por favor, digite apenas números');
    }

    return errors;
};


export const validateBairro = (bairro: string): string[] => {
    const errors: string[] = [];

    if (!bairro) {
        errors.push('Bairro é obrigatório');
    } else if (bairro.length < 3) {
        errors.push('Nome do bairro deve ter pelo menos 3 caracteres');
    }

    return errors;
};