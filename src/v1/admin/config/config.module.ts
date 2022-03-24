/**
 * @author Mohib
 * @description config.module is define api routes, middleware method, validator api payload
 * */
import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { AuthMiddleware } from '../../../common/middleware/auth.middleware';
import { AppConstant } from '../../../common/constant/app.constant';
import { HelperService } from 'src/common/utils/helper.service';
import { SyncMsService } from '../../../common/utils/sync-ms.service';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';

@Module({
  controllers: [ConfigController],
  providers: [AppConstant, HelperService, SyncMsService, ConfigService],
})
export class ConfigurationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'v1/admin/config', method: RequestMethod.GET });
    consumer.apply(AuthMiddleware).forRoutes({
      path: 'v1/admin/config/navigation',
      method: RequestMethod.GET,
    });
  }
}
