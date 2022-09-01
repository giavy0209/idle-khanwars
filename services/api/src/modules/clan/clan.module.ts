/** @format */

import { Module } from '@nestjs/common';
import { ModelModule } from '@vypham0209/nestjs-common';
import { SocketModule } from 'modules/socket/socket.module';
import { User } from 'modules/user/user.schema';
import { ClanRequest } from './clan-request.schema';
import { ClanController } from './clan.controller';
import { Clan } from './clan.schema';
import { ClanService } from './clan.service';

@Module({
  imports: [ModelModule.register([Clan, ClanRequest, User]), SocketModule],
  controllers: [ClanController],
  providers: [ClanService],
})
export class ClanModule {}
