import axios from "axios";

export interface TokenResponse {
  authStatus: string;
  token: string;
  expires: number;
}

export class TokenUtils {
  public static async getAuthToken(store: string, appKey: string, appToken: string): Promise<string> {
    const tokenUrl = `https://${store}.vtexcommercestable.com.br/api/vtexid/apptoken/login`;
    const data = {
      appkey: appKey,
      apptoken: appToken,
    };
    const response = await axios.post<TokenResponse>(tokenUrl, data);
    return response.data.token;
  }
}
