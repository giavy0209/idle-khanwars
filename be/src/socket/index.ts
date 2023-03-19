import { EVENT_SOCKET } from 'constant/enums';
import { IUserFullyPopulate } from 'interfaces/IUser';
import { verify } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { CastleService } from 'services';
import { Server } from "socket.io";
import server from '../server'
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

io.on('connection', socket => {
  const { token, castle } = socket.handshake.auth
  if (!token || !castle) {
    socket.disconnect()
  }
  try {
    const payload = verify(token, global.Config.JWT_SECRET) as IUserFullyPopulate
    socket.data = payload
    socket.join(`${castle}`)
  } catch (error) {
    socket.disconnect()
  }
})

export default async function socketHandler(
  target: IUserFullyPopulate,
  event: EVENT_SOCKET,
  data: any,
  toAll: true
): Promise<void>;

export default async function socketHandler(
  target: string | Types.ObjectId,
  event: EVENT_SOCKET,
  data: any,
  toAll?: false
): Promise<void>;
export default async function socketHandler(
  target: string | Types.ObjectId | IUserFullyPopulate,
  event: EVENT_SOCKET,
  data: any,
  toAll: boolean = false
) {
  if (toAll === true) {
    target = target as IUserFullyPopulate
    const castleService = new CastleService(target)
    const castles = await castleService.find({
      query: { user: target._id },
      idsOnly: true
    })
    const rooms: string[] = []
    castles.forEach(castle => {
      if (io.sockets.adapter.rooms.has(castle.toString())) {
        rooms.push(castle.toString())
      }
    })
    if (rooms.length > 0) {
      io.to(rooms).emit(event, data)
    }
  } else {
    const ishaveRoom = io.sockets.adapter.rooms.has(target.toString())
    if (ishaveRoom) {
      io.to(target.toString()).emit(event, data)
    }
  }
}




