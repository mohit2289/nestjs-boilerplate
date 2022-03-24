/**
 * @author Mohib
 * @description category.update-validator is validate category's payload data
 * */
import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HelperService } from '../../../../common/utils/helper.service';
import { CommonErrMessageConstant } from '../../../../common/constant/error/common-err-message.constant';
import { CategoryErrMessageConstant } from '../../../../common/constant/error/category-err-message.constant';
import { AppConstant } from '../../../../common/constant/app.constant';
import { S3ObjectDeleteException } from '../../../../common/exception/s3-object-delete.exception';
import * as Joi from 'joi';
import * as probe from 'probe-image-size';

@Injectable()
export class CategoryUpdateValidator implements NestMiddleware {
  private regxForAlfaNum = AppConstant.REGX_ALFA_NUMERIC;
  private onlyNum = /^[0-9]*$/;

  constructor(private readonly helperService: HelperService) {}

  update = Joi.object().keys({
    id: Joi.string()
      .required()
      .regex(this.onlyNum)
      .error(new Error(CategoryErrMessageConstant.id)),
    categoryPageBannerImage: Joi.string()
      .allow('')
      .error(new Error(CategoryErrMessageConstant.categoryPageBannerImage)),
    status: Joi.boolean()
      .optional()
      .error(new Error(CategoryErrMessageConstant.status)),
    description: Joi.string()
      .optional()
      .regex(this.regxForAlfaNum)
      .max(200)
      .error(new Error(CategoryErrMessageConstant.description)),
  });

  async use(req: Request, res: Response, next: NextFunction) {
    if (Object.entries(req.files).length > 0) {
      for (const [key, value] of Object.entries(req.files)) {
        if (!['jpeg', 'jpg', 'png'].includes(value[0].mimetype.split('/')[1]))
          throw new HttpException(
            {
              error: true,
              message: CommonErrMessageConstant.fileType,
            },
            HttpStatus.BAD_REQUEST,
          );
        req.body[key] = value[0].location;
        const result = await probe(value[0].location);
        if (AppConstant.IMAGE_DIMENSION_L2[key] == undefined)
          throw new HttpException(
            {
              error: true,
              message: CommonErrMessageConstant.dimensionKey,
            },
            HttpStatus.BAD_REQUEST,
          );
        if (
          result.width != AppConstant.IMAGE_DIMENSION_L2[key][0] &&
          result.height != AppConstant.IMAGE_DIMENSION_L2[key][1]
        )
          throw new HttpException(
            {
              error: true,
              message:
                key +
                ' dimension required is ' +
                AppConstant.IMAGE_DIMENSION_L2[key],
            },
            HttpStatus.BAD_REQUEST,
          );
      }
    }
    const { error } = this.update.validate(req.body);
    if (error) throw new S3ObjectDeleteException(req.files, error);
    else next();
  }
}
