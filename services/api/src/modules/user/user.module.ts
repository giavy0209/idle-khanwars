/** @format */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ModelModule } from '@vypham0209/nestjs-common';
import { BuildingModule } from 'modules/building/building.module';
import { CastleModule } from 'modules/castle/castle.module';
import { ResourceModule } from 'modules/resource/resource.module';
import { UnitModule } from 'modules/unit/unit.module';
import { World } from 'modules/world/world.schema';
import { UserController } from './user.controller';
import { User } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    ModelModule.registerWithoutRequest([User]),
    ModelModule.register([World, User]),
    JwtModule,
    CastleModule,
    BuildingModule,
    UnitModule,
    ResourceModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
