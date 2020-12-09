import {expect} from "chai";
import {toFieldArrayFormat} from "../../utils/toFieldArrayFormat";

describe("toFieldArrayFormat", () => {
  it('should convert to field array format correctly', () => {
    const object = {
      a: "123",
      b: "asd"
    };
    const converted = toFieldArrayFormat(object);
    expect(converted).to.be.deep.equal([
      {
        Key: "a",
        Value: "123",
      },
      {
        Key: "b",
        Value: "asd",
      }
    ]);
  });
});