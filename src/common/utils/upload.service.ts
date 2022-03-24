/**
 * @author Siddhant Bahuguna
 *
 * @description collection.service is intended to get and post data to its
 * respective microservice
 */

import { Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { CommonErrMessageConstant } from '../../common/constant/error/common-err-message.constant';

@Injectable()
export class UploadService {
  s3AccessKey = process.env.s3AccessKey;
  s3SecretKey = process.env.s3SecretKey;
  bucketPath = process.env.bucketPath;

  s3 = new AWS.S3({
    accessKeyId: this.s3AccessKey,
    secretAccessKey: this.s3SecretKey,
  });

  /**
   * @description upload s3 bucket file
   * @param {*} key key
   * @returns
   */
  uploadFile = (key) =>
    multer({
      storage: multerS3({
        s3: this.s3,
        bucket: this.bucketPath,
        acl: 'public-read',
        /**
         * @description upload file metdata
         * @param {object} _req request object
         * @param {string} file stringfile
         * @param {*} cb  return function
         */
        metadata: (_req, file, cb) => {
          cb(null, { fieldName: file.fieldname });
        },
        /**
         * @description upload file metdata
         * @param {object} _req request object
         * @param {string} file stringfile
         * @param {*} cb  return function
         */
        key: (_req, file, cb) => {
          cb(
            null,
            `${key}/${Date.now().toString()}.${
              file.originalname.split('.')[1]
            }`,
          );
        },
      }),
      /**
       * @description check file type
       * @param {object} req request object
       * @param {string} file file name
       * @param {object} cb return message
       */
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'image/png' ||
          file.mimetype === 'text/csv'
        ) {
          cb(null, true);
        } else {
          cb({ message: CommonErrMessageConstant.fileType }, true);
        }
      },
      limits: {
        fileSize: 1080 * 1080 * 5,
      },
    });
}
