/**
 * @author Mohib
 * @description category.service is intended to get and post data to its respective microservice
 * */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SyncMsService } from '../../../common/utils/sync-ms.service';
import { MicroserviceConstant } from '../../../common/constant/microservice.constant';
import { S3ObjectDeleteException } from 'src/common/exception/s3-object-delete.exception';

@Injectable()
export class CategoryService {
  constructor(private readonly syncMsService: SyncMsService) {}

  async createCategory(files: any, payLoad: any, header: any) {
    const microCategoryUrl = process.env.microCategoryUrl;
    const result = await this.syncMsService.post(
      microCategoryUrl,
      payLoad,
      header,
    );
    if (result && result['status'] != 200) {
      throw new S3ObjectDeleteException(files, result['data']);
    }
    return {
      error: false,
      data: result.data.data,
      message: result.data.message,
    };
  }

  async updateCategory(files: any, id: string, payLoad: any, header: any) {
    const microCategoryUrl = process.env.microCategoryUrl + `/${id}`;
    const result = await this.syncMsService.put(
      microCategoryUrl,
      payLoad,
      header,
    );
    if (result && result['status'] != 200) {
      throw new S3ObjectDeleteException(files, result['data']);
    }
    return {
      error: false,
      data: result['data'].data,
      message: result['data'].message,
    };
  }
}
