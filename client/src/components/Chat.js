import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom'
import SocketContext from '../context/SocketContext';
import MessagesList from './MessagesList';
import queryString from 'query-string'

const Chat = (props) => {
  const { history, location } = props
  const mySocket = useContext(SocketContext)
  const [messages, set_messages] = useState([])
  const { host, room: roomId, anon: anonId } = queryString.parse(location.search)
  const [message, set_message] = useState('')

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
    mySocket.on('newMessage', ({ message }) => {
      set_messages(messages.concat(message))
    })

    mySocket.emit('validateMe', { host }, (err, { messages: allMessages }) => {
      if (err) return history.push('/')
      set_messages(allMessages)
    })

    return () => mySocket.removeAllListeners()
  }, [])

  const sendNewMessage = (e) => {
    mySocket.emit('newMessage', { anonId, roomId, message, timestamp: new Date().valueOf(), host }, (err, data) => {
      if (err) return console.log(err)
      set_message('')
    })
  }
  return (
    <div>
      <MessagesList messages={messages} />

      <input
        type='text'
        onChange={e => set_message(e.target.value)}
        value={message}
        onKeyPress={e => e.key === 'Enter' && sendNewMessage(e)}
        placeholder='type and press Enter to send!'
      />
    </div>
  );
}

export default withRouter(Chat);
