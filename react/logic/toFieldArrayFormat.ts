export const toFieldArrayFormat = (
  dictionary: Record<string, string | number>
): { Key: string; Value: number | string }[] => {
  const toReturn: { Key: string; Value: number | string }[] = []
  for (let key of Object.keys(dictionary)) {
    toReturn.push({
      Key: key,
      Value: dictionary[key],
    })
  }
  return toReturn
}
