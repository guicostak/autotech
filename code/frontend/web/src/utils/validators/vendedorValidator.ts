import { phoneRegex } from "../regex/telefoneRegex"; 
import { isNotEmpty } from "../stringUtils"; 
import { IVendedor } from '@/interfaces/IVendedor';

export const validateNomeFantasia = (nomeFantasia: string): string[] => {
    const errors: string[] = [];
    if (!nomeFantasia) {
        errors.push('Nome fantasia é obrigatório');
    } else if (nomeFantasia.length < 3) {
        errors.push('Nome fantasia deve ter no mínimo 3 caracteres');
    }
    return errors;
};

export const validateEmailEmpresa = (emailEmpresa: string): string[] => {
    const errors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailEmpresa)) {
        errors.push('Formato de email inválido');
    }
    return errors;
};

export const validateCnpj = (cnpj: string): string[] => {
    const errors: string[] = [];
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

    if (!cnpj) {
        errors.push('CNPJ é obrigatório');
    } else if (!cnpjRegex.test(cnpj)) {
        errors.push('CNPJ inválido');
    }

    return errors;
};

export const validateDescricao = (descricao: string): string[] => {
    const errors: string[] = [];
    if (!descricao) {
        errors.push('Descrição é obrigatória');
    } else if (descricao.length < 10) {
        errors.push('Descrição deve ter no mínimo 10 caracteres');
    }
    return errors;
};

export const validateTelefoneEmpresa = (telefone: string): string[] => {
    const errors: string[] = [];

    if (!telefone) {
        errors.push('Telefone da empresa é obrigatório');
    } else if (!phoneRegex.test(telefone)) {
        errors.push('Formato de telefone inválido. Exemplo: (31) 98765-4321');
    }

    return errors;
};

export const validateEmptyField = (field: string): boolean => {
    return !isNotEmpty(field);
}
