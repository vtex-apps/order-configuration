import {anything, instance, mock, when} from "ts-mockito";
import {UserLandTracer} from "@vtex/api/lib/tracing/UserLandTracer";
import {IOContext, Logger, MasterData, Span} from "@vtex/api";
import {SpanContext} from "opentracing";
import {ParsedUrlQuery} from "querystring";

export class MasterDataFactory{
  public static buildMockMasterData(store: string, authToken: string, workspace: string): MasterData {
    const tracerMock = mock(UserLandTracer);
    const spanMock = mock(Span);
    when(spanMock.context()).thenReturn(instance(mock(SpanContext)));
    when(tracerMock.startSpan(anything(), anything())).thenReturn(instance(spanMock));
    when(tracerMock.startSpan(anything())).thenReturn(instance(spanMock));
    const masterData = new MasterData(new class implements IOContext {
      account = store;
      authToken = authToken;
      logger = null as unknown as Logger;
      operationId = "";
      platform = "";
      product = "";
      production = false;
      region = "";
      requestId = "";
      route = {
        id: "",
        params: {
          fakeString: "bogus",
        } as ParsedUrlQuery,
        type: "private",
        declarer: undefined,
      } as {
        declarer?: string;
        id: string;
        params: ParsedUrlQuery;
        type: 'public' | 'private' | 'event';
      };
      tracer = instance(tracerMock);
      userAgent = "test";
      workspace = workspace;
    } as unknown as IOContext);
    return masterData;
  }
}