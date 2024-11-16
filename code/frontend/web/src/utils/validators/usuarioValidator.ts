import { phoneRegex } from "../regex/telefoneRegex";
import { hasOnlyLetters, isNotEmpty } from "../stringUtils";

export const validateNome = (nome: string): string[] => {
    const errors: string[] = [];
    if (!nome) {
        errors.push('Nome é obrigatório');
    } else if (nome.length < 3) {
        errors.push('Nome deve ter no mínimo 3 caracteres');
    } else if (!nome.includes(' ')) {
        errors.push('Por favor, insira o nome completo (com sobrenomes).');
    } else if (nome.endsWith(' ')) {
        errors.push('O nome não pode terminar com um espaço.');
    }
 
    return errors;
};

export const validateEmail = (email: string): string[] => {
    const errors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        errors.push('Email é obrigatório');
    } else if (!emailRegex.test(email)) {
        errors.push('Formato de email inválido');
    }
    return errors;
};

export const validateSenha = (senha: string): string[] => {
    const errors: string[] = [];
    if (!senha) {
        errors.push('Senha é obrigatória');
    } else if (senha.length < 8) {
        errors.push('Senha deve ter no mínimo 8 caracteres');
    }
    return errors;
};

export const validateConfirmSenha = (confirmSenha: string): string[] => {
    const errors: string[] = [];
    if (!confirmSenha) {
        errors.push('Por favor confirme sua senha');
    }
    return errors;
};

export const validateCpf = (cpf: string): string[] => {
    const errors: string[] = [];
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

    if (!cpf) {
        errors.push('CPF é obrigatório');
    } else if (!cpfRegex.test(cpf)) {
        errors.push('CPF inválido');
    }

    return errors;
};

export const validateNomeChange = (nome: string): string[] => {
    const errors: string[] = [];

    if (!hasOnlyLetters(nome)) {
        errors.push('Por favor, digite apenas letras nesse campo.');
    }

    return errors;
};

export const validateCpfChange = (cpf: string): string[] => {
    const errors: string[] = [];

    const lastChar = cpf.slice(-1);

    if (lastChar && isNaN(Number(lastChar))) {
        errors.push('Por favor, digite apenas números nesse campo.');
    }

    return errors;
};

export const validateTelefone = (telefone: string): string[] => {
    const errors: string[] = [];
    if (telefone && !phoneRegex.test(telefone)) {
        errors.push('Formato de telefone inválido. Exemplo: (31) 98765-4321');
    }
    
    return errors;
};

export const validateDataNascimento = (dataNascimento: string): string[] => {
    const errors: string[] = [];
    const dataNascimentoDate = new Date(dataNascimento);
    const hoje = new Date();
    const idadeMinima = 18;
    const diferencaAnos = hoje.getFullYear() - dataNascimentoDate.getFullYear();
    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();
    
    if (dataNascimentoDate > hoje) {
        errors.push('A data de nascimento não pode ser no futuro.');
    } else if (diferencaAnos < idadeMinima || (diferencaAnos === idadeMinima && (mesAtual < dataNascimentoDate.getMonth() || (mesAtual === dataNascimentoDate.getMonth() && diaAtual < dataNascimentoDate.getDate())))) {
        errors.push('Você deve ter pelo menos 18 anos.');
    }

    return errors;
};


export const validateEmptyField = (field: string): boolean => {
    return !isNotEmpty(field);
}
