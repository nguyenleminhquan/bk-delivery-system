import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store'
import Styles from './styles';
import socketIO from 'socket.io-client';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
const envConfig = require('./config/.env.json')

const socket = socketIO.connect(envConfig.baseURL);
console.log('socket', socket)
export const SocketContext = React.createContext();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Styles>
      <SocketContext.Provider value={socket}>
        <PayPalScriptProvider options={{ "client-id": `${process.env.REACT_APP_PAYPAL_ID}` }}>
          <App />
        </PayPalScriptProvider>
      </SocketContext.Provider>
    </Styles>
  </Provider>
);
