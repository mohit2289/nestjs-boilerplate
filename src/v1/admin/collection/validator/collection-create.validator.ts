/**
 * @author Mohib
 * @description collection.update-validator is validate create new collecion's payload data
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
import { CollectionErrMessageConstant } from '../../../../common/constant/error/collection-err-message.constant';
import { AppConstant } from '../../../../common/constant/app.constant';
import { S3ObjectDeleteException } from '../../../../common/exception/s3-object-delete.exception';
import * as Joi from 'joi';
import * as probe from 'probe-image-size';

@Injectable()
export class CollectionCreateValidator implements NestMiddleware {
  private regxForAlfaNum = AppConstant.REGX_ALFA_NUMERIC;
  constructor(private readonly helperService: HelperService) {}

  create = Joi.object().keys({
    homepageBannerImage: Joi.string()
      .required()
      .error(new Error(CollectionErrMessageConstant.homepageBannerImage)),
    categoryPageBannerImage: Joi.string()
      .required()
      .error(new Error(CollectionErrMessageConstant.categoryPageBannerImage)),
    name: Joi.string()
      .required()
      .regex(this.regxForAlfaNum)
      .error(new Error(CollectionErrMessageConstant.nameCheck)),
    status: Joi.boolean()
      .required()
      .error(new Error(CollectionErrMessageConstant.status)),
    description: Joi.string()
      .optional()
      .regex(this.regxForAlfaNum)
      .max(200)
      .error(new Error(CollectionErrMessageConstant.description)),
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
        if (AppConstant.IMAGE_DIMENSION_L1[key] == undefined)
          throw new HttpException(
            {
              error: true,
              message: CommonErrMessageConstant.dimensionKey,
            },
            HttpStatus.BAD_REQUEST,
          );

        if (
          result.width != AppConstant.IMAGE_DIMENSION_L1[key][0] &&
          result.height != AppConstant.IMAGE_DIMENSION_L1[key][1]
        )
          throw new HttpException(
            {
              error: true,
              message:
                key +
                ' dimension required is ' +
                AppConstant.IMAGE_DIMENSION_L1[key],
            },
            HttpStatus.BAD_REQUEST,
          );
      }
    }

    const { error } = this.create.validate(req.body);
    if (error) throw new S3ObjectDeleteException(req.files, error);
    else next();
  }
}
