import React, { useContext, useEffect, useRef } from 'react';
import SocketContext from '../context/SocketContext';
import MessagesListItem from './MessagesListItem';

const MessagesList = (props) => {
  const { messages } = props
  const mySocket = useContext(SocketContext)
  const scrollHelperRef = useRef(null)
  useEffect(() => {
    scrollHelperRef.current.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div style={{ height: '90vh', overflow: 'scroll' }}>
      {messages.map((messageInfo) => {
        //{userId === mySocket.id && type === 'ADMIN' ? content.includes('left') ? 'You\'ve just left this room!' : 'You\'ve just joined this room' : type === 'ADMIN' ? content : userId === mySocket.id ? `You: ${content}` : `Stranger ${anonId}: ${content}`}
        const { type, host, roomId, anonId, userId, timestamp, message: content, targetUser } = messageInfo
        let modifiedMsg = ''
        if (userId === mySocket.id && type === 'ADMIN') {
          modifiedMsg = content.includes('left') ? 'You\'ve just left this room!' : 'You\'ve just joined this room'
        } else if (type === 'ADMIN') {
          modifiedMsg = content
        }
        if (type === 'USER') {
          modifiedMsg = userId === mySocket.id ? `You: ${content}` : `Stranger ${anonId}: ${content}`
        }

        if (type === 'PEER') {
          const { user: otherUser, anonId: otherAnonId } = targetUser
          if (userId === mySocket.id) modifiedMsg = `You to Stranger ${otherAnonId}: ${content}`
          if (mySocket.id === otherUser) modifiedMsg = `Stranger ${anonId} to You: ${content}`
        }

        return { ...messageInfo, message: modifiedMsg }
      }).map((message, idx) => <MessagesListItem message={message} key={idx} />)}
      <div ref={scrollHelperRef} ></div>
    </div>
  );
}

export default MessagesList;
