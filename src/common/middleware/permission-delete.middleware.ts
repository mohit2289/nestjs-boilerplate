import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserErrMessageConstant } from '../constant/error/user-err-message.constant';
import { UserService } from '../../v1/admin/user/user.service';
import jwt_decode from 'jwt-decode';

@Injectable()
export class PermissionDeleteMiddleware implements NestMiddleware {
  constructor(private readonly userServices: UserService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const header = {
      'Content-Type': 'application/json',
      'client-id': process.env.userClientId,
      Authorization: req.headers.authorization,
    };
    const jwtDecode: any = jwt_decode(header.Authorization);
    const userId = jwtDecode.data.id;
    const data = await this.userServices.getDepartment(header, userId);
    if (data.managementUser) {
      next();
    } else {
      throw new HttpException(
        {
          error: true,
          message: UserErrMessageConstant.denied,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
