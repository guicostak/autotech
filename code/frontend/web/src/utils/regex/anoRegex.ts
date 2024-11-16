export const formatAno = (ano: string): string => {
 
    ano = ano.replace(/\D/g, '');

    if (ano.length === 0) {
        return '';
    }

    if (ano.length > 4) {
        ano = ano.slice(0, 4);
    }


    return ano;
};
