
export const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;

export const formatPhone = (value: string): string => {

    const cleaned = value.replace(/\D/g, '');

    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return value;
};
