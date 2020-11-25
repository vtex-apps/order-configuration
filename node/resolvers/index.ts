import {
  queries as sessionQueries
  // fieldResolvers as sessionResolvers,
} from "./session";

import {
  // fieldResolvers as customPriceFieldResolvers,
  queries as customPriceQueries
} from "./customPrices";

import { mutations as orderConfigurationMutations } from "./orderConfiguration";

export const resolvers = {
  // ...sessionResolvers,
  // ...customPriceFieldResolvers,
  Mutation: {
    ...orderConfigurationMutations
  },
  Query: {
    ...sessionQueries,
    ...customPriceQueries
  }
};
