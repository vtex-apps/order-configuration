import { vtexIdCookies } from '../../utils/vtexId'
import { VTEX_SESSION, getCustomSessionKeys } from './service'

interface CustomSessionArg {
  sessionData: { sessionData: any }
}

const CUSTOM_SESSSION_KEY = 'customSessionKeys'

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

    const response = await customSession.updateSession(
      CUSTOM_SESSSION_KEY,
      JSON.stringify(sessionData),
      [],
      cookies.get(VTEX_SESSION)!,
      vtexIdCookies(ctx)
    )

    ctx.response.set('Set-Cookie', response.headers['set-cookie'])

    return queries.getCustomSessionKeys({}, {}, ctx)
  },
}
