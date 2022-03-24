/**
 * @author Mohit Verma
 * @description subcategory.module is define api route, middleware, validator api payload
 * */
import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { SubCategoryController } from './sub-category.controller';
import { AuthMiddleware } from '../../../common/middleware/auth.middleware';
import { AuthorizeMiddleware } from '../../../common/middleware/authorize.middleware';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryValidator } from './sub-category.validator';
import { SubCategoryUpdateValidator } from './sub-category-update.validator';
import { HelperService } from 'src/common/utils/helper.service';
import { SyncMsService } from '../../../common/utils/sync-ms.service';
import { UploadMiddleware } from '../../../common/middleware/upload.middleware';
import { UploadService } from '../../../common/utils/upload.service';
import { ExcelValidatorService } from 'src/common/utils/excel-validator.service';

@Module({
  controllers: [SubCategoryController],
  providers: [
    SubCategoryService,
    HelperService,
    SyncMsService,
    UploadService,
    ExcelValidatorService,
  ],
})
export class SubCategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        AuthMiddleware,
        AuthorizeMiddleware,
        UploadMiddleware,
        SubCategoryValidator,
      )
      .forRoutes({ path: 'v1/admin/sub-category', method: RequestMethod.POST });
    consumer
      .apply(
        AuthMiddleware,
        AuthorizeMiddleware,
        UploadMiddleware,
        SubCategoryUpdateValidator,
      )
      .forRoutes({
        path: 'v1/admin/sub-category/update',
        method: RequestMethod.POST,
      });
  }
}
