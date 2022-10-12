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
io.use((socket, next) => {
  const { token, castle } = socket.handshake.auth
  if (!token) return socket.disconnect()
  try {
    const payload = verify(token, global.Config.JWT_SECRET) as IUserFullyPopulate
    socket.data = payload
    socket.join(`${castle}`)
  } catch (error) {
    socket.disconnect()
    return
  }
  next()
})

const socketHandler = (castle: string | Types.ObjectId, event: string, data : any) => {
  const ishaveRoom = io.sockets.adapter.rooms.has(castle.toString())
  if (ishaveRoom) {
    io.to(castle.toString()).emit(event, data)
  }
}

export default socketHandler

