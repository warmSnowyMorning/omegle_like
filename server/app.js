const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const RoomsClass = require('./structures/Rooms')
const Rooms = new RoomsClass()
const app = express();
const path = require('path')

const server = http.createServer(app)
const io = socketio(server)

io.on('connect', socket => {
  console.log('new connection!', socket.id)

  socket.on('createRoom', (roomInfo, ack) => {

    const { rooms, anonId } = Rooms.createRoom(socket.id, roomInfo)
    socket.join(roomInfo.roomId)
    socket.broadcast.emit('updateRoomsList', rooms)

    ack(null, {
      anonId,
      rooms
    })
  })


  socket.on('disconnect', () => {
    console.log('user has left', socket.id)

    const rooms = Rooms.userHasRoom(socket.id) ? Rooms.deleteRoom(socket.id) : Rooms.leaveRoom(socket.id)

    socket.broadcast.emit('updateRoomsList', rooms)

  })
})

app.use(express.static(path.resolve('public')))
app.get('*', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

module.exports = server