/**
 * @author Mohib
 * @description user.service is intended to get and post data to its respective microservice
 * */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SyncMsService } from '../../../common/utils/sync-ms.service';
import { MicroserviceConstant } from '../../../common/constant/microservice.constant';

@Injectable()
export class UserService {
  constructor(private readonly syncMsService: SyncMsService) {}

  async getRoles(header) {
    const msUserMgmntUrl =
      process.env.msUserMgmntUrl +
      MicroserviceConstant.ENDPOINT_V1.CONFIG_MODULE;
    const result = await this.syncMsService.get(msUserMgmntUrl, {}, header);
    if (result['status'] != 200) {
      throw new HttpException(
        {
          error: true,
          message: result['data'].message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return result['data'].data.roles;
  }

  async getDepartment(header, id) {
    const msUserMgmntUrl =
      process.env.msUserMgmntUrl +
      MicroserviceConstant.ENDPOINT_V1.USER_MODULE +
      `/${id}`;
    const result = await this.syncMsService.get(msUserMgmntUrl, {}, header);
    if (result['status'] != 200) {
      throw new HttpException(
        {
          error: true,
          message: result['data'].message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return result['data'].data;
  }

  async createUser(header, payload) {
    const msUserMgmntUrl =
      process.env.msUserMgmntUrl + MicroserviceConstant.ENDPOINT_V1.USER_MODULE;
    const result = await this.syncMsService.post(
      msUserMgmntUrl,
      payload,
      header,
    );
    if (result['status'] != 201) {
      throw new HttpException(
        {
          error: true,
          message: result['data'].message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return { error: false, message: result['data'].message };
  }

  async updateUser(header, payload, id) {
    const msUserMgmntUrl =
      process.env.msUserMgmntUrl +
      MicroserviceConstant.ENDPOINT_V1.USER_MODULE +
      `/${id}`;
    const result = await this.syncMsService.put(
      msUserMgmntUrl,
      payload,
      header,
    );
    if (result['status'] != 200) {
      throw new HttpException(
        {
          error: true,
          message: result['data'].message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return { error: false, message: result['data'].message };
  }

  async getUser(header, payload) {
    const msUserMgmntUrl =
      process.env.msUserMgmntUrl + MicroserviceConstant.ENDPOINT_V1.USER_MODULE;
    const result = await this.syncMsService.get(
      msUserMgmntUrl,
      payload,
      header,
    );
    if (result['status'] != 200) {
      throw new HttpException(
        {
          error: true,
          message: result['data'].message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      error: false,
      data: result['data'].data,
      numItems: result['data'].numItems,
      message: result['data'].message,
    };
  }

  async deleteUser(id, header) {
    const msUserMgmntUrl =
      process.env.msUserMgmntUrl +
      MicroserviceConstant.ENDPOINT_V1.USER_MODULE +
      `/${id}`;
    const result = await this.syncMsService.delete(msUserMgmntUrl, {}, header);
    if (result['status'] != 200) {
      throw new HttpException(
        {
          error: true,
          message: result['data'].message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return { error: false, message: result['data'].message };
  }
}
