import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import * as http from "http";

@Injectable()
export class ProxyService {
  constructor(private readonly configService: ConfigService) {}

  async sendRequest(method: string, url: string, data?: any): Promise<any> {
    try {
      const response = await axios.request({
        method,
        url,
        data,
        proxy: {
          host: this.configService.get<string>("PROXY_HOST"),
          port: Number(this.configService.get<number>("PROXY_PORT")),
          auth: {
            username: this.configService.get<string>("PROXY_LOGIN"),
            password: this.configService.get<string>("PROXY_PASSWORD"),
          },
        },
        httpAgent: new http.Agent({ keepAlive: true }),
      });

      return response.data;
    } catch (error) {
      throw new Error(
        `ERROR: ${method.toUpperCase()} | DATA: ${error.message}`,
      );
    }
  }
}
