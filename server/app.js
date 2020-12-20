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

  socket.on('createRoom', (roomInfo, ack) => {

    console.log(rooms, usersInRooms)
    socket.broadcast.emit('updateRoomsList', rooms)

    ack(null, 'wassup doc')
  })


  socket.on('disconnect', () => {
    console.log('user has left', socket.id)
    //if user is a room owner, dc everyone from that room and then delete; naturally it will handle room owner too.
    if (rooms[socket.id]) {
      const room = rooms[socket.id]
      for (const user in room.users) {
        delete usersInRooms[user]
      }

      delete rooms[socket.id]

      socket.broadcast.emit('updateRoomsList', rooms)
    }

    //if user still is in a room, find their room and mutate it; removing them.
    if (usersInRooms[socket.id]) {
      const theirRoom = usersInRooms[socket.id]

      const idxToSplice = rooms[theirRoom].users.findIndex((user) => user = socket.id)

      rooms[theirRoom].users.splice(idxToSplice, 1)

    }
  })
})

app.use(express.static(path.resolve('public')))
app.get('*', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

module.exports = server