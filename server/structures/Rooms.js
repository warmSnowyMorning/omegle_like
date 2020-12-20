class Rooms {
  constructor() {
    this.rooms = {}
    this.userLocation = {}
  }

  roomJoinable(host) {
    return this.rooms[host].users.length < this.rooms[host].capacity ? true : false
  }

  joinRoom(user, host, newVisitedUsersCt) {
    const roomStatus = this.roomJoinable(host)

    if (!roomStatus) return roomStatus
    this.userLocation[host] = room

    this.rooms[host].users.push(user)
    const anonId = ++this.rooms[host].visitedUsers

    return {
      rooms: this.rooms,
      anonId
    }
  }

  leaveRoom(user, roomDel = false) {

    const theirRoom = this.userLocation[user]
    delete this.userLocation[user]
    if (roomDel) return

    const idxToSplice = this.rooms[theirRoom].users.findIndex((someUser) => someUser === user)

    rooms[theirRoom].users.splice(idxToSplice, 1)

    return this.rooms
  }

  userHasRoom(user) {
    return !!this.rooms[user]
  }

  createRoom(creator, { roomName, topic, capacity, roomId, visitedUsers }) {
    this.rooms[creator] = {
      messages: [],
      roomId,
      roomName,
      creator,
      topic,
      visitedUsers,
      users: [creator],
      capacity
    }

    this.userLocation[creator] = creator
    return {
      rooms: this.rooms,
      anonId: 1
    }
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