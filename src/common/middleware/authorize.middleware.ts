import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SyncMsService } from '../utils/sync-ms.service';
import { AuthErrMessageConstant } from '../constant/error/auth-err-message.constant';
import { AppConstant } from '../constant/app.constant';
import { MicroserviceConstant } from '../constant/microservice.constant';
import { HelperService } from '../utils/helper.service';
import jwt_decode from 'jwt-decode';

@Injectable()
export class AuthorizeMiddleware implements NestMiddleware {
  constructor(
    private readonly syncMsService: SyncMsService,
    private readonly helperService: HelperService,
  ) {}

  /**
   * @description check api access permission or not
   * @param {string} method call api method name
   * @param {string} path api full path
   */
  getPermission = (method: string, path: string) => {
    const routePermission = AppConstant.ROUTE_PERMISSION_V1;
    const permissionName = routePermission.find(
      (o: any) => o.method === method && o.route == path,
    );
    return permissionName ? permissionName.permission : false;
  };

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const routePath = req.route.path;
      const reqMethod = req.method;
      const accessToken = req.headers.authorization;
      const jwtTokenDecode: any = jwt_decode(accessToken);
      const accessPermissionName = this.getPermission(reqMethod, routePath);

      const header: {} = this.helperService.setHeader(
        process.env.userClientId,
        '',
        accessToken,
      );
      const userId = jwtTokenDecode.data.id;
      const userDataMSUrl =
        process.env.msUserMgmntUrl +
        MicroserviceConstant.ENDPOINT_V1.USER_MODULE +
        `/${userId}`;
      const userDataResult: {} = await this.syncMsService.get(
        userDataMSUrl,
        {},
        header,
      );
      const userDepartments = userDataResult['data']['data']['departments'];
      const userPermissionsArr = [];
      userDepartments.forEach((value: {}) => {
        userPermissionsArr.push(...value['role']['permissions']);
      });

      if (!userPermissionsArr.includes(accessPermissionName)) {
        throw new HttpException(
          {
            error: true,
            message: AuthErrMessageConstant.unAuthorizeAccess,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}
