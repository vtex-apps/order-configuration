import { mutations as orderConfigurationMutations, queries as orderConfigurationQueries } from "./orderConfiguration";

export const resolvers = {
  Mutation: {
    ...orderConfigurationMutations
  },
  Query: {
    ...orderConfigurationQueries,
  }
};
