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
    this.userLocation[user] = host

    this.rooms[host].visitedUsers += 1
    const anonId = this.rooms[host].visitedUsers
    this.rooms[host].users.push({ user, anonId, typing: false })
    console.log(this.userLocation)
    cb(null, {
      rooms: this.rooms,
      anonId
    })
  }

  addMessage(host, message) {
    this.rooms[host].messages.push(message)
  }
  toggleTyping(host, user) {
    const ourUser = this.rooms[host].users.find((someUser) => someUser.user === user)
    ourUser.typing = !ourUser.typing

    return this.rooms[host].users
  }

  leaveRoom(user, roomDel = false) {

    const theirRoom = this.userLocation[user]
    delete this.userLocation[user]
    if (roomDel) return

    const idxToSplice = this.rooms[theirRoom].users.findIndex((someUser) => someUser.user === user)

    this.rooms[theirRoom].users.splice(idxToSplice, 1)

    return this.rooms
  }

  userIsHost(user) {
    return !!this.rooms[user]
  }

  findUsersAnonId(user) {
    const theirRoom = this.currentRoom(user)
    if (!theirRoom) return false

    return this.rooms[theirRoom].users.find(userInfo => userInfo.user === user).anonId

  }
  getMessages(host) {
    return this.rooms[host].messages
  }
  createRoom(creator, { roomName, topic, capacity, roomId }) {
    const anonId = 1
    this.rooms[creator] = {
      messages: [],
      roomId,
      roomName,
      host: creator,
      topic,
      visitedUsers: anonId,
      users: [{ user: creator, anonId, typing: false }],
      capacity
    }
    console.log(this.rooms, 'all rooms after creating new one')
    this.userLocation[creator] = creator
    return {
      rooms: this.rooms,
      anonId
    }
  }
  currentRoom(user) {
    return this.userLocation[user]
  }
  findTheirRoomId(user) {
    const theirHost = this.userLocation[user]
    console.log(theirHost)
    return this.rooms[theirHost].roomId

  }

  getRoom(host) {
    return this.rooms[host]
  }
  validateUser(user, host) {
    return this.userLocation[user] === host ? true : false
  }
  deleteRoom(creator) {
    const room = this.rooms[creator]
    for (const { user } of room.users) {
      delete this.userLocation[user]
    }

    delete this.rooms[creator]

    return this.rooms
  }
}

module.exports = Rooms