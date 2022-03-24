/**
 * @author Mohib
 * @description user.modules is define api routes, middleware, validator api payload
 * */
import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { AuthMiddleware } from '../../../common/middleware/auth.middleware';
import { PermissionMiddleware } from '../../../common/middleware/permission.middleware';
import { PermissionUpdateMiddleware } from '../../../common/middleware/permission-update.middleware';
import { PermissionDeleteMiddleware } from '../../../common/middleware/permission-delete.middleware';
import { AppConstant } from '../../../common/constant/app.constant';
import { HelperService } from 'src/common/utils/helper.service';
import { SyncMsService } from '../../../common/utils/sync-ms.service';
import { UserController } from './user.controller';
import { UserCreateValidator } from './validator/user-create.validator';
import { UserUpdateValidator } from './validator/user-update.validator';
import { UserGetValidator } from './validator/user-get.validator';
import { UserDeleteValidator } from './validator/user-delete.validator';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [AppConstant, HelperService, SyncMsService, UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, UserCreateValidator, PermissionMiddleware)
      .forRoutes({ path: 'v1/admin/user', method: RequestMethod.POST })
      .apply(AuthMiddleware, UserUpdateValidator, PermissionUpdateMiddleware)
      .forRoutes({ path: 'v1/admin/user', method: RequestMethod.PUT })
      .apply(AuthMiddleware, UserGetValidator)
      .forRoutes({ path: 'v1/admin/user', method: RequestMethod.GET })
      .apply(AuthMiddleware, UserDeleteValidator, PermissionDeleteMiddleware)
      .forRoutes({ path: 'v1/admin/user', method: RequestMethod.DELETE });
  }
}
