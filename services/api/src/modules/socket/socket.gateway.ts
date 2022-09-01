import { Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SOCKET } from 'enum/socket.enum';
import { BuildingPopulate } from 'modules/building/building.schema';
import { Training } from 'modules/training/training.schema';
import { UnitPopulate } from 'modules/unit/unit.schema';
import { Upgrade } from 'modules/upgrade/upgrade.schema';
import { UserFullyPopulate } from 'modules/user/user.schema';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: `/${global.Config.APP_CONTEXT}/socket.io`,
})
export class SocketGateway {
  @Inject() readonly jwtService: JwtService;
  @WebSocketServer() server: Server;

  afterInit() {
    this.server.use((socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        const payload: JWTPayload = this.jwtService.verify(token, {
          secret: global.GlobalConfig.JWT_SECRET,
        });
        socket.join(payload._id.toString());
        socket.data.payload = payload;
        next();
      } catch (error) {
        next(new UnauthorizedException('UnAuthorization'));
      }
    });
    this.server.on('connection', (socket) => {
      socket.on(SOCKET.EVENT.JOIN_CASTLE, (castleId: string) => {
        socket.join(castleId);
      });
    });
  }

  emitUser(user: UserFullyPopulate) {
    console.log(user._id.toString(), user);

    this.server.to(user._id.toString()).emit(SOCKET.EVENT.USER, user);
  }

  emitTraining(castle: DataId, training: Training) {
    this.server.to(castle.toString()).emit(SOCKET.EVENT.TRAINING, training);
  }

  emitUnit(castle: DataId, unit: UnitPopulate) {
    this.server.to(castle.toString()).emit(SOCKET.EVENT.UNIT, unit);
  }

  emitBuilding(castle: DataId, building: BuildingPopulate) {
    this.server.to(castle.toString()).emit(SOCKET.EVENT.BUILDING, building);
  }

  emitUpgrade(castle: DataId, upgrade: Upgrade) {
    this.server.to(castle.toString()).emit(SOCKET.EVENT.UPGRADE, upgrade);
  }
}
