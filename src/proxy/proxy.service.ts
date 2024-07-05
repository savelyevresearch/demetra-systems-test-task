import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import * as http from "http";
import { AbstractProxyService } from "./proxy.abstract";

/**
 * @description Business-logic for proxy requests
 * @class
 * @implements { AbstractProxyService }
 */
@Injectable()
export class ProxyService implements AbstractProxyService {
  private readonly logger = new Logger(ProxyService.name);
  private readonly host = this.configService.get<string>("PROXY_HOST");
  private readonly port = Number(this.configService.get<number>("PROXY_PORT"));
  private readonly username = this.configService.get<string>("PROXY_LOGIN");
  private readonly password = this.configService.get<string>("PROXY_PASSWORD");

  constructor(private readonly configService: ConfigService) {}

  /**
   * @description Sends a proxy request
   * @method
   * @public
   * @async
   * @param { string } method - Request method
   * @param { string } url - URL
   * @param { any } data? - Request body (optional)
   * @returns { Promise<User> } - User data from database
   */
  public async sendRequest(
    method: string,
    url: string,
    data?: any,
  ): Promise<any> {
    this.logger.log(`
      Given credentials from .env file:
      - host: ${this.host}
      - port: ${this.port}
      - username: ${this.username}
      - password: ${this.password}
    `);

    try {
      this.logger.log("Proxy request is sending...");

      const response = await axios.request({
        method,
        url,
        data,
        proxy: {
          host: this.host,
          port: this.port,
          auth: {
            username: this.username,
            password: this.password,
          },
        },
        httpAgent: new http.Agent({ keepAlive: true }),
      });

      this.logger.log("Proxy request is sent");

      return response.data;
    } catch (error) {
      throw new Error(
        `ERROR: ${method.toUpperCase()} | DATA: ${error.message}`,
      );
    }
  }
}
