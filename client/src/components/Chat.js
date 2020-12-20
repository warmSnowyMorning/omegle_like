import React, { useContext, useEffect } from 'react';
import SocketContext from '../context/SocketContext';

const Chat = (props) => {
  const mySocket = useContext(SocketContext)

  useEffect(() => {


  }, [])
  return (
    <div>
      chatroom!!!!!
    </div>
  );
}

export default Chat;
