const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const rooms = require('./structures/rooms')
const usersInRooms = require('./structures/usersInRooms')
const app = express();
const path = require('path')

const server = http.createServer(app)
const io = socketio(server)

io.on('connect', socket => {
  console.log('new connection!', socket.id)
  socket.emit('test', { a: 10, b: 20 })

  socket.on('createRoom', ({ roomName, topic, capacity }, ack) => {
    rooms[socket.id] = {
      messages: [],
      roomName,
      topic,
      users: [socket.id],
      capacity
    }

    usersInRooms[socket.id] = socket.id

    console.log(rooms, usersInRooms)
    socket.broadcast.emit('updateRoomsList', rooms)

    ack(null, 'wassup doc')
  })

  socket.on('disconnect', () => {
    console.log('user has left', socket.id)
    if (rooms[socket.id]) {
      delete rooms[socket.id]

      socket.broadcast.emit('updateRoomsList', rooms)
    }
  })
})

app.use(express.static(path.resolve('public')))
app.get('*', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

module.exports = server