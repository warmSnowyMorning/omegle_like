import React, { useContext } from 'react';
import SocketContext from '../context/SocketContext';
import { withRouter } from 'react-router-dom'

const RoomsListItem = (props) => {
  const { history } = props
  const { host, roomName, ...rest } = props.roomInfo
  const mySocket = useContext(SocketContext)

  const handleRoomJoin = (e) => {
    e.preventDefault()
    mySocket.emit('joinRoom', { host }, (err, data) => {
      console.log(props)
      if (err) return console.log(err)
      console.log(data)
      history.push(`/chat/${host}`)
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

export default withRouter(RoomsListItem);
