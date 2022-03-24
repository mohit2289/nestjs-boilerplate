/**
 * @author Mohit Verma
 * @description auth-login.validator is validate loign api payload data
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
import { AppConstant } from '../../../common/constant/app.constant';

@Injectable()
export class AuthLoginValidator implements NestMiddleware {
  private passRegexp = AppConstant.REGEX_PASSWORD_EXP;
  constructor(private readonly helperService: HelperService) {}

  login = Joi.object().keys({
    username: Joi.string()
      .email()
      .required()
      .error(new Error(AuthErrMessageConstant.email)),
    password: Joi.string()
      .required()
      .error(new Error(AuthErrMessageConstant.password)),
  });

  async use(req: Request, res: Response, next: NextFunction) {
    const { error } = this.login.validate(req.body);
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
