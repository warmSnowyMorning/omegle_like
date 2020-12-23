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

  // 0 means for everyone
  const [messageTarget, set_messageTarget] = useState(0)

  useEffect(() => {
    const { host, room: roomId, anon: anonId } = queryString.parse(location.search)

    mySocket.on('leaveRoom', (data) => {
      console.log(data)
      history.push('/')
      console.log('LEAVEROOM EVERYONE')
    })
    // mySocket.on('someoneLeft', (data) => {
    //   console.log(`user with the id of ${data.anonId} just left!`)
    // })
    // mySocket.on('sucessUserJoin', (data) => {
    //   console.log(data.anonId, ' has just joined your room!!!')
    // })
    mySocket.on('addMessage', ({ message: newMessage }) => {
      console.log(newMessage, 'addmessage new messagw')
      const { type, message, userId: user, anonId } = newMessage
      if (type === 'ADMIN') {
        const userObj = {
          anonId,
          user,
          typing: false
        }
        if (message.includes('connected')) {
          set_users((prevUsers) => prevUsers.concat(userObj))
        } else if (message.includes('left')) {
          set_messageTarget((prevMsgTarget) => {
            return prevMsgTarget == userObj.anonId ? 0 : prevMsgTarget
          })
          set_users((prevUsers) => prevUsers.filter(({ anonId: someAnonId }) => someAnonId !== userObj.anonId))
        }
      }

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

  //enter typing mode; it doesn't end for 500 milliseconds unless it has already ended.  only way it can end b4 the timer is if the user explicitly submits.
  const sendNewMessage = (e) => {
    const { host, room: roomId, anon: anonId } = queryString.parse(location.search)
    const toggleTypingPayload = { host, userId: mySocket.id, roomId }
    const newMessagePayload = { anonId, roomId, message, timestamp: new Date().valueOf(), host }

    if (parseInt(messageTarget, 10) > 0) {
      const targetUser = users.find(({ anonId: someAnonId }) => someAnonId == messageTarget)
      console.log(targetUser, 'messageTargetThingie')

      toggleTypingPayload['targetUser'] = targetUser
      newMessagePayload['targetUser'] = targetUser
    }

    // e.preventDefault()
    clearTimeout(timeoutRef.current)
    if (!typingRef.current && e.key !== 'Enter') {
      mySocket.emit('toggleTyping', toggleTypingPayload)
      typingRef.current = true
    }

    timeoutRef.current = setTimeout(() => {
      if (typingRef.current) {
        mySocket.emit('toggleTyping', toggleTypingPayload)
        typingRef.current = false
        timeoutRef.current = null
      }
    }, 500)

    if (e.key === 'Enter') {
      //toggle typing off here
      mySocket.emit('newMessage', newMessagePayload, (err, data) => {
        if (err) return console.log(err)
        set_message('')
      })

      if (typingRef.current) {
        mySocket.emit('toggleTyping', toggleTypingPayload)
        typingRef.current = false
        timeoutRef.current = null
      }
    }
  }

  const handleMessageTargetChange = (e) => {
    console.log(typeof e.target.value)
    set_messageTarget(e.target.value)
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

      <select value={messageTarget} onChange={handleMessageTargetChange}>
        {users.concat({ anonId: 0, user: 0 }).map(({ user, anonId }, idx) => <option value={anonId} key={anonId}>{anonId > 0 ? `Stranger ${anonId}` : 'Everyone!!'}</option>)}
      </select>
    </div>
  );
}

export default withRouter(Chat);
