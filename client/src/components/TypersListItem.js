import React from 'react';

const TypersListItem = (props) => {
  const { user: { anonId } } = props
  return (
    <div>
      Stranger {anonId} is typing!
    </div>
  );
}

export default TypersListItem;
