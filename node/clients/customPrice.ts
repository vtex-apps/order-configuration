import {
  InstanceOptions,
  IOContext,
  ExternalClient,
  RequestConfig,
} from '@vtex/api'

import { statusToError } from '../utils'

export class CustomPrice extends ExternalClient {
  public constructor(ctx: IOContext, options?: InstanceOptions) {
    super(`https://${ctx.account}.myvtex.com/_v/custom-prices`, ctx, {
      ...options,
      headers: {
        ...(options && options.headers),
        ...{ Accept: 'application/vnd.vtex.ds.v10+json' },
        ...(ctx.adminUserAuthToken
          ? { VtexIdclientAutCookie: ctx.adminUserAuthToken }
          : null),
        ...(ctx.storeUserAuthToken
          ? { VtexIdclientAutCookie: ctx.storeUserAuthToken }
          : null),
      },
    })
  }

  // public getSchema = <T>(dataEntity: string, schema: string) =>
  //   this.get<T>(this.routes.schema(dataEntity, schema), {
  //     metric: 'masterdata-getSchema',
  //   })

  public getSchemas = <T>() =>
    this.get<T>(this.routes.schemas(), {
      metric: 'customPrices-getSchemas',
    })

  protected get = <T>(url: string, config?: RequestConfig) => {
    return this.http.get<T>(url, config).catch(statusToError)
  }

  private get routes() {
    return {
      schema: (acronym: string, schema: string) =>
        `${acronym}/schemas/${schema}`,
      schemas: () => 'session/schema',
    }
  }
}
