import React, { Component } from 'react';
import {Provider} from 'mobx-react';
import Chat from './Components/Chat.jsx';
import ChatStore from './Stores/ChatStore';

class App extends Component {

  render() {
    return ( 
       <Provider chatStore={new ChatStore(this.props.config)}>      
       <Chat lang={this.props.config.WebSiteInfo.Language}/>  
       </Provider>
    );
  }
}

export default App;
