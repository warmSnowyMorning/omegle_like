import React from 'react';

const MessagesListItem = (props) => {
  const { message } = props

  return (
    <div>
      <pre>
        {JSON.stringify(message, null, 2)}
      </pre>
    </div>
  );
}

export default MessagesListItem;
