import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// // Check for browser support of service worker
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('service-worker.js')
//   .then(function(registration) {
//     // Successful registration
//     console.log('Service worker Registration successful, scope is:', registration.scope);
//   }).catch(function(err) {
//     // Failed registration, service worker won’t be installed
//     console.log('Whoops. Service worker registration failed, error:', err);
//   });
// }

ReactDOM.render(<App/>, document.getElementById('nrcwv1'));
registerServiceWorker();

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render( <NextApp/>, document.getElementById('nrcwv1')
    );
  });
}
