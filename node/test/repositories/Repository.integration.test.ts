import {Repository} from "../../repositories/Repository";
import {DataEntity} from "../../resolvers/orderConfiguration/enums/DataEntity";
import {Schemas} from "../../resolvers/orderConfiguration/enums/Schemas";
import {expect} from "chai";
import {MasterDataFactory} from "../factories/MasterDataFactory";
import {TokenUtils} from "../utils/TokenUtils";

describe("Repository", function () {
  let repository: Repository<any>;
  before( async () => {
    const store = process.env.STORE as string;
    const workspace = process.env.WORKSPACE as string;
    const appKey = process.env.APP_KEY as string;
    const appToken = process.env.APP_TOKEN as string;
    const authToken = await TokenUtils.getAuthToken(store, appKey, appToken);
    const masterData = MasterDataFactory.buildMockMasterData(store, authToken, workspace)
    repository = new Repository(masterData, "integration_test" as DataEntity, "repository_test_schema" as Schemas, true);
  });

  describe("get & save", () => {
    it("should fetch a record properly", async () => {
      const id = await repository.save({
        a: "123",
        b: "asd"
      });
      const document = await repository.get(id);
      expect(document).to.deep.equal({
        a: "123",
        b: "asd",
        id,
      });
      await repository.delete(id);
    });
  });

  describe("delete", () => {
    it('should return an empty record after deletion', async () => {
      const id = await repository.save({
        a: "123",
        b: "asd"
      });
      await repository.delete(id);
      const document = await repository.get(id);
      expect(document).to.deep.equal({});
    });
  });

  describe("update", () => {
    it('should update the record properly', async () => {
      const id = await repository.save({
        a: "123",
        b: "asd"
      });
      await repository.update(id, {
        a: "456"
      })
      const document = await repository.get(id);
      expect(document).to.deep.equal({
        a: "456",
        b: "asd",
        id,
      });
      await repository.delete(id);
    });
  });

  describe("find", () => {
    it('should find the document properly', async () => {
      const document = await repository.find({
        a: "iHopeThisStringIsNotCopied",
      });
      expect(document).to.deep.equal([{
        a: "iHopeThisStringIsNotCopied",
        b: "asd",
        id: "222db4a1-3a2d-11eb-82ac-0a58a8d158d9",
      }]);
    });
  });

  describe("findOne", () => {
    it('should find the document properly', async () => {
      const document = await repository.findOne({
        a: "iHopeThisStringIsNotCopied",
      });
      expect(document).to.deep.equal({
        a: "iHopeThisStringIsNotCopied",
        b: "asd",
        id: "222db4a1-3a2d-11eb-82ac-0a58a8d158d9",
      });
    });
  });
});