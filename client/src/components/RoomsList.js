import React from 'react';
import RoomsListItem from './RoomsListItem';

const RoomsList = (props) => {
  const { rooms } = props


  return (
    <div>
      {rooms.map(([host, roomInfo]) => <RoomsListItem roomInfo={roomInfo} key={host} />)}
    </div>
  );
}

export default RoomsList;
