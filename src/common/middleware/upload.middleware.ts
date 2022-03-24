import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';
import { UploadService } from '../utils/upload.service';
import { AppConstant } from '../../common/constant/app.constant';
import { CommonErrMessageConstant } from '../../common/constant/error/common-err-message.constant';

@Injectable()
export class UploadMiddleware implements NestMiddleware {
  upload: any;

  constructor(private uploadService: UploadService) {}
  /**
   * @description get category level name
   * @param {object} routePath api route name
   */
  getLevelFieldData = (routePath) => {
    const s3BucketData = { fieldData: [], bucketFolder: '' };

    if (routePath.indexOf('/collection') != -1) {
      s3BucketData.fieldData = AppConstant.FIELD_DATA_L1;
      s3BucketData.bucketFolder = AppConstant.L1_DATA;
    } else if (routePath.indexOf('/category') != -1) {
      s3BucketData.fieldData = AppConstant.FIELD_DATA_L2;
      s3BucketData.bucketFolder = AppConstant.L2_DATA;
    } else if (routePath.indexOf('/sub-category') != -1) {
      s3BucketData.fieldData = AppConstant.FIELD_DATA_L3;
      s3BucketData.bucketFolder = AppConstant.L3_DATA;
    }

    return s3BucketData;
  };

  /**
   * @description upload file on s3 bucket
   * @param {object } req request api object
   * @param {object } res response api object
   * @returns
   */
  uploadFile = (req, res): Promise<{ message: string }> => {
    return new Promise((resolve, reject) => {
      const routePath = req.route.path;
      const levelWiseBucketData = this.getLevelFieldData(routePath);
      if (levelWiseBucketData.fieldData.length == 0)
        reject(
          new HttpException(
            {
              error: true,
              message: CommonErrMessageConstant.serverError,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      this.upload = this.uploadService
        .uploadFile(levelWiseBucketData.bucketFolder)
        .fields(levelWiseBucketData.fieldData);
      this.upload(req, res, (err) => {
        resolve(err);
      });
    });
  };

  async use(req: Request, res: Response, next: NextFunction) {
    this.uploadFile(req, res)
      .then((response) => {
        if (response instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          throw new HttpException(
            {
              error: true,
              message: response,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        } else if (response) {
          // An unknown error occurred when uploading.
          throw new HttpException(
            {
              error: true,
              message: response.message,
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        next();
      })
      .catch((error) => {
        next(error);
      });
  }
}
