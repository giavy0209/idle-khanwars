import { DOMAIN } from 'const'
import storage from 'utils/storage'
import io from 'socket.io-client'
const token = storage.getToken()
const castle = storage.getItem('castle')
const socket = io(DOMAIN, {
  auth: {
    token,
    castle : castle
  }
})

socket.on('connect' , () => {
  console.log('Socket Connected' , castle);
})
export default socket