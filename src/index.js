import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';
import $ from 'jquery';

import config from './config.json';

function getConfig(config) {
    let lang = (navigator.language || navigator.userLanguage || "en")
        .trim()
        .substring(0, 2);
    console.log("starting chat nav language = ", lang);
    return config[lang];
}

class Widget extends React.Component {
    constructor(props) {
        super(props);
        this.state = { widgetActive: false };
    }
    tooggle = () => {
        this.setState((prevState) => { return {widgetActive: !prevState.widgetActive }});
        $("#panel").toggle();
    }
    render() {
        return (
            <div id="root">
                <button onClick={this.tooggle}>Click Me</button>
                <div id="panel" ref="panel" hidden>
                    <App config={this.props.config} active={this.state.widgetActive}/>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Widget config={getConfig(config)}/>, document.getElementById('app'));
// ReactDOM.render(<App config={getConfig(config)}/>, document.getElementById('app'));

// document.getElementById('app')); registerServiceWorker();