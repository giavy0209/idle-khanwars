import app from './app'
import http from 'http'
import initServer from 'utils/initServer';
const server = http.createServer(app)
server.listen(Config.PORT, async () => {
  console.log(`Start init server`);
  await initServer()
  console.log('\x1b[32mInited server');
  console.log(`Server listen on \x1b[32m ${Config.PORT}`);

})
export default server