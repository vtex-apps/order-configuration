import {fromFieldArrayFormat} from "../../utils/fromFieldArrayFormat";
import { expect } from "chai";

describe("fromFieldArrayFormat", () => {
  it('should convert from field array format correctly', () => {
    const fieldFormatArray = [
      {
        Key: "a",
        Value: "123",
      },
      {
        Key: "b",
        Value: "asd",
      }
    ];
    const converted = fromFieldArrayFormat(fieldFormatArray);
    expect(converted).to.be.deep.equal({
      a: "123",
      b: "asd"
    });
  });
});