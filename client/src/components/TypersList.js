import React, { useContext } from 'react';
import SocketContext from '../context/SocketContext';
import TypersListItem from './TypersListItem';

const TypersList = (props) => {
  const { users } = props
  const mySocket = useContext(SocketContext)
  return (
    <div>
      {users.filter(user => user.typing && user.user !== mySocket.id).map(user => <TypersListItem user={user} key={user.user} />)}
    </div>
  );
}

export default TypersList;
