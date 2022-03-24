import {
  Controller,
  Query,
  Get,
  Post,
  Put,
  Delete,
  Body,
  HttpCode,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller({
  path: 'admin/user',
  version: '1',
})
export class UserController {
  constructor(private readonly userServices: UserService) {}

  @Post()
  @HttpCode(200)
  async addUser(
    @Body() payload: any,
    @Headers('authorization') token: string,
  ): Promise<{ error: true | false; message?: string; data?: any }> {
    const header = {
      'Content-Type': 'application/json',
      'client-id': process.env.userClientId,
      Authorization: token,
    };
    payload['type'] = 'BACKOFFICE';
    payload.managementUser = payload.isMGMTUser;
    delete payload.isMGMTUser;
    return await this.userServices.createUser(header, payload);
  }

  @Put()
  @HttpCode(200)
  async updateUser(
    @Body('id') id: string,
    @Body('isMGMTUser') isMGMTUser: boolean,
    @Body('departments') departments: any,
    @Headers('authorization') token: string,
  ): Promise<{ error: true | false; message?: string; data?: any }> {
    const header = {
      'Content-Type': 'application/json',
      'client-id': process.env.userClientId,
      Authorization: token,
    };
    const payload = {
      managementUser: isMGMTUser,
      departments,
    };
    return await this.userServices.updateUser(header, payload, id);
  }

  @Get()
  @HttpCode(200)
  async getUser(
    @Query() params: any,
    @Headers('authorization') token: string,
  ): Promise<{ error: true | false; message?: string; data?: any }> {
    const header = {
      'Content-Type': 'application/json',
      'client-id': process.env.userClientId,
      Authorization: token,
    };
    return await this.userServices.getUser(header, params);
  }

  @Delete()
  @HttpCode(200)
  async deleteUser(
    @Query('id') id: string,
    @Headers('authorization') token: string,
  ): Promise<{ error: true | false; message?: string; data?: any }> {
    const header = {
      'Content-Type': 'application/json',
      'client-id': process.env.userClientId,
      Authorization: token,
    };
    return await this.userServices.deleteUser(id, header);
  }
}
