import { serialize } from 'cookie'
import { identity } from 'ramda'
import { vtexIdCookies } from '../../utils/vtexId'
import { VTEX_SESSION, getSession } from './service'

interface CustomSessionArg {
  document: { document: any }
}

const CUSTOM_SESSSION_KEY = 'customSessionKeys'
const VTEXID_EXPIRES = 86400

export const queries = {
  /**
   * Get user session
   * @return Session
   */
  getSession: async (_: any, __: any, ctx: Context) => {
    return getSession(ctx)
  },
}

export const mutations = {
  updateCustomSessionKeys: async (_: any, { document: { document } }: CustomSessionArg, ctx: Context) => {
    const {
      clients: { customSession },
      cookies,
    } = ctx

    await customSession.updateSession(
      CUSTOM_SESSSION_KEY,
      JSON.stringify(document),
      [],
      cookies.get(VTEX_SESSION)!,
      vtexIdCookies(ctx)
    )

    ctx.response.set(
      'Set-Cookie',
      serialize(CUSTOM_SESSSION_KEY, document, {
        encode: identity,
        maxAge: VTEXID_EXPIRES,
        path: '/',
      })
    )

    return queries.getSession({}, {}, ctx)
  },
}
