import React, { useContext, useEffect } from 'react';
import SocketContext from '../context/SocketContext';

const Chat = (props) => {
  const mySocket = useContext(SocketContext)

  useEffect(() => {
    mySocket.on('someoneLeft', ((data) => {
      console.log(data)
      console.log(`user with the id of ${data.anonId} just left!!`)
    }))
    mySocket.on('leaveRoom', (ack) => {
      console.log('we will leave the room, host deleted it')
      ack(null)
    })

  }, [])
  return (
    <div>
      chatroom!!!!!
    </div>
  );
}

export default Chat;
