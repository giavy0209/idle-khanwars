import { EVENT_SOCKET } from 'constant/enums';
import { IUserFullyPopulate } from 'interfaces/IUser';
import { verify } from 'jsonwebtoken';
import { Types } from 'mongoose';
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
    socket.join(`${payload._id}`)
  } catch (error) {
    socket.disconnect()
  }
})

export default async function socketHandler(
  targets: string | Types.ObjectId,
  event: EVENT_SOCKET,
  data: any,
) {

  const ishaveRoom = io.sockets.adapter.rooms.has(targets.toString())
  if (ishaveRoom) {
    io.to(targets.toString()).emit(event, data)
  }
}




