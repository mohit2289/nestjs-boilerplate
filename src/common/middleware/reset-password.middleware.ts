import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SyncMsService } from '../utils/sync-ms.service';
import { AuthErrMessageConstant } from '../constant/error/auth-err-message.constant';
import { HelperService } from '../utils/helper.service';
import { MicroserviceConstant } from '../constant/microservice.constant';
import jwt_decode from 'jwt-decode';

@Injectable()
export class ResetPassordMiddleware implements NestMiddleware {
  constructor(
    private readonly syncMsService: SyncMsService,
    private readonly helperService: HelperService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      req.user = {};
      const head = req.headers;
      const authHeader = head.authorization;
      if (!authHeader.includes('Bearer ')) {
        throw new HttpException(
          {
            error: true,
            message: AuthErrMessageConstant.tokenFormat,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const token = authHeader;
      const jwtDecode: any = jwt_decode(token);
      const header: {} = this.helperService.setHeader(
        process.env.userClientId,
        '',
        token,
      );
      const msUserMgmntUrl = process.env.msUserMgmntUrl;
      const result = await this.syncMsService.get(
        msUserMgmntUrl + MicroserviceConstant.ENDPOINT_V1.ACCESS_TOKEN,
        {},
        header,
      );
      if (result['status'] != 200) {
        throw new HttpException(
          {
            error: true,
            message: result['data'].message,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      req.user.fullName = jwtDecode.data.fullName;
      const userId = jwtDecode.data.id;
      const userDataMSUrl =
        process.env.msUserMgmntUrl +
        MicroserviceConstant.ENDPOINT_V1.USER_MODULE +
        `/${userId}`;
      const userDataResult: {} = await this.syncMsService.get(
        userDataMSUrl,
        {},
        header,
      );
      if (!userDataResult['data']['data']['firstTimeLogin']) {
        throw new HttpException(
          {
            error: true,
            message: AuthErrMessageConstant.firstTimeLogin,
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
