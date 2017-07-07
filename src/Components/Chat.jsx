import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import SendIcon from 'material-ui/svg-icons/content/send';
import Messages from './Messages.jsx';
import RaisedButton from 'material-ui/RaisedButton';

@observer
export default class Chat extends Component {
	constructor(props) {
		super(props)
		
		this.state = { userTyping:false, sendOnEnter: true};
		this.store = props.chatStore;
	}

	activate = (open) => {
		console.log("activating chat: open ,store connected", open, this.store.connected);
		if (!this.store.connected && open) 
		{			
			this.store.connect();
		}
	}

	cnt = () => {return this.store.messages.length || 0}
	i18n = (ref) => {return this.props.translations[this.store.language || "en"][ref] || `${ref} not found`}

	componentWillUpdate = (nextProps, nextState) => {

		//active and closing - need to stop polling
		if (!nextProps.open) {
			console.log("de-activating chat: open ,store connected", nextProps.open, this.store.connected);
			this.store.stopPolling();
		}
		//active and opening - restart polling
		if (!this.props.open && nextProps.open) {
			console.log("re-activating chat: open ,store connected", nextProps.open, this.store.connected);
			this.store.startPolling();
		}
		//inactive and opening - connect + start polling
		if (!this.props.open && !this.store.connected && nextProps.open) {
			console.log("first-activating chat: open ,store connected", nextProps.open, this.store.connected);
			this.activate(true);
			this.store.startPolling();
		}
		// //update state??
		if (nextProps.chatStore.connected) {
			console.log("connected, chatid = " + this.store.chatId);	
			nextState = 
				{
					connected:true, userTyping: false
				};
		}
	}

	onChange = () => {
		this.setState({ userTyping: true });
	}

	handleSubmit = (e) => {
		e.preventDefault();
		let messageinput = document.getElementById("messagetext");
		let value = messageinput.value;
		
		this.store.sendMessage({sender:2, message: value});			
		this.setState({ userTyping: false });
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
			   title={this.store.headerText}
			   subtitle={`${this.store.participantUserName} - ${this.i18n("subHeader")}: ${this.cnt()}`}
			   avatar={ <Avatar icon={<SendIcon />} color={this.props.style.primaryColor} /> }/>  

			<CardText id="container">		
					<Messages messages={this.store.messages}/>
			</CardText>		
			<CardActions style={{ padding: "1em" }}>
				<form onSubmit={this.handleSubmit}>
				<TextField
					id="messagetext"
					style={{ width:"70%", marginRight:"1em"}}
					hintText={this.i18n("placeHolder")}
					onChange={this.onChange}
					fullWidth={false}
					multiLine={!this.state.sendOnEnter}>
				</TextField>	
				<RaisedButton icon={<SendIcon/>} primary={true} onTouchTap={this.handleSubmit}/>			
				</form>		
			</CardActions>
		
		</Card>
        );
    }
}

