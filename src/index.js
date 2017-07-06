import React from 'react';
import ReactDOM from 'react-dom';
import widgetConfig from './chatWidgetParams.json';
import App from './App';

ReactDOM.render(<App config={widgetConfig}/>, document.getElementById('container'));

//const app = document.createElement("div",{"id":"app"});
//ReactDOM.render(<Widget/>, app);
// eslint-disable-next-line