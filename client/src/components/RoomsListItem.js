import React, { useContext } from 'react';
import SocketContext from '../context/SocketContext';
import { withRouter } from 'react-router-dom'
import generateChatUrl from '../utils/generateChatUrl';

const RoomsListItem = (props) => {
  const { history } = props
  const { host, roomName, roomId, users, capacity, topic, ...rest } = props.roomInfo
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
    <div style={{ border: '1px solid red', marginBottom: '10px' }}>
      <h1>Room name: {roomName}</h1>
      <h1>Room topic: {topic}</h1>
      <h1>capacity: {`${users.length}/${capacity}`}</h1>
      <button onClick={handleRoomJoin} disabled={!(users.length < capacity)}>Join</button>
    </div>
  )
}

export default withRouter(RoomsListItem);
