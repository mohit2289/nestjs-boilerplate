/**
 * @author Mohib
 * @description collection.controller is define function which return api request param and response params
 * */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpCode,
  Headers,
} from '@nestjs/common';

import { SyncMsService } from '../../../common/utils/sync-ms.service';
import { HelperService } from '../../../common/utils/helper.service';
import { FileLists } from 'src/common/decorator/file-lists.decorator';
import { UserInfo } from 'src/common/decorator/user-info.decorator';
import { CollectionService } from './collection.service';

@Controller({
  path: 'admin/collection',
  version: '1',
})
export class CollectionController {
  constructor(
    private readonly syncMsService: SyncMsService,
    private readonly helperService: HelperService,
    private readonly collectionService: CollectionService,
  ) {}

  @Post()
  @HttpCode(200)
  async addCollection(
    @Body('name') name: string,
    @Body('homepageBannerImage') homepageBannerImage: string,
    @Body('categoryPageBannerImage') categoryPageBannerImage: string,
    @Body('description') description: string,
    @Body('status') status: string,
    @FileLists() files,
    @UserInfo() userData,
    @Headers('authorization') token: string,
  ): Promise<{ error: true | false; message?: string; data?: any }> {
    const microCategoryUrl = process.env.microCategoryUrl;
    const userClientId = process.env.userClientId;
    const payLoad = {
      name,
      homepageBannerImage,
      categoryPageBannerImage,
      description,
      level: 'L1',
      createdByUsername: userData.email,
      status: JSON.parse(status) ? 'ACTIVE' : 'INACTIVE',
    };

    const header = {
      'Content-Type': 'application/json',
      'Client-Id': process.env.adminClientId,
      Authorization: token,
    };
    return await this.collectionService.createCollection(
      files,
      payLoad,
      header,
    );
  }

  @Post('update')
  async updateProduct(
    @Body('id') id: string,
    @Body('homepageBannerImage') homepageBannerImage: string,
    @Body('categoryPageBannerImage') categoryPageBannerImage: string,
    @Body('description') description: string,
    @Body('status') status: string,
    @FileLists() files,
    @UserInfo() userData,
    @Headers('authorization') token: string,
  ): Promise<{ error: true | false; message?: string; data?: any }> {
    const microCategoryUrl = process.env.microCategoryUrl;
    const userClientId = process.env.userClientId;
    const payLoad = {
      homepageBannerImage,
      categoryPageBannerImage,
      description,
      updatedByUsername: userData.email,
    };
    if (status != undefined)
      payLoad['status'] = JSON.parse(status) ? 'ACTIVE' : 'INACTIVE';
    const header = {
      'Content-Type': 'application/json',
      'Client-id': process.env.adminClientId,
      Authorization: token,
    };
    return await this.collectionService.updateCollection(
      files,
      id,
      this.helperService.clean(payLoad),
      header,
    );
  }

  @Delete(':id')
  removeProduct(@Param('id') collId: string) {
    return null;
  }
}
