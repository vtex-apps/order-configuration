import { queries as customPriceQueries } from "./customPrices";
import { queries as sessionQueries } from "./session";
import { mutations as orderConfigurationMutations } from "./orderConfiguration";

export const resolvers = {
  Mutation: {
    ...orderConfigurationMutations
  },
  Query: {
    ...sessionQueries,
    ...customPriceQueries
  }
};
