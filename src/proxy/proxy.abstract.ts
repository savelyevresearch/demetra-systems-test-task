import { UserDto } from "src/user/dto/user.dto";

/**
 * @description Abstract class for AbstractProxyService
 * @abstract
 * @class
 */
export abstract class AbstractProxyService {
  public abstract sendRequest(
    method: string,
    url: string,
    data?: any,
  ): Promise<any>;
}

/**
 * @description Abstract class for ProxyController
 * @abstract
 * @class
 */
export abstract class AbstractProxyController {
  public abstract fetchData(url: string): Promise<any>;
  public abstract postData(url: string, data: UserDto): Promise<any>;
}
