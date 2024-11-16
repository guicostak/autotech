export const formatCnpj = (cnpj: string): string => {

    cnpj = cnpj.replace(/\D/g, '');

    if (cnpj.length <= 2) {
        return cnpj;
    } else if (cnpj.length <= 5) {
        return `${cnpj.slice(0, 2)}.${cnpj.slice(2)}`;
    } else if (cnpj.length <= 8) {
        return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5)}`;
    } else if (cnpj.length <= 12) {
        return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8)}`;
    } else {
        return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`; 
    }
};
