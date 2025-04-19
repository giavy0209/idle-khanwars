import {
  Controller,
  Get,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import {
  GlobalModule,
  JWTValidationMiddleware,
  Public,
} from '@vypham0209/nestjs-common';
import { join } from 'path';
import { BuildingModule } from './building/building.module';
import { ClanModule } from './clan/clan.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ScheduleService } from './schedule/schedule.service';
import { SocketModule } from './socket/socket.module';
import { TrainingModule } from './training/training.module';
import { UpgradeModule } from './upgrade/upgrade.module';
import { UserModule } from './user/user.module';
import { WorldInitService } from './world/world-init.service';
import { WorldModule } from './world/world.module';
import { WorldService } from './world/world.service';

@Controller()
export class AppController {
  @Public()
  @Get()
  getHello() {
    return {
      message: 'Hello World',
    };
  }
}

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      serveRoot: `/${Config.APP_CONTEXT}`,
    }),
    MongooseModule.forRoot(global.Config.MONGODB_URI),
    GlobalModule.register({
      async init(
        worldService: WorldService,
        worldInitService: WorldInitService,
        scheduleService: ScheduleService,
      ) {
        const worlds = await worldService.get();
        global.tenants.push(...worlds.map((o) => o.tenant));
        for (const world of worlds) {
          await worldInitService.init(world);
          scheduleService.register(world);
        }
      },
      imports: [WorldModule, ScheduleModule],
      initInject: [WorldService, WorldInitService, ScheduleService],
    }),
    UserModule,
    WorldModule,
    BuildingModule,
    SocketModule,
    TrainingModule,
    UpgradeModule,
    ClanModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JWTValidationMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
