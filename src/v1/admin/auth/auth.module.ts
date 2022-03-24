/**
 * @author Mohit Verma
 * @description auth.module is define api route, middleware, validator api payload
 * */
import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from '../../../common/middleware/auth.middleware';
import { AuthService } from './auth.service';
import { AuthLoginValidator } from './auth-login.validator';
import { AuthResetPasswordValidator } from './auth-resetpassword.validator';
import { HelperService } from 'src/common/utils/helper.service';
import { SyncMsService } from '../../../common/utils/sync-ms.service';
import { ResetPassordMiddleware } from '../../../common/middleware/reset-password.middleware';

@Module({
  controllers: [AuthController],
  providers: [AuthService, HelperService, SyncMsService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthLoginValidator)
      .forRoutes({ path: 'v1/admin/auth/login', method: RequestMethod.POST });
    consumer
      .apply(ResetPassordMiddleware, AuthResetPasswordValidator)
      .forRoutes({
        path: 'v1/admin/auth/reset-password',
        method: RequestMethod.POST,
      });
  }
}
