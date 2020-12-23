import React from 'react';
import TypersListItem from './TypersListItem';

const TypersList = (props) => {
  const { users } = props
  return (
    <div>
      {users.filter(user => user.typing).map(user => <TypersListItem user={user} key={user.user} />)}
    </div>
  );
}

export default TypersList;
