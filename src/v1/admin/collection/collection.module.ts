import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { CollectionCreateValidator } from './validator/collection-create.validator';
import { CollectionUpdateValidator } from './validator/collection-update.validator';
import { CollectionController } from './collection.controller';
import { AuthMiddleware } from '../../../common/middleware/auth.middleware';
import { UploadMiddleware } from '../../../common/middleware/upload.middleware';
import { UploadService } from '../../../common/utils/upload.service';
import { AppConstant } from '../../../common/constant/app.constant';
import { HelperService } from 'src/common/utils/helper.service';
import { SyncMsService } from '../../../common/utils/sync-ms.service';
import { CollectionService } from './collection.service';
import { AuthorizeMiddleware } from '../../../common/middleware/authorize.middleware';

@Module({
  controllers: [CollectionController],
  providers: [
    AppConstant,
    UploadService,
    HelperService,
    SyncMsService,
    CollectionService,
  ],
})
export class CollectionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        AuthMiddleware,
        AuthorizeMiddleware,
        UploadMiddleware,
        CollectionCreateValidator,
      )
      .forRoutes({ path: 'v1/admin/collection', method: RequestMethod.POST })
      .apply(
        AuthMiddleware,
        AuthorizeMiddleware,
        UploadMiddleware,
        CollectionUpdateValidator,
      )
      .forRoutes({
        path: 'v1/admin/collection/update',
        method: RequestMethod.POST,
      });
  }
}
