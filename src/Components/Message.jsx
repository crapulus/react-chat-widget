import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import { blue800 } from 'material-ui/styles/colors';
import { redA700 } from 'material-ui/styles/colors';

const messageAvatar = (displayName, sender, picture = "", size = 30) => {		 
		 let shortname = (!!displayName ? displayName : "Xx");
		 return <Avatar color={sender===1 ? blue800 : redA700} size={size}>{shortname.toUpperCase().substring(0,2)}</Avatar>
	}

@observer
export default class Message extends Component {

	render() { 
		return (			
			<Paper zDepth={2}>
			<ListItem
				style={this.props.style}
				insetChildren={true}
				//disabled={true}
				rightAvatar = {(this.props.sender === 1) ? messageAvatar(this.props.displayName, 1) : null}
				leftAvatar = {(this.props.sender === 2) ? messageAvatar(this.props.displayName, 2) : null}
				primaryText={this.props.message}
				secondaryText={this.props.timeStamp.format("HH:MM") + " " + this.props.timeStamp.fromNow()  }
				/>
			</Paper>
	)}
}