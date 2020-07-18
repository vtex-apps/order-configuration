import { serialize } from 'cookie'
import { identity } from 'ramda'
import { vtexIdCookies } from '../../utils/vtexId'
import { VTEX_SESSION, getCustomSessionKeys } from './service'

interface CustomSessionArg {
  sessionData: { sessionData: any }
}

const CUSTOM_SESSSION_KEY = 'customSessionKeys'
const VTEXID_EXPIRES = 86400

export const queries = {
  /**
   * Get user session
   * @return Session
   */
  getCustomSessionKeys: async (_: any, __: any, ctx: Context) => {
    return getCustomSessionKeys(ctx)
  },
}

export const mutations = {
  updateCustomSessionKeys: async (_: any, { sessionData: { sessionData } }: CustomSessionArg, ctx: Context) => {
    const {
      clients: { customSession },
      cookies,
    } = ctx

    await customSession.updateSession(
      CUSTOM_SESSSION_KEY,
      JSON.stringify(sessionData),
      [],
      cookies.get(VTEX_SESSION)!,
      vtexIdCookies(ctx)
    )

    ctx.response.set(
      'Set-Cookie',
      serialize(CUSTOM_SESSSION_KEY, sessionData, {
        encode: identity,
        maxAge: VTEXID_EXPIRES,
        path: '/',
      })
    )

    return queries.getCustomSessionKeys({}, {}, ctx)
  },
}
