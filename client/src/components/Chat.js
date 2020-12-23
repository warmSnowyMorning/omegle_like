import React, { useContext, useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom'
import SocketContext from '../context/SocketContext';
import MessagesList from './MessagesList';
import queryString from 'query-string'
import TypersList from './TypersList';

const Chat = (props) => {
  const { history, location } = props
  const mySocket = useContext(SocketContext)
  const [messages, set_messages] = useState([])
  const [message, set_message] = useState('')
  const [users, set_users] = useState([])
  const typingRef = useRef(false)
  const timeoutRef = useRef(null)

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
      set_messages(prevMessages => prevMessages.concat(newMessage))
    })

    mySocket.on('toggleUser', ({ users }) => {
      console.log('togglingUserTyping', users)
      set_users(users)
    })

    mySocket.emit('validateMe', { host }, (err, data) => {
      console.log('validateMe Event')
      if (err) return history.push('/')
      const { roomInfo: { messages: allMessages, users } } = data
      console.log(users)
      set_users(users)
      set_messages(allMessages)
    })

    return () => mySocket.removeAllListeners()
  }, [])

  const sendNewMessage = (e) => {
    const { host, room: roomId, anon: anonId } = queryString.parse(location.search)
    const payload = { host, userId: mySocket.id, roomId }
    // e.preventDefault()
    clearTimeout(timeoutRef.current)
    if (!typingRef.current && e.key !== 'Enter') {
      mySocket.emit('toggleTyping', payload)
      typingRef.current = true
    }

    timeoutRef.current = setTimeout(() => {
      if (typingRef.current) {
        mySocket.emit('toggleTyping', payload)
        typingRef.current = false
        timeoutRef.current = null
      }
    }, 500)

    if (e.key === 'Enter') {
      //toggle typing off here
      mySocket.emit('newMessage', { anonId, roomId, message, timestamp: new Date().valueOf(), host }, (err, data) => {
        if (err) return console.log(err)
        set_message('')
      })

      if (typingRef.current) {
        mySocket.emit('toggleTyping', payload)
        typingRef.current = false
        timeoutRef.current = null
      }
    }
  }
  return (
    <div>
      <MessagesList messages={messages} />
      <TypersList users={users} />
      <input
        type='text'
        onChange={e => set_message(e.target.value)}
        value={message}
        onKeyPress={sendNewMessage}
        placeholder='type and press Enter to send!'
      />

    </div>
  );
}

export default withRouter(Chat);
