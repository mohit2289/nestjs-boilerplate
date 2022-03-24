/**
 * @author Mohib
 * @description categories.service is intended to get and update data to its respective microservice
 * */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SyncMsService } from '../../../common/utils/sync-ms.service';
import { MicroserviceConstant } from '../../../common/constant/microservice.constant';
import jwt_decode from 'jwt-decode';

@Injectable()
export class CategoriesService {
  constructor(private readonly syncMsService: SyncMsService) {}

  async getCategories(params: string, header: any) {
    const responseObject = {
      error: false,
      data: '',
      message: '',
    };
    const finalArr: any = {};
    let sucssmessage = '';
    if (typeof params != undefined && params != '') {
      const levelsArr = params.split(',');
      for (let i = 0; i < levelsArr.length; i++) {
        const levelname = levelsArr[i].toUpperCase();
        const option = {
          searchParams: {
            level: {
              comparativeRelation: 'eq',
              value: levelname,
            },
          },
        };
        const categoriesUrl =
          process.env.microCategoryUrl +
          MicroserviceConstant.ENDPOINT_V1.CATEGORIES;
        const result = await this.syncMsService.post(
          categoriesUrl,
          option,
          header,
        );
        if (result && result['status'] != 200) {
          throw new HttpException(
            {
              error: true,
              message: result['data'].message,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        if (result.data.data.length > 0) {
          finalArr[levelname] = result.data.data;
          sucssmessage = result.data.message;
        }
      }
    }
    responseObject.data = finalArr;
    responseObject.message = sucssmessage;
    return responseObject;
  }

  async updateCategoriesStatus(payload: any, header: any) {
    const updateresponseObject = {
      error: false,
      data: '',
      message: '',
    };
    const accessTokenVal = header.Authorization;
    const jwtDecode = jwt_decode(accessTokenVal);
    const username = jwtDecode['sub'];
    const categoriesStatusUrl = process.env.microCategoryUrl;
    let updateresp: any = '';
    const postData = payload;
    for (let i = 0; i < postData.length; i++) {
      postData[i]['reviewedBy'] = username;
    }
    updateresp = await this.syncMsService.put(
      categoriesStatusUrl,
      postData,
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
    updateresponseObject.data = updateresp.data.data;
    updateresponseObject.message = updateresp['data'].message;
    return updateresponseObject;
  }
}
