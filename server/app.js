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
  socket.on('joinRoom', ({ host }, ack) => {
    Rooms.joinRoom(socket.id, host, (err, data) => {
      if (err) return ack(err)
      console.log(Rooms.rooms)
      ack(null, data)
    })
  })

  socket.on('disconnect', () => {
    console.log('user has left', socket.id)

    if (!Rooms.currentRoom(socket.id)) return

    const wasHost = Rooms.userIsHost(socket.id)
    const roomId = Rooms.findTheirRoomId(socket.id)
    const rooms = wasHost ? Rooms.deleteRoom(socket.id) : Rooms.leaveRoom(socket.id)
    const anonId = Rooms.findUsersAnonId(socket.id)

    if (wasHost) {
      socket.broadcast.to(roomId).emit('leaveRoom', (err, data) => {
        if (err) return console.log(err)

        socket.broadcast.emit('updateRoomsList', rooms)
      })
    } else {
      socket.broadcast.to(roomId).emit('someoneLeft', { anonId })
    }

    // socket.broadcast.emit('updateRoomsList', rooms)
  })
})

app.use(express.static(path.resolve('public')))
app.get('*', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

module.exports = server