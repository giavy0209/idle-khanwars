import { DOMAIN } from 'const'
import storage from 'utils/storage'
import io from 'socket.io-client'
const socket = io(DOMAIN)

export const reconnect = () => {
  socket.disconnect()
  const token = storage.getToken()
  const castle = storage.getItem('castle')
  socket.auth = {
    token,
    castle
  }
  socket.connect()
}
socket.on('connect', () => {
  console.log('Socket Connected');
})
socket.on('disconnect', (reason) => {
  console.log('Disconnect', reason);
})
export default socket