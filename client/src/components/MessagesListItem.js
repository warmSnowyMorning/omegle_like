import React from 'react';


//if returned userId is the same as mySocket.id then for the admin messages, override how they're written.
const MessagesListItem = (props) => {
  const { message } = props

  return (
    <div style={{ border: '1px solid blue' }}>
      <pre>
        {JSON.stringify(message, null, 2)}
      </pre>
    </div>
  );
}

export default MessagesListItem;
