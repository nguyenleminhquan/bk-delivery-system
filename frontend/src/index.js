import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store'
import Styles from './styles';
import socketIO from 'socket.io-client';

const socket = socketIO.connect('http://localhost:5000');
console.log('socket', socket)
export const SocketContext = React.createContext();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Styles>
      <SocketContext.Provider value={socket}>
        <App />
      </SocketContext.Provider>
    </Styles>
  </Provider>
);
