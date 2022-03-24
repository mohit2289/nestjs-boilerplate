/**
 * @author Mohib
 * @description category.controller is define function which return api request param and response params
 * */
import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  Headers,
  Param,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { SyncMsService } from '../../../common/utils/sync-ms.service';
import { HelperService } from '../../../common/utils/helper.service';
import { FileLists } from 'src/common/decorator/file-lists.decorator';
import { UserInfo } from 'src/common/decorator/user-info.decorator';

@Controller({
  path: 'admin/category',
  version: '1',
})
export class CategoryController {
  constructor(
    private readonly syncMsService: SyncMsService,
    private readonly helperService: HelperService,
    private readonly categoriesService: CategoryService,
  ) {}

  @Post()
  @HttpCode(200)
  async addCategory(
    @Body('name') name: string,
    @Body('categoryPageBannerImage') categoryPageBannerImage: string,
    @Body('description') description: string,
    @Body('parentCategoryId') parentCategoryId: string,
    @Body('status') status: string,
    @FileLists() files,
    @Headers('authorization') token: string,
    @UserInfo() userData,
  ): Promise<{ error: true | false; message?: string; data?: any }> {
    const microCategoryUrl = process.env.microCategoryUrl;
    const userClientId = process.env.userClientId;
    const payLoad = {
      name,
      categoryPageBannerImage,
      description,
      level: 'L2',
      parentCategoryId,
      createdByUsername: userData.email,
      status: JSON.parse(status) ? 'ACTIVE' : 'INACTIVE',
    };

    const header = {
      'Content-Type': 'application/json',
      'Client-Id': process.env.adminClientId,
      Authorization: token,
    };
    return await this.categoriesService.createCategory(files, payLoad, header);
  }

  @Post('update')
  @HttpCode(200)
  async updateCategory(
    @Body('id') id: string,
    @Body('categoryPageBannerImage') categoryPageBannerImage: string,
    @Body('description') description: string,
    @Body('status') status: string,
    @FileLists() files,
    @Headers('authorization') token: string,
    @UserInfo() userData,
  ): Promise<{ error: true | false; message?: string; data?: any }> {
    const microCategoryUrl = process.env.microCategoryUrl;
    const userClientId = process.env.userClientId;
    const payLoad = {
      categoryPageBannerImage,
      description,
      level: 'L2',
      updatedByUsername: userData.email,
    };
    if (status != undefined)
      payLoad['status'] = JSON.parse(status) ? 'ACTIVE' : 'INACTIVE';
    const header = {
      'Content-Type': 'application/json',
      'Client-Id': process.env.adminClientId,
      Authorization: token,
    };
    return await this.categoriesService.updateCategory(
      files,
      id,
      this.helperService.clean(payLoad),
      header,
    );
  }
}
