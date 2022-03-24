/**
 * @author Mohib
 * @description categories.modules is define api routes, middleware, validator api payload
 * */
import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { AuthMiddleware } from '../../../common/middleware/auth.middleware';
import { AuthorizeMiddleware } from '../../../common/middleware/authorize.middleware';
import { CategoriesService } from './categories.service';
import { CategoriesValidator } from './categories.validator';
import { CategoriesStatusValidator } from './categories-status.validator';
import { HelperService } from 'src/common/utils/helper.service';
import { SyncMsService } from '../../../common/utils/sync-ms.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, HelperService, SyncMsService],
})
export class CategoriesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, AuthorizeMiddleware, CategoriesValidator)
      .forRoutes({ path: 'v1/admin/categories', method: RequestMethod.GET });
    consumer
      .apply(AuthMiddleware, AuthorizeMiddleware, CategoriesStatusValidator)
      .forRoutes({
        path: 'v1/admin/categories/status',
        method: RequestMethod.PUT,
      });
  }
}
