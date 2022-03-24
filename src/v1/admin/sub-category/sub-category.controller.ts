/**
 * @author Mohit Verma
 * @description subcategory.controller is define function which return api request param and response params
 * */
import { Controller, Post, Body, HttpCode, Headers } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SyncMsService } from '../../../common/utils/sync-ms.service';
import { HelperService } from '../../../common/utils/helper.service';

@Controller({
  path: 'admin/sub-category',
  version: '1',
})
export class SubCategoryController {
  constructor(
    private readonly syncMsService: SyncMsService,
    private readonly helperService: HelperService,
    private readonly subcategoryService: SubCategoryService,
  ) {}

  @Post()
  @HttpCode(200)
  async subCategory(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('parentCategoryId') parentCategoryId: number,
    @Body('categoryPageBannerImage') categoryPageBannerImage: string,
    @Body('templateFileUrl') templateFileUrl: string,
    @Body('status') status: string,
    @Headers('authorization') token: string,
    @Headers('Request-Id') requestId: string,
  ): Promise<{ error: true | false; message: string }> {
    const postDataObj: {} = {
      name,
      description,
      parentCategoryId,
      categoryPageBannerImage,
      templateFileUrl,
      level: 'L3',
      status: JSON.parse(status) ? 'ACTIVE' : 'INACTIVE',
    };
    const headers: {} = this.helperService.setHeader(
      process.env.adminClientId,
      requestId,
      token,
    );
    return await this.subcategoryService.addSubCategory(postDataObj, headers);
  }

  @Post('update')
  @HttpCode(200)
  async updateCategory(
    @Body('id') id: string,
    @Body('description') description: string,
    @Body('categoryPageBannerImage') categoryPageBannerImage: string,
    @Body('templateFileUrl') templateFileUrl: string,
    @Body('status') status: string,
    @Headers('authorization') token: string,
    @Headers('Request-Id') requestId: string,
  ): Promise<{ error: true | false; message: string }> {
    const updateDataObj: {} = {
      description,
      categoryPageBannerImage,
      templateFileUrl,
      level: 'L3',
    };
    if (status != undefined)
      updateDataObj['status'] = JSON.parse(status) ? 'ACTIVE' : 'INACTIVE';
    const headers: {} = this.helperService.setHeader(
      process.env.adminClientId,
      requestId,
      token,
    );
    return await this.subcategoryService.updateSubCategory(
      id,
      updateDataObj,
      headers,
    );
  }
}
