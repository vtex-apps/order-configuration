import { AppGraphQLClient, InstanceOptions, IOContext } from "@vtex/api";
import { mutation as SET_ORDER_FORM_CUSTOM_DATA_MUTATION } from './setOrderFormCustomData'
import type { MutationReturnType as SetOrderFormCustomDataReturnType } from './setOrderFormCustomData'

export class StoreGraphQL extends AppGraphQLClient {
  public constructor(ctx: IOContext, opts?: InstanceOptions) {
    super("vtex.store-graphql@2.x", ctx, {
      ...opts,
      headers: {
        ...(opts && opts.headers),
        cookie: `VtexIdclientAutCookie=${ctx.authToken}`
      },
    });
  }

  public setOrderFormCustomData = async (value: string) => {
    const variables = {
      appId: 'orderConfig',
      field: 'values',
      value,
    }
    const { data } = await this.graphql.mutate<SetOrderFormCustomDataReturnType, typeof variables>({
      mutate: SET_ORDER_FORM_CUSTOM_DATA_MUTATION,
      variables,
    });
    return data;
  };
}
