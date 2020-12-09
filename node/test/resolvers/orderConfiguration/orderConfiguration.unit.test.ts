import {orderConfiguration} from "../../../resolvers/orderConfiguration/orderConfiguration";
import {MasterData, Session} from "@vtex/api";
import {anything, instance, mock, when} from "ts-mockito";
import * as Cookies from 'cookies';
import {expect} from "chai";
import {Clients} from "../../../clients";
import * as globals from "../../../globals";

describe("orderConfiguration", () => {
  let masterdata: MasterData;
  let session: Session;
  let cookies: Cookies;
  beforeEach( () => {
    masterdata = mock<MasterData>();
    session = mock<Session>();
    cookies = mock<Cookies>();
  })

  it('should return null when the user email is not present', async () => {
    when(session.getSession(anything(), anything())).thenResolve({
      sessionData: {},
      sessionToken: ""
    });
    const result = await orderConfiguration(null, null as unknown as void, {
      clients: { masterdata: instance(masterdata), session: instance(session), customPrice: null, checkout: null } as unknown as Clients,
      cookies: instance(cookies)
    } as globals.Context);
    expect(result).to.be.null;
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
    const result = await orderConfiguration(null, null as unknown as void, {
      clients: { masterdata: instance(masterdata), session: instance(session), customPrice: null, checkout: null } as unknown as Clients,
      cookies: instance(cookies)
    } as globals.Context);
    expect(result).to.be.null;
  });

  it('should return null when no order configuration was found', async () => {
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
    when(masterdata.searchDocuments(anything())).thenResolve([{
      a: "asd",
      b: "123"
    }]).thenResolve([]);
    const result = await orderConfiguration(null, null as unknown as void, {
      clients: { masterdata: instance(masterdata), session: instance(session), customPrice: null, checkout: null } as unknown as Clients,
      cookies: instance(cookies)
    } as globals.Context);
    expect(result).to.be.null;
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
        order: {
          type: "string"
        },
        whatever: {
          type: "string"
        }
      },
      'v-default-fields': [],
      'v-indexed': []
    });
    when(masterdata.searchDocuments(anything())).thenResolve([{
      a: "asd",
      b: "123"
    }]).thenResolve([{
      order: "123",
      whatever: "asd",
      id: "fakeId"
    }]);
    const result = await orderConfiguration(null, null as unknown as void, {
      clients: { masterdata: instance(masterdata), session: instance(session), customPrice: null, checkout: null } as unknown as Clients,
      cookies: instance(cookies)
    } as globals.Context);
    expect(result).to.be.deep.equal({
      fields: [
        { Key: "order", Value: "123"},
        { Key: "whatever", Value: "asd"},
        { Key: "id", Value: "fakeId"}
      ]
    });
  });
});
