import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { InjectConnection, MongooseModule } from '@nestjs/mongoose'
import {
  AuthGuard,
  JWTValidationMiddware,
  PaginationMiddleware,
  SortMiddleware,
} from 'middlewares'
import { UserModule } from './users'
import { WorldsModule } from './worlds/worlds.module'
import { MongooseConfigService } from 'services'
import { TenantMiddleware } from 'middlewares/tenant.middleware'
import { ROUTER } from 'enums'
import { Connection } from 'mongoose'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    MongooseModule.forRoot(global.Config.MONGODB_URI,{
      connectionName : global.Config.MONGODB_NAME,
    }),
    UserModule,
    WorldsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule  {
  @InjectConnection(global.Config.MONGODB_NAME) _ : Connection
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JWTValidationMiddware)
      .forRoutes({ path: '*', method: RequestMethod.ALL })
    consumer
      .apply(TenantMiddleware)
      .exclude({ path: ROUTER.worlds, method: RequestMethod.ALL })
      .forRoutes({path : '*', method : RequestMethod.ALL})
    consumer
      .apply(PaginationMiddleware, SortMiddleware)
      .forRoutes({ method: RequestMethod.GET, path: '*' })
  }
  async onModuleInit() {
    console.log('inited module');
  }
}
