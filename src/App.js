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

  render() { 
    return ( 
      <div>
       <Provider chatStore={chatStore}>      
          <Widget />  
       </Provider>       
       
       </div>
    );
  }
}

export default App;
