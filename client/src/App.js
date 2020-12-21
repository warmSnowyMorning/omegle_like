import React, { useEffect, useState } from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import io from 'socket.io-client'
import SocketContext from './context/SocketContext'
import Chat from './components/Chat'


export default () => {
  const [mySocket, set_mySocket] = useState(null)
  useEffect(() => {
    const socket = io('http://localhost:5000', { transports: ['websocket'] });
    socket.on('connect', () => {
      setTimeout(() => {
        set_mySocket(socket)
      }, 500);
    })

  }, [])

  return (
    <div>
      {mySocket ? (
        <Router>
          <SocketContext.Provider value={mySocket}>
            <Route path="/" exact component={Dashboard} />
            <Route path="/chat" exact component={Chat} />
          </SocketContext.Provider>

        </Router>
      ) :
        (<h1>Loading</h1>)}
    </div>
  )
}