import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App/>, document.getElementById('nrcwv1'));

//const app = document.createElement("div",{"id":"app"});
//ReactDOM.render(<Widget/>, app);
// eslint-disable-next-line

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render( <NextApp/>, document.getElementById('nrcwv1')
    );
  });
}