import { toFieldArrayFormat } from '../../logic/toFieldArrayFormat'

describe('toFieldArrayFormat', () => {
  it('should convert to field array format correctly', () => {
    const object = {
      a: '123',
      b: 'asd',
    }
    const converted = toFieldArrayFormat(object)
    expect(converted).toEqual([
      {
        Key: 'a',
        Value: '123',
      },
      {
        Key: 'b',
        Value: 'asd',
      },
    ])
  })
})
