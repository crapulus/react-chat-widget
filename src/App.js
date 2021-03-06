import React, { Component } from 'react';
import {Provider} from 'mobx-react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import DevTools from 'mobx-react-devtools'; //dev-only
import Widget from './Containers/Widget.jsx';
import ChatStore from './Stores/ChatStore';

const chatStore = new ChatStore();

injectTapEventPlugin();

class App extends Component {

  render() { 
    
    return ( 
      <div>
       <Provider chatStore={chatStore}>      
          <Widget />  
       </Provider>         
       
       <DevTools/>
       
       </div>
    );
  }
}

export default App;
