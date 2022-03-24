/**
 * @author Mohib
 * @description categories.validator is validate create new category's payload data
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
import { CategoryErrMessageConstant } from '../../../common/constant/error/category-err-message.constant';
import * as Joi from 'joi';

@Injectable()
export class CategoriesValidator implements NestMiddleware {
  private categoryRegexp = /^[A-Za-z0-9-,]*$/;
  constructor(private readonly helperService: HelperService) {}

  getCategoryValidate = Joi.object().keys({
    levels: Joi.string()
      .required()
      .regex(this.categoryRegexp)
      .min(2)
      .max(8)
      .error(new Error(CategoryErrMessageConstant.levels)),
  });

  async use(req: Request, res: Response, next: NextFunction) {
    const acceptedValue = ['L1', 'L2', 'L3'];
    const { error } = this.getCategoryValidate.validate(req.query);
    const arr = req.query.levels ? req.query.levels.split(',') : [];
    if (arr.length > 3) {
      throw new HttpException(
        {
          error: true,
          message: CategoryErrMessageConstant.levelcountmsg,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    let invalidValueExist = false;
    arr.forEach((level) => {
      if (!acceptedValue.includes(level)) {
        invalidValueExist = true;
      }
    });
    if (invalidValueExist) {
      throw new HttpException(
        {
          error: true,
          message: CategoryErrMessageConstant.levelmatch,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const levelCount = { L1: 0, L2: 0, L3: 0 };
    arr.forEach((level) => {
      levelCount[level] = levelCount[level] + 1;
    });

    const checkDuplicateLevel = Object.keys(levelCount).filter((key) => {
      return levelCount[key] > 1;
    });
    if (checkDuplicateLevel.length > 0) {
      throw new HttpException(
        {
          error: true,
          message: CategoryErrMessageConstant.levelDuplicate,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
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
