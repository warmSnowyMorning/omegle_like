import React from 'react';
import MessagesListItem from './MessagesListItem';

const MessagesList = (props) => {
  const { messages } = props

  return (
    <div>
      {messages.map((message, idx) => <MessagesListItem message={message} key={idx} />)}
    </div>
  );
}

export default MessagesList;
