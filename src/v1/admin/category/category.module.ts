/**
 * @author Mohib
 * @description category.modules is define api routes, middleware, validator api payload
 * */
import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { CategoryController } from './category.controller';
import { AuthMiddleware } from '../../../common/middleware/auth.middleware';
import { AuthorizeMiddleware } from '../../../common/middleware/authorize.middleware';
import { CategoryService } from './category.service';
import { CategoryCreateValidator } from './validator/category-create.validator';
import { CategoryUpdateValidator } from './validator/category-update.validator';
import { HelperService } from 'src/common/utils/helper.service';
import { SyncMsService } from '../../../common/utils/sync-ms.service';
import { UploadService } from '../../../common/utils/upload.service';
import { UploadMiddleware } from '../../../common/middleware/upload.middleware';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, HelperService, SyncMsService, UploadService],
})
export class CategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        AuthMiddleware,
        AuthorizeMiddleware,
        UploadMiddleware,
        CategoryCreateValidator,
      )
      .forRoutes({ path: 'v1/admin/category', method: RequestMethod.POST })
      .apply(
        AuthMiddleware,
        AuthorizeMiddleware,
        UploadMiddleware,
        CategoryUpdateValidator,
      )
      .forRoutes({
        path: 'v1/admin/category/update',
        method: RequestMethod.POST,
      });
  }
}
