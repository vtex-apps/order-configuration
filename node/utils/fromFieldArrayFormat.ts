export const fromFieldArrayFormat = (fieldArray: { Key: string; Value: string }[]): Record<string, string> => {
  const recordToReturn: Record<string, string> = {};
  for(let item of fieldArray) {
    recordToReturn[item.Key] = item.Value;
  }
  return recordToReturn;
}