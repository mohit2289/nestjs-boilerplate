/**
 * @author Mohit Verma
 * @description user.update-validator is validate create new user's payload data
 * */
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
export class UserCreateValidator implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const create = Joi.object().keys({
      fullName: Joi.string()
        .required()
        .trim()
        .error(new Error(UserErrMessageConstant.fullName)),
      email: Joi.string()
        .email()
        .required()
        .error(new Error(UserErrMessageConstant.email)),
      mobile: Joi.string()
        .required()
        .trim()
        .error(new Error(UserErrMessageConstant.mobile)),
      isMGMTUser: Joi.boolean()
        .required()
        .error(new Error(UserErrMessageConstant.isMGMTUser)),
      departments: Joi.array()
        .items(
          Joi.object({
            departmentId: Joi.string()
              .required()
              .error(new Error(UserErrMessageConstant.deptId)),
            role: Joi.object().keys({
              roleId: Joi.string()
                .required()
                .error(new Error(UserErrMessageConstant.roleId)),
              userType: Joi.string()
                .required()
                .error(new Error(UserErrMessageConstant.userType)),
              permissions: Joi.array()
                .required()
                .min(1)
                .error(new Error(UserErrMessageConstant.permissions)),
            }),
          }),
        )
        .required(),
    });
    const { error } = create.validate(req.body);
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
