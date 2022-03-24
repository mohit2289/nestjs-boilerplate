/**
 * @author Mohib
 * @description categories.controller is define function which return api request param and response params
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
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { SyncMsService } from '../../../common/utils/sync-ms.service';
import { HelperService } from '../../../common/utils/helper.service';

@Controller({
  path: 'admin/categories',
  version: '1',
})
export class CategoriesController {
  constructor(
    private readonly syncMsService: SyncMsService,
    private readonly helperService: HelperService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  @HttpCode(200)
  async categories(
    @Query('levels') levels: string,
    @Headers('authorization') token: string,
    @Headers('Request-Id') requestId: string,
  ): Promise<{ error: true | false; message: string }> {
    const finalArr: any = {};
    const headers = this.helperService.setHeader(
      process.env.adminClientId,
      requestId,
      token,
    );
    const params = levels;
    return await this.categoriesService.getCategories(params, headers);
  }

  @Put('status')
  @HttpCode(200)
  async categoriesStatus(
    @Body() bodydata: any,
    @Headers('authorization') token: string,
    @Headers('Request-Id') requestId: string,
  ): Promise<{ error: true | false; message: string }> {
    const postBodyData = bodydata;
    const headers = this.helperService.setHeader(
      process.env.adminClientId,
      requestId,
      token,
    );
    return await this.categoriesService.updateCategoriesStatus(
      postBodyData,
      headers,
    );
  }
}
