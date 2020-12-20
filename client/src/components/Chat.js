import React, { useContext, useEffect } from 'react';
import SocketContext from '../context/SocketContext';

const Chat = (props) => {
  const mySocket = useContext(SocketContext)

  const history = props
  console.log(history)
  useEffect(() => {

  }, [])
  return (
    <div>
      chatroom!!!!!
    </div>
  );
}

export default Chat;
