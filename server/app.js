const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const Rooms = require('./structures/Rooms')
const app = express();
const path = require('path')

const server = http.createServer(app)
const io = socketio(server)

io.on('connect', socket => {
  console.log('new connection!', socket.id)

  socket.on('createRoom', (roomInfo, ack) => {

    Rooms.create(socket.id, roomInfo)
    socket.join()
    socket.broadcast.emit('updateRoomsList', rooms)

    ack(null, 'wassup doc')
  })


  socket.on('disconnect', () => {
    console.log('user has left', socket.id)
    //if user is a room owner, dc everyone from that room and then delete; naturally it will handle room owner too.

  })
})

app.use(express.static(path.resolve('public')))
app.get('*', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

module.exports = server