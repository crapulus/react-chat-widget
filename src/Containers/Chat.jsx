import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Card, CardActions, CardHeader } from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import SendIcon from 'material-ui/svg-icons/content/send';
import ChatIcon from 'material-ui/svg-icons/communication/chat';

import Conversation from './../Components/Conversation';

@observer
export default class Chat extends Component {
	constructor(props, context) {
		super(props);
		this.state = { userTyping: false, sendOnEnter: true, autoScroll: true };
		this.store = props.chatStore;
	}

	i18n = (ref, plural) => this.props.i18n(ref, plural);

	activate = (open) => {
		console.log("activating chat: open ,store connected", open, this.store.connected);
		if (!this.store.connected && open) {
			this.store.connect();
		}
	}

	cnt = () => { return this.store.messages.length || 0 }

	componentWillReact = () => {
		console.log("reacting", this.store);
	}

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
					connected: true, userTyping: false
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

		this.store.sendMessage({ sender: 2, message: value });
		this.setState({ userTyping: false });
		messageinput.value = "";
	}

	onToggleScrolling = (e, active) => {	
		this.setState({ autoScroll: active });
	}
	scrollWindow() {
		let messageList = document.getElementById("messageslist");
		//console.log("scrolling", messageList.scrollHeight, messageList.scrollTop, messageList.scrollTopMax);
		if (messageList.childElementCount > 0) messageList.lastChild.scrollIntoView(true);
		//container.animate({scrollTop : (msgl.scrollHeight)}, container.scrollHeight);
	}

	componentDidUpdate = (prevProps, prevState) => {
		//console.log("didupdate: props, state", prevProps, prevState);
		if (this.state.autoScroll) this.scrollWindow();
	}

	render() {
		return (
			<Card style={this.props.style.Chat} expanded={true}>
				<CardHeader
					style={{ backgroundColor: this.props.muiTheme.palette.primary3Color }}				
					titleColor={this.props.muiTheme.palette.primary1Color}
					title={this.store.headerText}
					subtitle={`${this.store.participantUserName} - ${this.i18n("subHeader", this.cnt())}: ${this.cnt()}`}
					avatar={<Avatar
						icon={<ChatIcon
							color={this.props.muiTheme.palette.primary1Color}
						/>}
						backgroundColor={this.props.muiTheme.palette.secondary1Color}
					/>}
					children = {<Toggle defaultToggled={true} onToggle={this.onToggleScrolling} labelPosition="left" label=""/>}
				>
				</CardHeader>
				<Conversation messages={this.store.messages} style={this.props.style} />

				<CardActions style={this.props.style.MessageList}>
					<form onSubmit={this.handleSubmit}>
						<TextField
							id="messagetext"
							style={this.props.style.TextField}
							hintText={this.i18n("placeHolder")}
							onChange={this.onChange}
							fullWidth={false}
							multiLine={!this.state.sendOnEnter}>
						</TextField>
						<RaisedButton icon={<SendIcon />} primary={true} onTouchTap={this.handleSubmit} />
					</form>					
				</CardActions>
			</Card>
		);
	}
}

