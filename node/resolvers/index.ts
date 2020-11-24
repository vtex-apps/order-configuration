import {
  mutations as sessionMutations,
  queries as sessionQueries
  // fieldResolvers as sessionResolvers,
} from "./session";

import {
  // fieldResolvers as customPriceFieldResolvers,
  queries as customPriceQueries
} from "./customPrices";

export const resolvers = {
  // ...sessionResolvers,
  // ...customPriceFieldResolvers,
  Mutation: {
    ...sessionMutations
  },
  Query: {
    ...sessionQueries,
    ...customPriceQueries
  }
};
