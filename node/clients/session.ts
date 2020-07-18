import {
  JanusClient,
  InstanceOptions,
  IOContext
} from '@vtex/api'
import parseCookie from 'cookie'
import { prop } from 'ramda'

interface VtexIdCookies {
  account: string | null
  id: string | null
}

const SESSION_COOKIE = 'vtex_session'

const FIVE_SECONDS_MS = 5 * 1000

const routes = {
  base: '/api/sessions',
}

export default class Session extends JanusClient {

  public constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...(options && options.headers),
        VtexIdClientAutCookie: context.authToken,
      },
      timeout: FIVE_SECONDS_MS,
    })
  }

  public getSession = async (token: string, items: string[]) => {
    const {
      data: sessionData,
      headers: {
        'set-cookie': [setCookies],
      },
    } = await this.http.getRaw<any>(routes.base, ({
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `vtex_session=${token};`,
      },
      metric: 'session-get',
      params: {
        items: items.join(','),
      },
    }))

    const parsedCookie = parseCookie.parse(setCookies)
    const sessionToken = prop(SESSION_COOKIE, parsedCookie)

    return {
      sessionData,
      sessionToken,
    }
  }
  
  /**
   * Update the public portion of this session
   */
  public updateSession = (key: string, value: any, items: string[], token: any, vtexIdCookies: VtexIdCookies) => {
    const data = { public: { [key]: { value } } }
    let cookies = `vtex_session=${token};`
    if (vtexIdCookies.account) {
      cookies += `${vtexIdCookies.account};`
    }
    if (vtexIdCookies.id) {
      cookies += `${vtexIdCookies.id};`
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
      },
      metric: 'session-update',
      params: {
        items: items.join(','),
      },
    }

    return this.http.post(routes.base, data, config)
  }

}
