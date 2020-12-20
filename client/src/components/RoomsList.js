import React from 'react';
import RoomsListItem from './RoomsListItem';

const RoomsList = (props) => {
  const { rooms } = props


  return (
    <div>
      {rooms.map(([roomId, roomInfo]) => <RoomsListItem roomInfo={roomInfo} key={roomId} />)}
      <button onClick={() => console.log(props)}>click me</button>
    </div>
  );
}

export default RoomsList;
