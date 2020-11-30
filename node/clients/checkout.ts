import { InstanceOptions, IOContext, JanusClient } from "@vtex/api";

const CHECKOUT_API_PATH = "/api/checkout";

const routes = {
  orderForm: (orderFormId: string) =>
    `${CHECKOUT_API_PATH}/pub/orderForm/${orderFormId}`,
  customData: (orderFormId: string, appId: string) =>
    `${routes.orderForm(orderFormId)}/customData/${appId}`
};

export class Checkout extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        "X-Vtex-Use-Https": "true"
      }
    });
  }

  public setOrderFormCustomData = (
    orderFormId: string,
    appId: string,
    data: Record<string, string>
  ) => this.http.put(routes.customData(orderFormId, appId), data);
}
