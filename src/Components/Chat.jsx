import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import SendIcon from 'material-ui/svg-icons/content/send';
import Messages from './Messages.jsx';

@observer
export default class Chat extends Component {
	constructor(props) {
		super(props)
		this.state = { connected: false, sendOnEnter: true};
		this.store = props.chatStore;
	}

	activate = (open) => {
		console.log("activating IF open ,state", open, this.state.connected);
		if (!this.state.connected && open) 
		{			
			this.store.connect();
		}
	}

	cnt = () => {return this.store.messages.length || 0}

	componentWillUpdate = (nextProps, nextState) => {
		//console.log("willupdate: open, active, next", this.props.open, this.state.connected, nextProps.open, nextState.connected);
		
		if (nextProps.chatStore.connected) {
			console.log("connected, chatid = " + this.store.chatId);	
			nextState = 
				{
					connected:true
				};
		}
		//active and closing - need to stop polling
		if (!nextProps.open) {
			this.store.stopPolling();
		}
		//active and opening - restart polling
		if (!this.props.open && this.state.connected && nextProps.open) {
			this.store.startPolling();
		}
		//inactive and opening - connect + start polling
		if (!this.props.open && !this.state.connected && nextProps.open) {
			this.activate(true);
			this.store.startPolling();
		}
	}

	componentDidMount = () => {
		//console.log("didmount: props, state", this.props, this.state);
		this.activate(this.props.open);
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
	
	scrollWindow() {
		let messageList = document.getElementById("messageslist");
		//console.log("scrolling", messageList.scrollHeight, messageList.scrollTop, messageList.scrollTopMax);
		if (messageList.childElementCount > 0) messageList.lastChild.scrollIntoView(true);
		//container.animate({scrollTop : (msgl.scrollHeight)}, container.scrollHeight);
	}

	componentDidUpdate = (prevProps, prevState) => {
		//console.log("didupdate: props, state", prevProps, prevState);
		this.scrollWindow();
	}

	componentWillUnmount = () => {
		//console.log("willunmount: props, state", this.props,this.state);
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
					multiLine={!this.state.sendOnEnter}>
				</TextField>	
				</form>		
			</CardActions>
			
		</Card>
        );
    }
}

