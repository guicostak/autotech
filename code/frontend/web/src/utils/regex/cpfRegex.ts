export const formatCpf = (cpf: string): string => {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length <= 3) {
        return cpf;
    } else if (cpf.length <= 6) {
        return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
    } else if (cpf.length <= 9) {
        return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
    } else {
        return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
    }
};
