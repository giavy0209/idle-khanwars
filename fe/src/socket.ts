import io from 'socket.io-client'
import storage from 'utils/storage'
const socket = io('https://localhros.phamgiavy.com/ws', {
  path : '/ws',
  transports : ['websocket']
})


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

// setInterval(() => {
//   socket.emit('test')
// }, 1000)

socket.on('test', data => {
  console.log({data});
  
})
export default socket