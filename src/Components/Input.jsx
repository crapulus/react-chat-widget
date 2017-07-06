import React, { Component } from 'react';

import {FlatButton} from 'material-ui';
import SendIcon from 'material-ui/svg-icons/content/send';

export default class Input extends Component{
	render() { return (<FlatButton>
				<SendIcon/>
			</FlatButton>);
	}
}