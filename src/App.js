import React, { Component } from 'react';
import {Provider} from 'mobx-react';
import injectTapEventPlugin from 'react-tap-event-plugin';
//import DevTools from 'mobx-react-devtools'; //dev-only
import Widget from './Components/Widget.jsx';
import ChatStore from './Stores/ChatStore';

injectTapEventPlugin();

class App extends Component {
  store = new ChatStore(this.props.config);
  getLanguage = () => {
   return (this.props.config.WebSiteInfo.Language || navigator.language || "en").trim().substring(0,2);
  }
  render() {
    
    return ( 
      <div>
       

       <Provider chatStore={this.store}>      
          <Widget config={this.props.config} lang={this.getLanguage()}/>  
       </Provider>       
       
       </div>
    );
  }
}

export default App;
