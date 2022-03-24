/**
 * @author Mohit Verma
 * @description config.controller is define function and return api request param and response params
 * */
import { Controller, Get, Headers, HttpCode } from '@nestjs/common';
import { ConfigService } from './config.service';

@Controller({
  path: 'admin/config',
  version: '1',
})
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @HttpCode(200)
  async getDepartment(
    @Headers('authorization') token: string,
  ): Promise<{ error: true | false; message?: string; data?: any }> {
    const header = {
      'Content-Type': 'application/json',
      'client-id': process.env.userClientId,
      Authorization: token,
    };
    return await this.configService.getDepartmentConfig(header);
  }

  @Get('navigation')
  @HttpCode(200)
  getNavigation(): Promise<{
    error: true | false;
    message?: string;
    data?: any;
  }> {
    return this.configService.getNavigationConfig();
  }
}
