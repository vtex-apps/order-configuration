import {Repository} from "../../repositories/Repository";
import {IOContext, IUserLandTracer, Logger, MasterData} from "@vtex/api";
import {DataEntity} from "../../resolvers/orderConfiguration/enums/DataEntity";
import {Schemas} from "../../resolvers/orderConfiguration/enums/Schemas";
import {ParsedUrlQuery} from "querystring";

describe("Repository", () => {
  let repository;
  beforeEach( () => {
    const masterData = new MasterData(new class implements IOContext {
      account = "b2bstoreqa";
      authToken = "";
      logger = null as unknown as Logger;
      operationId = "";
      platform = "";
      product = "";
      production = false;
      region = "";
      requestId = "";
      route = {
        id: "",
        params: {
          fakeString: "bogus",
        } as ParsedUrlQuery,
        type: "private",
        declarer: undefined,
      } as {
        declarer?: string;
        id: string;
        params: ParsedUrlQuery;
        type: 'public' | 'private' | 'event';
      };
      tracer = {} as IUserLandTracer;
      userAgent = "";
      workspace = "teste123123";
    } as unknown as IOContext);
    repository = new Repository(masterData, "integration_test" as DataEntity, "repository_test_schema" as Schemas, true);
  });

  describe("get", () => {
    it("should fetch a record properly", async () => {

    });
  });

  describe("save", () => {

  });

  describe("update", () => {

  });

  describe("find", () => {

  });

  describe("findOne", () => {

  });
});