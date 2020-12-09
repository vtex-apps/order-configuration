import { fromFieldArrayFormat } from '../../logic/fromFieldArrayFormat'

describe('fromFieldArrayFormat', () => {
  it('should convert from field array format correctly', () => {
    const fieldFormatArray = [
      {
        Key: 'a',
        Value: '123',
      },
      {
        Key: 'b',
        Value: 'asd',
      },
    ]
    const converted = fromFieldArrayFormat(fieldFormatArray)
    expect(converted).toEqual({
      a: '123',
      b: 'asd',
    })
  })
})
