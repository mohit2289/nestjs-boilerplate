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
export class UserGetValidator implements NestMiddleware {
  private mobileRegx = /^[5-9]{1}[0-9]{9}$/;

  async use(req: Request, res: Response, next: NextFunction) {
    const update = Joi.object().keys({
      page: Joi.number()
        .required()
        .min(0)
        .max(100000)
        .error(new Error(UserErrMessageConstant.page)),
      size: Joi.number()
        .required()
        .min(1)
        .max(50)
        .error(new Error(UserErrMessageConstant.size)),
      fullName: Joi.string()
        .optional()
        .max(100)
        .error(new Error(UserErrMessageConstant.fullName)),
      email: Joi.string()
        .optional()
        .email()
        .error(new Error(UserErrMessageConstant.email)),
      mobile: Joi.string()
        .optional()
        .regex(this.mobileRegx)
        .error(new Error(UserErrMessageConstant.mobile)),
      createdByUserId: Joi.string()
        .optional()
        .error(new Error(UserErrMessageConstant.createdByUserId)),
    });
    const { error } = update.validate(req.query);
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
