import {MasterData, Session} from "@vtex/api";
import {anything, capture, instance, mock, verify, when} from "ts-mockito";
import * as Cookies from 'cookies';
import {expect} from "chai";
import {Clients} from "../../../clients";
import * as globals from "../../../globals";
import {saveOrderConfiguration} from "../../../resolvers/orderConfiguration/saveOrderConfiguration";
import {Checkout} from "@vtex/clients";
import {DataEntity} from "../../../resolvers/orderConfiguration/enums/DataEntity";
import {Schemas} from "../../../resolvers/orderConfiguration/enums/Schemas";

describe("saveOrderConfiguration", () => {
  let masterdata: MasterData;
  let session: Session;
  let cookies: Cookies;
  let checkout: Checkout;
  let orderConfig: { fields: { Key: string; Value: string; }[]};
  beforeEach( () => {
    masterdata = mock<MasterData>();
    session = mock<Session>();
    cookies = mock<Cookies>();
    checkout = mock<Checkout>();
    orderConfig = {
      fields: [
        { Key: "a", Value: "asd"},
        { Key: "b", Value: "123"}
      ]
    };
  })

  it('should return null when the user email is not present', async () => {
    when(session.getSession(anything(), anything())).thenResolve({
      sessionData: {},
      sessionToken: ""
    });
    const result = await saveOrderConfiguration(null, {
      orderConfig
    }, {
      clients: { masterdata: instance(masterdata), session: instance(session), customPrice: null, checkout } as unknown as Clients,
      cookies: instance(cookies),
    } as globals.Context);
    expect(result).to.be.false;
  });

  it('should return null when no client was found', async () => {
    when(session.getSession(anything(), anything())).thenResolve({
      sessionData: {
        namespaces: {
          profile: {
            email: {
              value: "fakeEmail"
            }
          }
        }
      },
      sessionToken: ""
    });
    when(masterdata.searchDocuments(anything())).thenResolve([]);
    const result = await saveOrderConfiguration(null, {
      orderConfig
    }, {
      clients: { masterdata: instance(masterdata), session: instance(session), customPrice: null, checkout } as unknown as Clients,
      cookies: instance(cookies)
    } as globals.Context);
    expect(result).to.be.false;
  });

  it('should save a new order configuration when no order configuration was found', async () => {
    when(session.getSession(anything(), anything())).thenResolve({
      sessionData: {
        namespaces: {
          profile: {
            email: {
              value: "fakeEmail"
            }
          }
        }
      },
      sessionToken: ""
    });
    when(masterdata.getSchema(anything())).thenResolve({
      'v-cache': false,
      properties: {
        a: {
          type: "string"
        },
        b: {
          type: "string"
        }
      },
      'v-default-fields': [],
      'v-indexed': []
    });
    when(masterdata.searchDocuments(anything())).thenResolve([{
      id: "fakeId",
    }]).thenResolve([]);
    when(masterdata.createDocument(anything())).thenResolve({
      DocumentId: "asdasd",
      Id: "asasdasd",
      Href: "as"
    });
    const result = await saveOrderConfiguration(null, {
      orderConfig
    }, {
      clients: { masterdata: instance(masterdata), session: instance(session), customPrice: null, checkout } as unknown as Clients,
      cookies: instance(cookies)
    } as globals.Context);
    expect(result).to.be.true;
    verify(masterdata.createDocument(anything())).once();
    const [arg] = capture(masterdata.createDocument).last();
    expect(arg).to.be.deep.equal({
      dataEntity: DataEntity.ORDER_CONFIG,
      schema: Schemas.ORDER_CONFIGURATION,
      fields: { a: "asd", b: "123" },
    });
  });

  it('should return the order configuration correctly', async () => {
    when(session.getSession(anything(), anything())).thenResolve({
      sessionData: {
        namespaces: {
          profile: {
            email: {
              value: "fakeEmail"
            }
          }
        }
      },
      sessionToken: ""
    });
    when(masterdata.getSchema(anything())).thenResolve({
      'v-cache': false,
      properties: {
        a: {
          type: "string"
        },
        b: {
          type: "string"
        }
      },
      'v-default-fields': [],
      'v-indexed': []
    });
    when(masterdata.searchDocuments(anything())).thenResolve([{
      id: "fakeId",
    }]).thenResolve([{
      a: "uuu",
      b: "aaa",
      id: "fakeId"
    }]);
    when(masterdata.createDocument(anything())).thenResolve({
      DocumentId: "asdasd",
      Id: "asasdasd",
      Href: "as"
    });
    const result = await saveOrderConfiguration(null, {
      orderConfig
    }, {
      clients: { masterdata: instance(masterdata), session: instance(session), customPrice: null, checkout } as unknown as Clients,
      cookies: instance(cookies)
    } as globals.Context);
    expect(result).to.be.true;
    verify(masterdata.updatePartialDocument(anything())).once();
    const [arg] = capture(masterdata.updatePartialDocument).last();
    expect(arg).to.be.deep.equal({
      dataEntity: DataEntity.ORDER_CONFIG,
      schema: Schemas.ORDER_CONFIGURATION,
      fields: { a: "asd", b: "123" },
      id: "fakeId"
    });
  });
});
