const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const RoomsClass = require('./structures/Rooms')
const Rooms = new RoomsClass()
const app = express();
const path = require('path')
const generateMessage = require('./utils/generateMessage')

const server = http.createServer(app)
const io = socketio(server)

io.on('connect', socket => {
  console.log('new connection!', socket.id)

  socket.on('createRoom', (roomInfo, ack) => {
    const { roomId } = roomInfo
    const { rooms, anonId } = Rooms.createRoom(socket.id, roomInfo)
    socket.join(roomInfo.roomId)
    const newMessage = generateMessage(`Stranger ${anonId} has just connected!`, new Date().valueOf(), socket.id, anonId, roomId, socket.id, 'ADMIN')
    Rooms.addMessage(socket.id, newMessage)

    socket.broadcast.emit('updateRoomsList', { rooms })

    ack(null, {
      anonId,
      rooms
    })
  })
  socket.on('joinRoom', ({ host, roomId }, ack) => {
    Rooms.joinRoom(socket.id, host, (err, data) => {
      if (err) return ack(err)

      const { anonId, rooms } = data
      console.log(Rooms.rooms)
      // socket.broadcast.to(roomId).emit('sucessUserJoin', data)
      const newMessage = generateMessage(`Stranger ${anonId} has just connected!`, new Date().valueOf(), socket.id, anonId, roomId, host, 'ADMIN')
      Rooms.addMessage(host, newMessage)

      socket.broadcast.to(roomId).emit('addMessage', { message: newMessage })
      io.emit('updateRoomsList', { rooms })
      socket.join(roomId)
      ack(null, data)
    })
  })
  socket.on('getRooms', (ack) => {
    console.log(Rooms.rooms)
    ack(null, { rooms: Rooms.rooms })
  })
  socket.on('validateMe', ({ host }, ack) => {
    if (Rooms.validateUser(socket.id, host)) return ack(null, { roomInfo: Rooms.getRoom(host) })
    console.log('hello')
    ack('error error')

  })

  socket.on('newMessage', (data, ack) => {
    const { anonId, roomId, message, timestamp, host, targetUser } = data
    console.log(data)

    if (!targetUser) {
      const newMessage = generateMessage(message, timestamp, socket.id, anonId, roomId, host, 'USER')
      Rooms.addMessage(host, newMessage)
      io.to(roomId).emit('addMessage', { message: newMessage })
    } else {
      const newMessage = generateMessage(message, timestamp, socket.id, anonId, roomId, host, 'PEER')
      newMessage.targetUser = targetUser
      io.to(socket.id).to(targetUser.user).emit('addMessage', { message: newMessage })
    }
    ack(null)
  })

  socket.on('toggleTyping', ({ host, userId, roomId, targetUser }) => {
    if (!targetUser) {
      const users = Rooms.toggleTyping(host, userId)
      io.to(roomId).emit('toggleUser', { users })
    } else {
      const users = Rooms.toggleTyping(host, userId, targetUser)
      io.to(socket.id).to(targetUser.user).emit('toggleUser', { users })
    }
  })
  socket.on('disconnect', () => {
    console.log('user has left', socket.id)

    const currentRoom = Rooms.currentRoom(socket.id)
    console.log(currentRoom)
    if (!currentRoom) return

    const wasHost = Rooms.userIsHost(socket.id)
    const roomId = Rooms.findTheirRoomId(socket.id)
    const anonId = Rooms.findUsersAnonId(socket.id)
    const rooms = wasHost ? Rooms.deleteRoom(socket.id) : Rooms.leaveRoom(socket.id)
    //potentially loop through room users and have them all leave; then send an emit for everyone to update their dashboard rooms
    console.log(anonId, wasHost)

    const payload = { anonId, rooms }
    if (wasHost) {
      console.log(Rooms.rooms, 'hostDeleting his Room', roomId)
      socket.broadcast.to(roomId).emit('leaveRoom', payload)
    } else {
      const newMessage = generateMessage(`Stranger ${anonId} has just left!`, new Date().valueOf(), null, anonId, roomId, currentRoom, 'ADMIN')
      socket.broadcast.to(roomId).emit('addMessage', {
        message: newMessage
      })
      Rooms.addMessage(currentRoom, newMessage)
    }
    socket.broadcast.emit('updateRoomsList', { rooms })


  })
})

app.use(express.static(path.resolve('public')))
app.get('*', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

module.exports = server