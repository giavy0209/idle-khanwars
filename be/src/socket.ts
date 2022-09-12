import { verify } from 'jsonwebtoken';
import { Server } from "socket.io";
import server from './server'

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})
io.use((socket, next) => {
  const { token } = socket.handshake.auth
  if (!token) return socket.disconnect()
  try {
    const payload: any = verify(token, global.Config.JWT_SECRET)
    const _id = payload._id
    socket.data = { _id }
    socket.join(_id + '')
  } catch (error) {
    socket.disconnect()
    return
  }
  next()
})
// io.on('connection', socket => {
// })
export default io