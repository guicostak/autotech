export const formatarData = (data: string) => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

export function formatarDataHora(dataHoraISO: string) {
    const data = new Date(dataHoraISO);
    const dataFormatada = data.toLocaleDateString("pt-BR");
    const horaFormatada = data.toLocaleTimeString("pt-BR", {
        hour: '2-digit',
        minute: '2-digit'
    });
    return `${dataFormatada} - ${horaFormatada}`;
}