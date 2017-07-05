import React, { Component } from 'react';
import { observer, inject} from 'mobx-react';
import $ from 'jquery';
import './style.css';
import Conversation from './Conversation.jsx';
import Input from './Input.jsx';

import DevTools from 'mobx-react-devtools';


@inject("chatStore")
@observer
export default class Chat extends Component {

	store = this.props.chatStore

	handleSubmit = (event) => {
		event.preventDefault();
		let messageinput = event.target.message;
		let value = messageinput.value;
		//test
		if (value==="bye") 
		{
			this.store.stopPolling(); 
			this.store.disconnect(); 
			return;
		}
		
		this.store.sendMessage({sender:2, message: value});
		
		let messages = this.store.messages;					
		this.setState({messages: messages, cnt: this.store.messagesCount });
		messageinput.value = "";	
	}
	
	scrollWindow() {
		let windowHeight = $('.Messages').height();
		$(".container").animate({scrollTop : ($(".container")[0].scrollHeight)}, windowHeight);
	}


	componentWillUpdate = (nextProps, nextState) => {
		this.scrollWindow();
	}

	componentWillUnmount = () => {
		this.store.disconnect();
	}
	

    render() {		
        return (		
          <div className='App'>
			    <DevTools/>
       
				<Conversation messages={this.store.messages} participants={this.store.participants} lang={this.props.lang}/>
				<Input onSubmit={this.handleSubmit} />
			</div>
        );
    }
}

