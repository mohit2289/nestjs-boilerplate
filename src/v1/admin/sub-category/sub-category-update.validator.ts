/**
 * @author Mohit Verma
 * @description subcategory.update-validator is validate update subcategory(L3) category payload data
 * */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HelperService } from '../../../common/utils/helper.service';
import { SubcategoryErrMessageConstant } from '../../../common/constant/error/subcategory-err-message.constant';
import { CommonErrMessageConstant } from '../../../common/constant/error/common-err-message.constant';
import { AppConstant } from '../../../common/constant/app.constant';
import { ExcelValidatorService } from '../../../common/utils/excel-validator.service';
import * as Joi from 'joi';
import * as probe from 'probe-image-size';

@Injectable()
export class SubCategoryUpdateValidator implements NestMiddleware {
  private regxForAlfaNum = AppConstant.REGX_ALFA_NUMERIC;
  private onlyNum = AppConstant.REGX_ONLY_NUMBER;
  constructor(
    private readonly helperService: HelperService,
    private readonly excelValidator: ExcelValidatorService,
  ) {}

  updateSubcategoryfield = Joi.object().keys({
    id: Joi.string()
      .required()
      .regex(this.onlyNum)
      .error(new Error(SubcategoryErrMessageConstant.id)),
    description: Joi.string()
      .optional()
      .regex(this.regxForAlfaNum)
      .max(200)
      .error(new Error(SubcategoryErrMessageConstant.description)),
    templateFileUrl: Joi.string()
      .allow('')
      .error(new Error(SubcategoryErrMessageConstant.templateFileUrl)),
    categoryPageBannerImage: Joi.string()
      .allow('')
      .error(new Error(SubcategoryErrMessageConstant.categoryPageBannerImage)),
    status: Joi.boolean()
      .optional()
      .error(new Error(SubcategoryErrMessageConstant.status)),
  });

  async use(req: Request, res: Response, next: NextFunction) {
    if (Object.entries(req.files).length > 0) {
      for (const [key, value] of Object.entries(req.files)) {
        if (
          !['jpeg', 'jpg', 'png'].includes(value[0].mimetype.split('/')[1]) &&
          key == 'categoryPageBannerImage'
        )
          throw new HttpException(
            {
              error: true,
              message: CommonErrMessageConstant.fileType,
            },
            HttpStatus.BAD_REQUEST,
          );
        req.body[key] = value[0].location;
        const imageType = value[0].mimetype;
        if (
          (imageType == 'image/png' ||
            imageType == 'image/jpeg' ||
            imageType == 'image/jpg') &&
          key == 'categoryPageBannerImage'
        ) {
          const result = await probe(value[0].location);
          if (AppConstant.IMAGE_DIMENSION_L3[key] == undefined)
            throw new HttpException(
              {
                error: true,
                message: CommonErrMessageConstant.dimensionKey,
              },
              HttpStatus.BAD_REQUEST,
            );
          if (
            result.width != AppConstant.IMAGE_DIMENSION_L3[key][0] &&
            result.height != AppConstant.IMAGE_DIMENSION_L3[key][1]
          )
            throw new HttpException(
              {
                error: true,
                message:
                  key +
                  CommonErrMessageConstant.dimensionRequireKey +
                  AppConstant.IMAGE_DIMENSION_L3[key],
              },
              HttpStatus.BAD_REQUEST,
            );
        } else {
          if (
            !['csv'].includes(value[0].mimetype.split('/')[1]) &&
            key == 'templateFileUrl'
          )
            throw new HttpException(
              {
                error: true,
                message: key + ' ' + CommonErrMessageConstant.csvFileType,
              },
              HttpStatus.BAD_REQUEST,
            );
          if (value[0].key) {
            const filename = value[0].key;
            const rulename = 'template2';
            let excelValid: {} = {};
            excelValid = await this.excelValidator.excelValiation(
              filename,
              rulename,
            );
            if (excelValid['error']) {
              throw new HttpException(
                {
                  error: true,
                  message: excelValid['error'],
                },
                HttpStatus.BAD_REQUEST,
              );
            }
          }
        }
      }
    }
    const { error } = this.updateSubcategoryfield.validate(req.body);
    if (error) {
      if (Object.entries(req.files).length > 0) {
        await this.helperService.deleteS3Object(
          Object.values(req.files).map((v) => {
            return { Key: v[0].key };
          }),
        );
      }
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
