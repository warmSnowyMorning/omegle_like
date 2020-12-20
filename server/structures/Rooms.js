class Rooms {
  constructor() {
    this.rooms = {}
    this.userLocation = {}
  }

  joinRoom(user, room) {
    this.userLocation[user] = room
  }

  leaveRoom(user, roomDel = false) {
    delete this.userLocation[user]
    if (roomDel) return

    const theirRoom = this.userLocation[user]

    const idxToSplice = this.rooms[theirRoom].users.findIndex((someUser) => someUser === user)

    rooms[theirRoom].users.splice(idxToSplice, 1)
  }

  userHasRoom(user) {
    return !!this.rooms[user]
  }

  createRoom(creator, { roomName, topic, capacity }) {
    this.rooms[creator] = {
      messages: [],
      roomName,
      topic,
      users: [creator],
      capacity
    }

    this.userLocation[creator] = creator
  }
  deleteRoom(creator) {
    const room = this.rooms[socket.id]
    for (const user in room.users) {
      delete this.userLocation[user]
    }

    delete this.rooms[creator]

  }
}