import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import {Card, CardText, CardActions} from 'material-ui/Card';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import Messages from './Messages.jsx';

export default class Chat extends Component {

	store = this.props.chatStore;

	componentDidMount = () => {
		this.store.connect()
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
		this.setState({messages: this.store.messages, cnt: this.store.messagesCount });
		messageinput.value = "";	
	}
	
	handleChange = (e, value) => {
		////todo: set typing to true
		//e.preventDefault();
		//console.log(value, e.target, e.target.value);
	}

	scrollWindow() {
		//let windowHeight = $('.Messages').height();
		//$(".container").animate({scrollTop : ($(".container")[0].scrollHeight)}, windowHeight);
	}

	componentWillUpdate = (nextProps, nextState) => {
		this.scrollWindow();
	}

	componentWillUnmount = () => {
		this.store.disconnect();
	}
	
    render() {		
        return (		
       <Card style={this.props.style.Card} expanded={true}>
		   	<AppBar
				title={this.props.config.HeaderText}
				iconClassNameLeft="send"
				showMenuIconButton={false}
				>                            
			</AppBar>

			<CardText style={this.props.style.Messages}>
			
					<Messages messages={this.store.messages} />
			
			</CardText>
			<Paper zDepth={3}>
			<CardActions >
				<form onSubmit={this.handleSubmit}>
				<TextField
					id="messagetext"
					hintText="Your Message"
					onChange={this.onChange}
					fullWidth={true}
					multiLine={false}>
				</TextField>
				</form>
			</CardActions>
			</Paper>
		</Card>
        );
    }
}

