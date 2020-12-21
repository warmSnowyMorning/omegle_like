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
    socket.broadcast.emit('updateRoomsList', { rooms })

    ack(null, {
      anonId,
      rooms
    })
  })
  socket.on('joinRoom', ({ host, roomId }, ack) => {
    Rooms.joinRoom(socket.id, host, (err, data) => {
      if (err) return ack(err)
      console.log(Rooms.rooms)

      socket.join(roomId)
      ack(null, data)
    })
  })
  socket.on('getRooms', (ack) => {
    console.log(Rooms.rooms)
    ack(null, { rooms: Rooms.rooms })
  })

  socket.on('disconnect', () => {
    console.log('user has left', socket.id)

    if (!Rooms.currentRoom(socket.id)) return

    const wasHost = Rooms.userIsHost(socket.id)
    const roomId = Rooms.findTheirRoomId(socket.id)
    const anonId = Rooms.findUsersAnonId(socket.id)
    const rooms = wasHost ? Rooms.deleteRoom(socket.id) : Rooms.leaveRoom(socket.id)
    //potentially loop through room users and have them all leave; then send an emit for everyone to update their dashboard rooms
    console.log(anonId, wasHost)
    if (wasHost) {
      console.log(Rooms.rooms, 'hostDeleting his Room', roomId)
      io.to(roomId).emit('leaveRoom', { anonId, rooms })
    } else {
      io.to(roomId).emit('leaveRoom', { anonId, rooms })
    }

    // socket.broadcast.emit('updateRoomsList', rooms)
  })
})

app.use(express.static(path.resolve('public')))
app.get('*', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

module.exports = server