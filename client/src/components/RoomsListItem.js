import React, { useContext } from 'react';
import SocketContext from '../context/SocketContext';
import { withRouter } from 'react-router-dom'
import generateChatUrl from '../utils/generateChatUrl';

const RoomsListItem = (props) => {
  const { history } = props
  const { host, roomName, roomId, users, capacity, ...rest } = props.roomInfo
  const mySocket = useContext(SocketContext)
  const handleRoomJoin = (e) => {
    e.preventDefault()
    mySocket.emit('joinRoom', { host, roomId }, (err, data) => {
      console.log(props)
      if (err) return console.log(err)
      const { anonId } = data
      history.push(generateChatUrl(host, roomId, anonId))
    })
  }
  return (
    <div style={{ border: '1px solid red' }}>
      <h1>{roomName}</h1>
      <button onClick={handleRoomJoin} disabled={!(users.length < capacity)}>Join</button>
      <pre>{JSON.stringify(props.roomInfo, null, 2)}</pre>
    </div>
  )
}

export default withRouter(RoomsListItem);
