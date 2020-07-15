import {
  mutations as sessionMutations,
  queries as sessionQueries,
  // fieldResolvers as sessionResolvers,
} from './session'

export const resolvers = {
  // ...sessionResolvers,
  Mutation: {
    ...sessionMutations,
  },
  Query: {
    ...sessionQueries,
  },
}
