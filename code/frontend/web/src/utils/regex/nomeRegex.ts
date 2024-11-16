import{ removeSpecialChars, removeNumbers } from '@/utils/stringUtils'


export function formatNome(nome: string): string {
  nome = removeSpecialChars(nome);
  return removeNumbers(nome);
}

