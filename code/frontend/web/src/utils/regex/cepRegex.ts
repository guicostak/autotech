export const formatCep = (cep: string): string => {
    cep = cep.replace(/\D/g, '');

    if (cep.length <= 5) {
        return cep; 
    } else {
        return `${cep.slice(0, 5)}-${cep.slice(5, 9)}`; 
    }
};
