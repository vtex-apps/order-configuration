import { IOClients } from "@vtex/api";

import { CustomPrice } from "./customPrice";
import { Checkout } from "./checkout";

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get customPrice() {
    return this.getOrSet("customPrice", CustomPrice);
  }

  public get checkout() {
    return this.getOrSet("checkout", Checkout);
  }
}
