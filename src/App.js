import React, { Component } from 'react';
import {Provider} from 'mobx-react';
import injectTapEventPlugin from 'react-tap-event-plugin';
//import DevTools from 'mobx-react-devtools'; //dev-only
import Widget from './Components/Widget.jsx';
import ChatStore from './Stores/ChatStore';

const chatStore = new ChatStore();

injectTapEventPlugin();

class App extends Component {

  componentWillUnmount = () => {
    chatStore.disconnect();
  }

  getLanguage = () => {
   return (this.props.config.WebSiteInfo.Language || navigator.language || "en").trim().substring(0,2);
  }

  getParams = () => {
    return sessionStorage.getItem(this.props.config.CustomerIdentification);
  }

  render() { 
    return ( 
      <div>
       <Provider chatStore={chatStore}>      
          <Widget config={this.props.config} params={this.getParams()} lang={this.getLanguage()}/>  
       </Provider>       
       
       </div>
    );
  }
}

export default App;
