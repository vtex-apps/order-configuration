import { saveOrderConfiguration } from "./saveOrderConfiguration";
import {getOrderConfiguration} from "./getOrderConfiguration";

export const mutations = {
  saveOrderConfiguration
};

export const queries = {
  /**
   * Get user session custom keys
   * @return String
   */
  getOrderConfiguration
};