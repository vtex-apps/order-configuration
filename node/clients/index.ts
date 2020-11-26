import { IOClients } from "@vtex/api";

import { CustomPrice } from "./customPrice";

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get customPrice() {
    return this.getOrSet("customPrice", CustomPrice);
  }
}
