/**
 * @author Mohit Verma
 * @description subcategory.service is intended to get and post data to its
 * respective microservice
 */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SyncMsService } from '../../../common/utils/sync-ms.service';
import jwt_decode from 'jwt-decode';

@Injectable()
export class SubCategoryService {
  constructor(private readonly syncMsService: SyncMsService) {}

  async addSubCategory(params, header) {
    const responseObject = {
      error: false,
      data: '',
      message: '',
    };
    const accessTokenVal = header.Authorization;
    const jwtDecode = jwt_decode(accessTokenVal);
    const username = jwtDecode['sub'];
    params['createdByUsername'] = username;
    const subcategoriesUrl = process.env.microCategoryUrl;
    let result: {} = {};
    result = await this.syncMsService.post(subcategoriesUrl, params, header);
    if (result && result['status'] != 200) {
      throw new HttpException(
        {
          error: true,
          message: result['data'].message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    responseObject.data = result['data']['data'];
    responseObject.message = result['data']['message'];
    return responseObject;
  }

  async updateSubCategory(id, payload, header) {
    const updateresponseObject = {
      error: false,
      data: '',
      message: '',
    };
    const accessTokenVal = header.Authorization;
    const jwtDecode = jwt_decode(accessTokenVal);
    const username = jwtDecode['sub'];
    payload['updatedByUsername'] = username;
    const updateSubcategoryUrl = process.env.microCategoryUrl + `/${id}`;
    let updateresp: {} = {};
    updateresp = await this.syncMsService.put(
      updateSubcategoryUrl,
      payload,
      header,
    );
    if (updateresp && updateresp['status'] != 200) {
      throw new HttpException(
        {
          error: true,
          message: updateresp['data'].message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    updateresponseObject.data = updateresp['data']['data'];
    updateresponseObject.message = updateresp['data'].message;
    return updateresponseObject;
  }
}
