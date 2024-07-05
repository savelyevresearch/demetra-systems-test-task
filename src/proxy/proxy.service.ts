import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import * as http from "http";

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
  private readonly host = this.configService.get<string>("PROXY_HOST");
  private readonly port = Number(this.configService.get<number>("PROXY_PORT"));
  private readonly username = this.configService.get<string>("PROXY_LOGIN");
  private readonly password = this.configService.get<string>("PROXY_PASSWORD");

  constructor(private readonly configService: ConfigService) {}

  async sendRequest(method: string, url: string, data?: any): Promise<any> {
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
