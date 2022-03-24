/**
 * @author Siddhant Bahuguna
 *
 * @description collection.service is intended to get and post data to its
 * respective microservice
 */

import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { CommonErrMessageConstant } from '../../common/constant/error/common-err-message.constant';

@Injectable()
export class HelperService {
  s3AccessKey = process.env.s3AccessKey;
  s3SecretKey = process.env.s3SecretKey;
  bucketPath = process.env.bucketPath;

  s3 = new AWS.S3({
    accessKeyId: this.s3AccessKey,
    secretAccessKey: this.s3SecretKey,
  });
  /**
   * @description String to Url function
   * @param {*} value Value
   */
  processStringToUrlFriendly = (value) => {
    return value == undefined
      ? ''
      : value
          .replace(/[^a-z0-9_]+/gi, '-')
          .replace(/^-|-$/g, '')
          .toLowerCase();
  };
  /**
   * @description Get Mongo Document Id
   * @param {object} doc Document
   */
  getDocumentIdString = (doc) => {
    return doc._id.toString();
  };
  /**
   * @description This is common function to send API success message
   * @param {*} res Response
   * @param {*} data Data
   * @param {*} message Error/success message
   */
  handleSuccess = (res, data, message) => {
    const response = {
      data: data,
      error: null,
      message,
    };
    if (message) response.message = message;
    res.status(200).send(response);
  };
  /**
   * @description This is common function to send API failure message
   * @param {object} res Response
   * @param {number} statusCode Status code
   * @param {string} message Success/Error message
   */
  handleFailure = (res, statusCode, message) => {
    res.status(statusCode || 500).send({
      error: true,
      message: message || CommonErrMessageConstant.serverError,
    });
  };
  /**
   * @description This is common function to get AWS s3 bucket
   * @param {*} bucket Bucket value
   * @param {*} key key
   */
  getS3Object = (bucket, key) => {
    return new Promise((resolve, reject) => {
      this.s3.getObject(
        {
          Bucket: bucket, // your bucket name,
          Key: key,
        },
        function (err, data) {
          // Handle any error and exit
          if (err) reject(err);
          else resolve(data);
        },
      );
    });
  };
  /**
   * @description This is common function to remove item from array data
   * @param {array} array Items in array
   * @param {*} value Value
   */
  removeItemFromScalarAarray = (array, value) => {
    const index = array.indexOf(value);
    if (index > -1) {
      array.splice(index, 1);
    }
    return array;
  };
  /**
   * @description This is common function to get AWS s3 stream data
   * @param {*} bucket Bucket name
   * @param {*} filename File name
   */
  getS3Stream = (bucket, filename) => {
    return this.s3
      .getObject({ Bucket: bucket, Key: filename })
      .createReadStream();
  };
  /**
   * @description This is common function to delete s3 object
   * @param {object} objects Objects
   */
  deleteS3Object = (objects) => {
    return new Promise((resolve, reject) => {
      this.s3.deleteObjects(
        { Bucket: this.bucketPath, Delete: { Objects: objects } },
        function (err, data) {
          if (err) reject(err);
          else resolve(data);
        },
      );
    });
  };
  /**
   * @description This is common function to clean
   * @param {object} obj Object
   */
  clean = (obj) => {
    for (const propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj;
  };

  /**
   * @description set header value for call api.
   * @param {string} clientId  client id
   * @param {string} requestId request id for check api
   * @param {string} token user login token
   * @returns
   */
  setHeader = (clientId?: string, requestId?: string, token?: string) => {
    const headerObj = {
      'Content-Type': 'application/json',
      'client-id': clientId,
      RequestId: requestId,
      Authorization: token,
    };
    const headerParams = this.clean(headerObj);
    return headerParams;
  };
}
