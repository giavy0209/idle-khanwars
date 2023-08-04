const express = require('express')
const cors = require('cors')
const {Server} = require('socket.io')
const app = express()
app.use(cors)
const http = require('http')
const server = http.createServer(app)
const io = new Server(server, {path : '/ws'})

io.on('connection', socket => {
  socket.on('test' , () => {
    socket.emit('test', 'ok')
  })
})


server.listen(3020)