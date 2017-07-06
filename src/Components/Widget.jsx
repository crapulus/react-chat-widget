import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {MuiThemeProvider} from 'material-ui/styles';
import {FloatingActionButton} from 'material-ui';
import Chat from './Chat.jsx';
//import FlatButton from 'material-ui/FlatButton';
import ChatIcon from 'material-ui/svg-icons/communication/chat';
import style from './Widget.style.js';

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
        s.Card.display = this.state.open
            ? "inline"
            : "none";
        return s;
    }

    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <FloatingActionButton
                        style={style.FloatingButton}
                        onTouchTap={this.tooggle}
                        zDepth={2}>
                        <ChatIcon/>
                    </FloatingActionButton>
                    <Chat config={this.props.config} chatStore={this.props.chatStore} style={this.getStyle()}/>                    
                </div>
            </MuiThemeProvider>
        );
    }
}

export default Widget