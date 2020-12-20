import React, { useContext } from 'react';
import SocketContext from '../context/SocketContext';

const RoomsListItem = (props) => {
  const { host, roomName, ...rest } = props.roomInfo
  const mySocket = useContext(SocketContext)

  const handleRoomJoin = (e) => {
    e.preventDefault()
    mySocket.emit('joinRoom', { host }, (err, data) => {
      if (err) return console.log(err)
      console.log(data)
    })
  }
  return (
    <div style={{ border: '1px solid red' }}>
      <h1>{roomName}</h1>
      <button onClick={handleRoomJoin}>Join</button>
      <pre>{JSON.stringify(props.roomInfo, null, 2)}</pre>
    </div>
  )
}

export default RoomsListItem;
