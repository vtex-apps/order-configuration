export const fromFieldArrayFormat = (
  fieldArray: { Key: string; Value: number | string }[]
): Record<string, string | number> => {
  const recordToReturn: Record<string, string | number> = {}
  for (let item of fieldArray) {
    recordToReturn[item.Key] = item.Value
  }
  return recordToReturn
}
