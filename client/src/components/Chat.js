import React, { useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom'
import SocketContext from '../context/SocketContext';

const Chat = (props) => {
  const { history } = props
  const mySocket = useContext(SocketContext)

  useEffect(() => {
    mySocket.on('leaveRoom', ((data) => {
      console.log(data)
      console.log(`user with the id of ${data.anonId} just left!! LEAVEROOM`)
    }))

  }, [])
  return (
    <div>
      chatroom!!!!!
    </div>
  );
}

export default withRouter(Chat);
