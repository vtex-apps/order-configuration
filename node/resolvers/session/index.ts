import { getCustomSessionKeys } from "./service";

export const queries = {
  /**
   * Get user session
   * @return Session
   */
  getCustomSessionKeys: async (_: any, __: any, ctx: Context) => {
    return getCustomSessionKeys(ctx);
  }
};

export const mutations = {};
