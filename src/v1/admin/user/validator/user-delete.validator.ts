import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserErrMessageConstant } from '../../../../common/constant/error/user-err-message.constant';
import * as Joi from 'joi';

@Injectable()
export class UserDeleteValidator implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const remove = Joi.object().keys({
      id: Joi.string()
        .required()
        .trim()
        .error(new Error(UserErrMessageConstant.id)),
    });
    const { error } = remove.validate(req.query);
    if (error) {
      throw new HttpException(
        {
          error: true,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  }
}
