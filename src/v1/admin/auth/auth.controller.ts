/**
 * @author Mohit Verma
 * @description auth.controller is define functions and return api request param and response params
 * */
import { Controller, Post, Body, Get, HttpCode, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SyncMsService } from '../../../common/utils/sync-ms.service';
import { HelperService } from '../../../common/utils/helper.service';

@Controller({
  path: 'admin/auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly syncMsService: SyncMsService,
    private readonly helperService: HelperService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<{ error: true | false; message: string }> {
    const payLoad = {
      username,
      password,
    };

    return this.authService.UserLogin(payLoad);
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(
    @Body('newPassword') newPassword: string,
    @Body('confirmPassword') confirmPassword: string,
    @Headers('authorization') token: string,
    @Headers('Request-Id') requestId: string,
  ): Promise<{ error: true | false; message: string }> {
    const resetpayLoad = {
      newPassword,
      confirmPassword,
    };

    const headers = this.helperService.setHeader(
      process.env.userClientId,
      requestId,
      token,
    );
    return this.authService.resetPassword(resetpayLoad, headers);
  }
}
