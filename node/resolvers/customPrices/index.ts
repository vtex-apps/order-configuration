// import { resolvers as customPriceSchemaResolvers } from './customPriceSchema'

export const queries = {
  customPriceSchema: async (_: any, __: any, context: Context) => {
    const {
      clients: { customPrice }
    } = context;

    const data = await customPrice.getSchemas<object>();

    return { schema: data };
  }
};

// export const fieldResolvers = {
//   ...customPriceSchemaResolvers,
// }
