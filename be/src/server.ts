import app from './app'
import http from 'http'
import initServer from 'utils/initServer';
const server = http.createServer(app)
server.listen(Config.PORT, async () => {
  console.log(`Server listen on ${Config.PORT}`);
  console.log(`Start init server`);
  await initServer()
  console.log('Inited server');

})
export default server