import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

const ENV = process.env.NODE_ENV;
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CollectionModule } from './v1/admin/collection/collection.module';
import { AuthModule } from './v1/admin/auth/auth.module';
import { ConfigurationModule } from './v1/admin/config/config.module';
import { UserModule } from './v1/admin/user/user.module';
import { CategoriesModule } from './v1/admin/categories/categories.module';
import { SubCategoryModule } from './v1/admin/sub-category/sub-category.module';
import { CategoryModule } from './v1/admin/category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
    CollectionModule,
    ConfigurationModule,
    AuthModule,
    UserModule,
    CategoriesModule,
    CategoryModule,
    SubCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {}
}
