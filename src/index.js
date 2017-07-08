import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
ReactDOM.render(<App/>, document.getElementById('nrcwv1'))
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render( <NextApp/>, document.getElementById('nrcwv1')
    );
  });
}
registerServiceWorker();
