export const toFieldArrayFormat = (
  dictionary: Record<string, string>
): { Key: string; Value: string }[] => {
  const toReturn: { Key: string; Value: string }[] = [];
  for (let key of Object.keys(dictionary)) {
    toReturn.push({
      Key: key,
      Value: dictionary[key],
    })
  }
  return toReturn;
};
