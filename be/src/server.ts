import app from './app'
import http from 'http'
const server = http.createServer(app)
server.listen(Config.PORT , () => {
  console.log(`Server listen on ${Config.PORT}`);
})
export default server