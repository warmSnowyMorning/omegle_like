import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom'
import SocketContext from '../context/SocketContext';
import MessagesList from './MessagesList';

const Chat = (props) => {
  const { history, location } = props
  const mySocket = useContext(SocketContext)
  const [messages, set_messages] = useState([])

  useEffect(() => {
    mySocket.on('leaveRoom', (data) => {
      console.log(data)
      history.push('/')
      console.log('LEAVEROOM EVERYONE')
    })
    mySocket.on('someoneLeft', (data) => {
      console.log(`user with the id of ${data.anonId} just left!`)
    })
    mySocket.on('sucessUserJoin', (data) => {
      console.log(data.anonId, ' has just joined your room!!!')
    })
    const pathParts = location.pathname.split('/')

    mySocket.emit('validateMe', { host: pathParts[pathParts.length - 1] }, (err, { messages: allMessages }) => {
      if (err) return history.push('/')
      set_messages(allMessages)
    })

    return () => mySocket.removeAllListeners()
  }, [])
  return (
    <div>
      <MessagesList messages={messages} />
    </div>
  );
}

export default withRouter(Chat);
