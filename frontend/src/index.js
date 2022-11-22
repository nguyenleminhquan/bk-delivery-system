import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store'
import { setupInterceptors } from 'services/axios';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store'
import Styles from './styles';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Styles>
      <App />
    </Styles>
  </Provider>
);

setupInterceptors(store)
