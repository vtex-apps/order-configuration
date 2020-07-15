import { IOClients } from '@vtex/api'

import Session from './session'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get customSession() {
    return this.getOrSet('customSession', Session)
  }
}
