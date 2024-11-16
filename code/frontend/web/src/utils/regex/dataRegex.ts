export const formatData = (dataString: string | number | Date) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const data = new Date(dataString);
    
    if (isNaN(data.getTime())) {
      return 'Data inválida';
    }
    
    return data.toLocaleDateString('pt-BR', options);
  };
  