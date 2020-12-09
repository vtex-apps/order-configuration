import {
  IOContext,
  MetricsAccumulator,
  ParamsContext,
  RecorderState,
  SegmentData,
  ServiceContext
} from "@vtex/api";

import { Clients } from "./clients";

if (!global.metrics) {
  console.error("No global.metrics at require time");
  global.metrics = new MetricsAccumulator();
}

export type Context = ServiceContext<Clients, RecorderState, CustomContext>;

declare global {
  type Context = ServiceContext<Clients, RecorderState, CustomContext>;

  interface CustomContext extends ParamsContext {
    cookie: string;
    originalPath: string;
    vtex: CustomIOContext;
  }

  interface CustomIOContext extends IOContext {
    segment?: SegmentData;
    orderFormId?: string;
  }

  interface KeyValue {
    key: string;
    value: string;
  }

  interface Property {
    name: string;
    values: [string];
  }
}
