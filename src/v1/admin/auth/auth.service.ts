/**
 * @author Mohit Verma
 * @description auth.service is intended to get and post data to its respective microservice
 */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SyncMsService } from '../../../common/utils/sync-ms.service';
import { MicroserviceConstant } from '../../../common/constant/microservice.constant';
import jwt_decode from 'jwt-decode';

@Injectable()
export class AuthService {
  constructor(private readonly syncMsService: SyncMsService) {}

  async UserLogin(payLoad: {}) {
    const responseObject = {
      error: false,
      data: '',
      message: '',
    };

    const microLoginUrl =
      process.env.msUserMgmntUrl + MicroserviceConstant.ENDPOINT_V1.LOGIN_URL;
    const userDataUrl =
      process.env.msUserMgmntUrl +
      MicroserviceConstant.ENDPOINT_V1.GET_USER_DATA;
    const configDataUrl = process.env.microConfigUrl;
    const header = {
      'Content-Type': 'application/json',
      'Client-Id': process.env.userClientId,
      Authorization: '',
    };
    const result = await this.syncMsService.post(
      microLoginUrl,
      payLoad,
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
    const deptData: any = [];
    const finalResp: any = {};
    if (result.data) {
      const headers = {
        'Content-Type': 'application/json',
        'Client-Id': process.env.userClientId,
        Authorization: '',
      };
      const accessToken = result.data.data.accessToken;
      const requestId = result.data.requestId;
      const jwtDecode: any = jwt_decode(accessToken);
      headers.Authorization = 'Bearer ' + accessToken;

      let configDeptData: any;
      configDeptData = await this.syncMsService.get(configDataUrl, '', headers);
      configDeptData = configDeptData.data;

      const userid = jwtDecode.data.id;
      const getUserDataApiUrl = userDataUrl + '' + userid;
      const userDataResp: any = await this.syncMsService.get(
        getUserDataApiUrl,
        '',
        headers,
      );
      if (userDataResp.data.data == null) {
        throw new HttpException(
          {
            error: true,
            message: userDataResp['data'].message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const userDepartmentData: any = userDataResp.data.data.departments;
      const isMGMTUser = userDataResp.data.data.managementUser;
      const firstTimeLogin = userDataResp.data.data.firstTimeLogin;
      const username = userDataResp.data.data.email;
      const fullName = userDataResp.data.data.fullName;

      userDepartmentData.forEach((value: any) => {
        const deptname = configDeptData.data.departments.find(
          (o: any) => o.id === value.departmentId,
        );
        value['deptName'] = configDeptData.data.departments.find(
          (o: any) => o.id === value.departmentId,
        ).name;
        value['role']['roleName'] = configDeptData.data.roles.find(
          (o: any) => o.id === value.role.roleId,
        ).name;
        const userType = configDeptData.data.userTypes.find(
          (o: any) => o.id === value.role.userType,
        ).label;
        value.role['userTypeName'] = userType;

        const permissionArray = [];
        value.role.permissions.forEach((premit: any) => {
          const permission = deptname.permissions.find(
            (o: any) => o.id === premit,
          );
          if (permission != undefined) {
            permissionArray.push(permission);
          }
        });
        if (permissionArray.length > 0) {
          value.role['permissions'] = permissionArray;
        }
        deptData.push(value);
      });
      finalResp['accessToken'] = accessToken;
      finalResp['isMGMTUser'] = isMGMTUser;
      finalResp['firstTimeLogin'] = firstTimeLogin;
      finalResp['departments'] = deptData;

      finalResp['fullName'] = fullName;
      finalResp['username'] = username;
    }
    responseObject.data = finalResp;
    responseObject.message = result.data.message;
    return responseObject;
  }

  async resetPassword(payLoad: any, header: any) {
    const responseObject = {
      error: false,
      data: '',
      message: '',
    };
    const microresetUrl =
      process.env.msUserMgmntUrl +
      MicroserviceConstant.ENDPOINT_V1.RESET_PASSWORD;
    const result = await this.syncMsService.post(
      microresetUrl,
      payLoad,
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
    responseObject.data = result.data;
    return responseObject;
  }
}
