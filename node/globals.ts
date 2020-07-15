import {
  IOContext,
  MetricsAccumulator,
  SegmentData,
  ServiceContext,
} from '@vtex/api'

import { Clients } from './clients'

if (!global.metrics) {
  console.error('No global.metrics at require time')
  global.metrics = new MetricsAccumulator()
}

declare global {
  type Context = ServiceContext<Clients, void, CustomContext>

  interface CustomContext {
    cookie: string
    originalPath: string
    vtex: CustomIOContext
  }

  interface CustomIOContext extends IOContext {
    segment?: SegmentData
    orderFormId?: string
  }

  interface KeyValue {
    key: string
    value: string
  }

  interface Property {
    name: string
    values: [string]
  }
}
