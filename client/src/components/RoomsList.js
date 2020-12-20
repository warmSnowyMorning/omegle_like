import React from 'react';
import RoomsListItem from './RoomsListItem';

const RoomsList = (props) => {
  const { rooms } = props


  return (
    <div>
      {rooms.map(([roomId, roomInfo]) => <RoomsListItem roomInfo={roomInfo} key={roomId} />)}
    </div>
  );
}

export default RoomsList;
