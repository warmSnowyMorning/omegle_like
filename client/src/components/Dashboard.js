import React, { useContext, useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import SocketContext from '../context/SocketContext';
import RoomsList from './RoomsList';
import { v4 as uuid } from 'uuid'

const Dashboard = (props) => {
  const { history } = props
  const mySocket = useContext(SocketContext)
  const [roomName, set_roomName] = useState('')
  const [topic, set_topic] = useState('')
  const [capacity, set_capacity] = useState('')
  const [rooms, set_rooms] = useState([])

  useEffect(() => {
    mySocket.on('updateRoomsList', ({ rooms: newRooms }) => {
      console.log('some update')
      set_rooms(Object.entries(newRooms))
    })
    mySocket.emit('getRooms', (err, { rooms: allRooms }) => {
      if (err) return console.log(err)
      console.log(allRooms, err)
      set_rooms(Object.entries(allRooms))
    })
  }, [])

  const handleRoomCreate = (e) => {
    e.preventDefault()
    // console.log(props.history.push('/chat'))
    // handleRoomCreate
    mySocket.emit('createRoom', {
      roomName,
      roomId: uuid(),
      topic,
      capacity
    }, (err, res) => {
      if (err) return console.log('error')
      console.log(res, 'success')

      history.push(`/chat/${mySocket.id}`)
    })
  }

  return (
    <div>
      <form onSubmit={handleRoomCreate}>
        <h1>Create a new room!!!</h1>
        <label>
          Room Name
        <input type='text' value={roomName} onChange={(e) => set_roomName(e.target.value)} />
        </label>
        <label>
          Topic
        <input type='text' value={topic} onChange={(e) => set_topic(e.target.value)} />
        </label>
        <label>
          max capacityu
        <input type='number' value={capacity} onChange={(e) => set_capacity(e.target.value)} />
        </label>
        <button type='submit'>Create!</button>
      </form>
      <button onClick={() => console.log(props)}>click</button>
      <RoomsList rooms={rooms} />
    </div>
  );
}

export default Dashboard;
