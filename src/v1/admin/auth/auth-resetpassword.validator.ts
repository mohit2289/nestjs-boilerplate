/**
 * @author Mohit Verma
 * @description auth-resetpassword.validator is validate reset password api payload data
 * */
import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HelperService } from '../../../common/utils/helper.service';
import { AuthErrMessageConstant } from '../../../common/constant/error/auth-err-message.constant';
import * as Joi from 'joi';

@Injectable()
export class AuthResetPasswordValidator implements NestMiddleware {
  private passRegexp =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,16}$/;
  constructor(private readonly helperService: HelperService) {}

  resetpass = Joi.object().keys({
    newPassword: Joi.string()
      .required()
      .regex(this.passRegexp)
      .error(new Error(AuthErrMessageConstant.password)),
    confirmPassword: Joi.string()
      .required()
      .regex(this.passRegexp)
      .valid(Joi.ref('newPassword'))
      .error(new Error(AuthErrMessageConstant.confirmPassword)),
  });

  async use(req: Request, res: Response, next: NextFunction) {
    const { error } = this.resetpass.validate(req.body);
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
