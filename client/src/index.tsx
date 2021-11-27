import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import { MoralisProvider } from "react-moralis";

ReactDOM.render(
  <Provider store={store}>
    <MoralisProvider appId={process.env.REACT_APP_MORALIS_APP_ID || ''} serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL || ''}>
      <App />
    </MoralisProvider>
  </Provider>,
  document.getElementById('root')
);