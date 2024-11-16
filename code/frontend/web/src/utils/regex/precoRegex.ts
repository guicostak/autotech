export const formatPreco = (preco: string): string => {
    
    preco = preco.replace(/\D/g, '');

  
    if (preco.length === 0) {
        return '';
    }

    const formattedPreco = (parseFloat(preco) / 100).toFixed(2); 

    return `R$ ${formattedPreco.replace('.', ',')}`;
};
