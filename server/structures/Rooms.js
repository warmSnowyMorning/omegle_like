class Rooms {
  constructor() {
    this.rooms = {}
    this.userLocation = {}
  }

  roomJoinable(host) {
    return this.rooms[host].users.length < this.rooms[host].capacity ? true : false
  }

  joinRoom(user, host, cb) {
    const roomStatus = this.roomJoinable(host)

    if (!roomStatus) return cb(true)
    this.userLocation[host] = room

    const anonId = ++this.rooms[host].visitedUsers
    this.rooms[host].users.push({ user, anonId })

    cb(null, {
      rooms: this.rooms,
      anonId
    })
  }

  leaveRoom(user, roomDel = false) {

    const theirRoom = this.userLocation[user]
    delete this.userLocation[user]
    if (roomDel) return

    const idxToSplice = this.rooms[theirRoom].users.findIndex((someUser) => someUser.user === user)

    rooms[theirRoom].users.splice(idxToSplice, 1)

    return this.rooms
  }

  userIsHost(user) {
    return !!this.rooms[user]
  }

  findUsersAnonId(user) {
    const theirRoom = this.currentRoom(user)
    if (!theirRoom) return false

    return users[theirRoom].users.find(userInfo => userInfo.user === user).anonId

  }
  createRoom(creator, { roomName, topic, capacity, roomId, visitedUsers }) {
    const anonId = 1
    this.rooms[creator] = {
      messages: [],
      roomId,
      roomName,
      host: creator,
      topic,
      visitedUsers,
      users: [{ user: creator, anonId }],
      capacity
    }

    this.userLocation[creator] = creator
    return {
      rooms: this.rooms,
      anonId: 1
    }
  }
  currentRoom(user) {
    return this.userLocation[user]
  }
  findTheirRoomId(user) {
    const theirHost = this.userLocation[user]
    return this.rooms[theirHost].roomId

  }
  deleteRoom(creator) {
    const room = this.rooms[creator]
    for (const user in room.users) {
      delete this.userLocation[user]
    }

    delete this.rooms[creator]

    return this.rooms
  }
}

module.exports = Rooms