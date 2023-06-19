import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { ROUTER } from 'enums'
import {
  AuthGuard,
  JWTValidationMiddware,
  PaginationMiddleware,
  SortMiddleware,
} from 'middlewares'
import { TenantMiddleware } from 'middlewares/tenant.middleware'
import { WorldTenantMiddware } from 'middlewares/worldTenant.middleware copy'
import { UserModule } from './users'
import { WorldsModule } from './worlds/worlds.module'

@Module({
  imports: [
    MongooseModule.forRoot(global.Config.MONGODB_URI),
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
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JWTValidationMiddware)
      .forRoutes({ path: '*', method: RequestMethod.ALL })
    consumer
      .apply(TenantMiddleware)
      .exclude({ path: ROUTER.worlds, method: RequestMethod.ALL })
      .forRoutes({ path: '*', method: RequestMethod.ALL })
    consumer
      .apply(PaginationMiddleware, SortMiddleware)
      .forRoutes({ method: RequestMethod.GET, path: '*' })
    consumer
      .apply(WorldTenantMiddware)
      .forRoutes(ROUTER.users)

  }
  async onModuleInit() {
    console.log('inited module')
  }
}
