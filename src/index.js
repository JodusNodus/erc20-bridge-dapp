import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';

import * as serviceWorker from './serviceWorker';

import './index.css';
import App from './App';
import configureStore from './redux/configureStore';

const store = configureStore(window.REDUX_STATE || {}); // If there is state on the server, store will be configured with that, otherwise with empty state.

// Wait for document to load all chunks.
window.onload = () => {
  Loadable.preloadReady().then(() => {
    ReactDOM.hydrate(
      <ReduxProvider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ReduxProvider>,
      document.getElementById('root')
    );
  });
};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
