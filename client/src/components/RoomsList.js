import React, { useContext } from 'react';
import SocketContext from '../context/SocketContext';

const RoomsList = (props) => {
  const { rooms } = props
  const mySocket = useContext(SocketContext)

  const handleRoomJoin = (e) => {
    e.preventDefault()
    mySocket.emit('joinRoom', (err, data) => {
      if (err) return console.log(err)
      console.log(data)
    })
  }

  return (
    <div>
      {rooms.map(([roomId, roomInfo]) => {
        const { roomName, ...rest } = roomInfo

        return (
          <div key={roomId} style={{ border: '1px solid red' }}>
            <h1>{roomName}</h1>
            <button onClick={handleRoomJoin}>Join</button>
            <pre>{JSON.stringify(roomInfo, null, 2)}</pre>
          </div>
        )
      })}
    </div>
  );
}

export default RoomsList;
