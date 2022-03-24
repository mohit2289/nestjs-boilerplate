import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SyncMsService } from '../utils/sync-ms.service';
import { AuthErrMessageConstant } from '../constant/error/auth-err-message.constant';
import { MicroserviceConstant } from '../constant/microservice.constant';
import jwt_decode from 'jwt-decode';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly syncMsService: SyncMsService) {}

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
      const header = {
        'Content-Type': 'application/json',
        'client-id': process.env.userClientId,
        Authorization: token,
      };
      const msUserMgmntUrl =
        process.env.msUserMgmntUrl +
        MicroserviceConstant.ENDPOINT_V1.ACCESS_TOKEN;
      const result = await this.syncMsService.get(msUserMgmntUrl, {}, header);
      if (result['status'] != 200) {
        throw new HttpException(
          {
            error: true,
            message: result['data'].message,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const jwtDecode: any = jwt_decode(token);
      const id = jwtDecode.data.id;
      const msUserMgmntUrl2 =
        process.env.msUserMgmntUrl +
        MicroserviceConstant.ENDPOINT_V1.USER_MODULE +
        `/${id}`;
      const data = await this.syncMsService.get(msUserMgmntUrl2, {}, header);
      if (data['data']?.data?.firstTimeLogin) {
        throw new HttpException(
          {
            error: true,
            message: AuthErrMessageConstant.firstTimeLogin,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      req.user = jwtDecode.data;
      next();
    } catch (error) {
      next(error);
    }
  }
}
