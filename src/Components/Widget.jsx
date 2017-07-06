import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {MuiThemeProvider, getMuiTheme} from 'material-ui/styles';

import {FloatingActionButton} from 'material-ui';
import Chat from './Chat.jsx';
import ChatIcon from 'material-ui/svg-icons/communication/chat';
import CloseIcon from 'material-ui/svg-icons/navigation/expand-more';

import style from './Widget.style.js';

const muiTheme = getMuiTheme(style.Theme);

@inject("chatStore")
@observer
class Widget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    tooggle = () => {
        if (!this.state.open) this.props.chatStore.startPolling();
        this.setState((prevState) => {
            return {
                open: !prevState.open
            }
        });
    }

    handleExpandChange = () => {
        //do something
    }

    getStyle = () => {
        let s = style;
        s.Chat.display = this.state.open
            ? "inline"
            : "none";
        return s;
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <FloatingActionButton
                        style={style.FloatingButton}
                        onTouchTap={this.tooggle}
                        zDepth={2}>
                        {this.state.open ? <CloseIcon/> : <ChatIcon/>}
                    </FloatingActionButton>
                    <Chat open={this.state.open} config={this.props.config} chatStore={this.props.chatStore} style={this.getStyle()}/>                    
                </div>
            </MuiThemeProvider>
        );
    }
}

export default Widget