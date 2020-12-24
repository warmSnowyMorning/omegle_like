import React, { useContext } from 'react';
import SocketContext from '../context/SocketContext';


//if returned userId is the same as mySocket.id then for the admin messages, override how they're written.
const MessagesListItem = (props) => {
  const mySocket = useContext(SocketContext)
  const { message } = props
  const { type, host, roomId, anonId, userId, timestamp, message: content } = message

  return (
    <div style={{ border: '1px solid blue', marginBottom: '20px' }}>



      <h1>{content}</h1>
      {/* <pre>
        {JSON.stringify(message, null, 2)}
      </pre> */}
    </div>
  );
}

export default MessagesListItem;
