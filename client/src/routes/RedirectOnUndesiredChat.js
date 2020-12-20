import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
import SocketContext from '../context/SocketContext';

const RedirectOnUndesiredChat = ({ component, ...rest }) => {
  const mySocket = useContext(SocketContext)

  return (
    <Route component={() => {


    }} />
  );
}

export default RedirectOnUndesiredChat;
