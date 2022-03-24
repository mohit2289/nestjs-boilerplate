import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HelperService } from '../../../common/utils/helper.service';
import { CategoriesStatusErrMessageConstant } from '../../../common/constant/error/categories-status-err-message.constant';
import * as Joi from 'joi';

@Injectable()
export class CategoriesStatusValidator implements NestMiddleware {
  private categoryRegexp = /^[A-Za-z0-9-,]*$/;
  constructor(private readonly helperService: HelperService) {}

  updatestatusfields = Joi.array().items({
    id: Joi.number()
      .required()
      .error(new Error(CategoriesStatusErrMessageConstant.id)),
    checkerStatus: Joi.string()
      .valid('APPROVED', 'REJECTED')
      .error(new Error(CategoriesStatusErrMessageConstant.checkerStatus)),
    rejectReason: Joi.string().allow('').error(new Error()),
  });

  async use(req: Request, res: Response, next: NextFunction) {
    const postData = req.body;
    if (typeof postData.length == 'undefined') {
      throw new HttpException(
        {
          error: true,
          message: CategoriesStatusErrMessageConstant.requestBodyFormat,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const { error } = this.updatestatusfields.validate(req.body);
    const idcountArr = [];
    const counts = {};
    for (let i = 0; i < postData.length; i++) {
      if (!postData[i].hasOwnProperty('checkerStatus')) {
        throw new HttpException(
          {
            error: true,
            message: CategoriesStatusErrMessageConstant.checkerStatus,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (postData[i]['checkerStatus'] == 'REJECTED') {
        idcountArr[i] = postData[i]['id'];
        if (!postData[i].hasOwnProperty('rejectReason')) {
          throw new HttpException(
            {
              error: true,
              message: CategoriesStatusErrMessageConstant.rejectReason,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        if (
          postData[i].hasOwnProperty('rejectReason') &&
          postData[i]['rejectReason'].length < 4
        ) {
          throw new HttpException(
            {
              error: true,
              message: CategoriesStatusErrMessageConstant.rejectReasonCharCount,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      if (
        postData[i]['checkerStatus'] == 'APPROVED' &&
        postData[i].hasOwnProperty('rejectReason')
      ) {
        throw new HttpException(
          {
            error: true,
            message: CategoriesStatusErrMessageConstant.appovedReasonMsg,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    idcountArr.forEach((x) => {
      counts[x] = (counts[x] || 0) + 1;
    });
    const checkDuplicateId = Object.keys(counts).filter((key) => {
      return counts[key] > 1;
    });
    if (checkDuplicateId.length > 0) {
      throw new HttpException(
        {
          error: true,
          message: CategoriesStatusErrMessageConstant.duplicateId,
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
