import { Controller, Get, Post, Query, Body } from "@nestjs/common";
import { ProxyService } from "./proxy.service";
import { UserDto } from "src/user/dto/user.dto";
import { AbstractProxyController } from "./proxy.abstract";

/**
 * @description Controller handling proxy requests
 * @class
 * @implements { AbstractUserController }
 */
@Controller("proxy")
export class ProxyController implements AbstractProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  /**
   * @description Makes a GET request
   * @method
   * @public
   * @async
   * @param { string } url - URL
   * @returns { Promise<any> } - Response
   */
  @Get("fetch-data")
  public async fetchData(@Query("url") url: string): Promise<any> {
    const data = await this.proxyService.sendRequest("GET", url);

    return data;
  }

  /**
   * @description Makes a POST request
   * @method
   * @public
   * @async
   * @param { string } url - URL
   * @param { UserDto } data - User data
   * @returns { Promise<any> } - Response
   */
  @Post("post-data")
  public async postData(
    @Query("url") url: string,
    @Body() data: UserDto,
  ): Promise<any> {
    const responseData = await this.proxyService.sendRequest("POST", url, data);

    return responseData;
  }
}
