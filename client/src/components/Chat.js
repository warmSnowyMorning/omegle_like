import React, { useContext, useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom'
import SocketContext from '../context/SocketContext';
import MessagesList from './MessagesList';
import queryString from 'query-string'

const Chat = (props) => {
  const { history, location } = props
  const mySocket = useContext(SocketContext)
  const [messages, set_messages] = useState([])
  const [message, set_message] = useState('')
  const messagesRef = useRef([])


  useEffect(() => {
    const { host, room: roomId, anon: anonId } = queryString.parse(location.search)

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
    mySocket.on('addMessage', ({ message: newMessage }) => {
      console.log('addMessage', newMessage)
      messagesRef.current.push(newMessage)
      console.log(messagesRef.current)
      set_messages([...messagesRef.current])
    })

    mySocket.emit('validateMe', { host }, (err, data) => {
      console.log('validateMe Event')
      if (err) return history.push('/')
      const { messages: allMessages } = data
      set_messages(allMessages)
      messagesRef.current = allMessages
    })

    return () => mySocket.removeAllListeners()
  }, [])

  const sendNewMessage = (e) => {
    e.preventDefault()
    const { host, room: roomId, anon: anonId } = queryString.parse(location.search)

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
