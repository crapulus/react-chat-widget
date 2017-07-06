import React, { Component } from 'react';
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import SendIcon from 'material-ui/svg-icons/content/send';

import Messages from './Messages.jsx';

export default class Chat extends Component {
	state = { active:false, sendDirect: true, messages: []};
	store = this.props.chatStore;

	activate = (open) => {
		if (!this.state.active && open) 
		{
			this.store.connect();	
			this.setState({
				active:this.store.connected
			});
		}
	}
	cnt = () => {return this.store.messages.length}

	componentWillUpdate = (nextProps, nextState) => {
		if (!this.state.open && nextState.open) this.activate(nextProps.open)
	}

	componentDidMount = () => {
		this.activate();
	}

	handleSubmit = (e) => {
		e.preventDefault();
		let messageinput = document.getElementById("messagetext");
		let value = messageinput.value;
		//test
		if (value==="bye") 
		{
			this.store.stopPolling(); 
			this.store.disconnect(); 
			return;
		}
		
		this.store.sendMessage({sender:2, message: value});			
		//this.setState({messages: this.store.messages, cnt: this.store.messagesCount });
		messageinput.value = "";	
	}
	
	// handleChange = (e, value) => {
	// 	////todo: set typing to true
	// 	//e.preventDefault();
	// 	//console.log(value, e.target, e.target.value);
	// }

	scrollWindow() {
		let messageList = document.getElementById("messageslist");
		//console.log("scrolling", messageList.scrollHeight, messageList.scrollTop, messageList.scrollTopMax);
		if (messageList.childElementCount > 0) messageList.lastChild.scrollIntoView(true);
		//container.animate({scrollTop : (msgl.scrollHeight)}, container.scrollHeight);
	}

	componentDidUpdate = (prevProps, prevState) => {
			this.scrollWindow();
	}

	
	componentWillUnmount = () => {
		this.store.disconnect();
	}
	
    render() {		
        return (		
       <Card style={this.props.style.Chat} expanded={true}>
		   <CardHeader
			   title={this.props.config.HeaderText}
			   subtitle={`Messages: ${this.cnt()}`}
			   avatar={ <Avatar icon={<SendIcon />} color={this.props.style.primaryColor} /> }
		   >  
			</CardHeader>
			<CardText id="container">		
					<Messages messages={this.store.messages}/>
			</CardText>
			
			<CardActions>
				<form onSubmit={this.handleSubmit}>
				<TextField
					id="messagetext"
					hintText="Your Message..."
					onChange={this.onChange}
					fullWidth={true}
					multiLine={!this.state.sendDirect}>
				</TextField>	
				</form>		
			</CardActions>
			
		</Card>
        );
    }
}

