/**
 * @author Mohib
 * @description config.service is intended to get and post data to its respective microservice
 * */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SyncMsService } from '../../../common/utils/sync-ms.service';

@Injectable()
export class ConfigService {
  constructor(private readonly syncMsService: SyncMsService) {}

  async getDepartmentConfig(header) {
    const msUserMgmntUrl = process.env.msUserMgmntUrl;
    const result = await this.syncMsService.get(
      msUserMgmntUrl + 'v1/backoffice/config',
      {},
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
    const data = result['data'].data;
    data.departments.forEach((value) => {
      value.roles.forEach((val) => {
        val['name'] = data.roles.find((o) => o.id === val.roleId).name;
        val.userTypes.forEach((valType) => {
          valType['label'] = data.userTypes.find(
            (o) => o.id === valType.userTypeId,
          ).label;
          const permissionArray = [];
          valType.permissions.forEach((premit) => {
            const permission = value.permissions.find((o) => o.id === premit);
            if (permission != undefined) {
              permissionArray.push(permission);
            }
          });
          if (permissionArray.length > 0) {
            valType['permissions'] = permissionArray;
          }
        });
      });
    });
    return { error: false, data: data };
  }

  async getNavigationConfig() {
    const data = {
      sidenav: [
        {
          item: 'User Management',
          path: 'user',
          icon: 'https://dev-node-aggregator-bucket.s3.ap-south-1.amazonaws.com/media-objects/4092564_profile_about_mobile+ui_user_icon.svg',
          branch: [
            {
              item: 'Create User',
              path: 'createUser',
              departments: [
                {
                  deptName: null,
                  roleName: 'SUPERVISOR',
                },
              ],
            },
            {
              item: 'User List',
              path: 'viewUser',
              departments: [
                {
                  deptName: null,
                  roleName: 'SUPERVISOR',
                },
              ],
            },
          ],
        },
        {
          item: 'Categories',
          path: 'category',
          icon: 'https://dev-node-aggregator-bucket.s3.ap-south-1.amazonaws.com/media-objects/file-text.svg',
          branch: [
            {
              item: 'Collection',
              path: 'level-one',
              permissions: ['ROLE_VIEW_CATEGORY'],
            },
            {
              item: 'Category',
              path: 'level-two',
              permissions: ['ROLE_VIEW_CATEGORY'],
            },
            {
              item: 'Sub-Category',
              path: 'level-three',
              permissions: ['ROLE_VIEW_CATEGORY'],
            },
          ],
        },
      ],
    };
    return { error: false, data: data };
  }
}
