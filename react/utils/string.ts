export const toSentenceCase = (value: string, delimiter: string) =>
  value
    .toLowerCase()
    .split(delimiter)
    .map(word => word.replace(word[0], word[0].toUpperCase()))
    .join(' ')
