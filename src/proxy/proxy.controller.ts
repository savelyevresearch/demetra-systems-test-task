import { Controller, Get, Post, Query, Body } from "@nestjs/common";
import { ProxyService } from "./proxy.service";
import { UserDto } from "src/user/dto/user.dto";

@Controller("proxy")
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get("fetch-data")
  async fetchData(@Query("url") url: string) {
    const data = await this.proxyService.sendRequest("GET", url);

    return data;
  }

  @Post("post-data")
  async postData(@Query("url") url: string, @Body() data: UserDto) {
    const responseData = await this.proxyService.sendRequest("POST", url, data);

    return responseData;
  }
}
