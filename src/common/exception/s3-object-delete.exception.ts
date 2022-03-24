import { HttpException, HttpStatus } from '@nestjs/common';
import { HelperService } from '../utils/helper.service';

export class S3ObjectDeleteException extends HttpException {
  /**
   * @description Delete file form S3 bucket
   * @param {object} files uploaded file name
   */
  deleteFilesFromS3 = async (files) => {
    const helperService = new HelperService();
    await helperService.deleteS3Object(
      Object.values(files).map((v) => {
        return { Key: v[0].key };
      }),
    );
  };
  constructor(files: [], error: any) {
    super(
      {
        error: true,
        message: error.message,
      },
      HttpStatus.BAD_REQUEST,
    );
    if (Object.entries(files).length > 0) {
      this.deleteFilesFromS3(files);
    }
  }
}
