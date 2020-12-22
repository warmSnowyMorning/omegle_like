import React, { useContext } from 'react';
import SocketContext from '../context/SocketContext';


//if returned userId is the same as mySocket.id then for the admin messages, override how they're written.
const MessagesListItem = (props) => {
  const mySocket = useContext(SocketContext)
  const { message } = props
  const { type, host, roomId, anonId, userId, timestamp, message: content } = message

  return (
    <div style={{ border: '1px solid blue' }}>



      <pre>
        {JSON.stringify(message, null, 2)}
        <h1>{userId === mySocket.id && type === 'ADMIN' ? content.includes('left') ? 'You\'ve just left this room!' : 'You\'ve just joined this room' : type === 'ADMIN' ? content : userId === mySocket.id ? `You: ${content}` : `Stranger ${anonId}: ${content}`}</h1>
      </pre>
    </div>
  );
}

export default MessagesListItem;
