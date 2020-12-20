import React from 'react';

const RoomsList = (props) => {
  const { rooms } = props

  return (
    <div>
      {rooms.map(([roomId, { roomName }]) => (
        <div key={roomId}>
          <h1>{roomName}</h1>
        </div>
      ))}
    </div>
  );
}

export default RoomsList;
