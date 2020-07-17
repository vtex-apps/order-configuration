import { prop, toPairs, map } from 'ramda'

export const resolvers = {
  CustomPriceSchema: {
    properties: ({properties} : any) =>
      map(([name, rest]: any) => ({
        name,
        type: rest.type,
        optional: rest.optional || false
      }), toPairs(properties)),
    indexes: prop('indexes'),
    isCached: prop('isCached'),
  }
}
