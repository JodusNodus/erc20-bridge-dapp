import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import { StaticRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';

import manifest from '../../build/asset-manifest.json';
import stats from '../../build/react-loadable.json';

// Import main App component.
import App from '../../src/App';

const path = require('path');
const fs = require('fs');

export default store => (req, res, next) => {
  // Point to the html file created by CRA's build tool.
  const filePath = path.resolve(__dirname, '..', '..', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('err', err);
      return res.status(404).end();
    }

    // Render the app as a string.
    // Modules: all the names of the chunks the server used to render the initial state of the app.
    const staticContext = {};
    const modules = [];

    const html = ReactDOMServer.renderToString(
      <Loadable.Capture report={m => modules.push(m)}>
        <ReduxProvider store={store}>
          <StaticRouter location={req.originalUrl} context={staticContext}>
            <App />
          </StaticRouter>
        </ReduxProvider>
      </Loadable.Capture>
    );

    // Get redux state
    const reduxState = JSON.stringify(store.getState());

    // Get all chunks and make them into script tags
    let bundles = getBundles(stats, modules);
    let scripts = bundles
      .map(bundle => {
        return `<script src="/${bundle.file}"></script>`;
      })
      .join('\n');

    return res.send(
      htmlData
        .replace('<div id="root"></div>', `<div id="root">${html}</div>`) // Add react components to public/index.html
        .replace('</body>', scripts + '</body>') // Add chunks to public/index.html
        .replace('"__SERVER_REDUX_STATE__"', reduxState) // Add redux state to placeholder in public/index.html
    );
  });
};
