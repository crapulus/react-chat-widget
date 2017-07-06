import {observable, computed, action, useStrict} from "mobx";
import ChatClient from './ChatAxiosClient';
import _ from 'lodash';
import moment from 'moment';

useStrict();
const chatClient = new ChatClient();

class ChatStore {
		constructor(params) 
		{
			console.log("store started", params, this.particpantId);	
			this.params = params;	
		}

		@observable chatId = "";
		@observable particpantId = "";
		@observable pollWait = 3000; //default 3s;
		@observable messages = [];
		@observable participants = [];
		@observable pollingActive = false;

		//@computed get pollingActive() {return this.tick && this.tick>0}

		@action connect = () => {	
			if (!this.params) return;
			console.log("connecting store to chatapi...");
			chatClient.start(this.params)
				.then(this.connectOk);
		}

		connectOk = (connectResponse) => {
			let chat = connectResponse.data.chat;
			console.log("started chat: ", chat.status.type);
			if (chat.status.type==="success") {
				console.log("updating chat properties: ", chat.status.type);
				this.chatId = chat.chatID;
				this.particpantId = chat.participantID;
				this.pollWait = chat.pollWaitSuggestion;
				this.parseResponse("start", chat)
			} else {
				console.warn("start chat failed: ", chat.status);
				//what to do if failed start?		
			}
		}

		@action startPolling = () => {	
			console.log("start polling:",this.pollWait, this.tick);
			this.pollingActive = true;
			this.tick = window.setInterval(this.poll, this.pollWait);	
		}

		@action stopPolling = () => {	
			console.log("stopped polling");
			this.pollingActive = false;
			window.clearInterval(this.tick);
		}

		@action poll = () => {
			//console.log("store polling", this.pollingActive, this.tick, this.messagesCount);
			if (!this.pollingActive) return;
			console.log(`polling ${this.particpantId}...`);
			chatClient.poll(this.participantId)
				.then((response) => this.parseResponse("poll", response.data.chat));
		}

		@action parseResponse = (action, chat) => {
			console.log(`parsing "${action}" response: ${chat.events.length} events `);
			if (chat.events && chat.events.length > 0) {
				this.parseEvents(chat.events);
			}
		}

        updateParticipants = (event) => {
             if (event.type==="participantState" || event.participantType==="System" ) return;

             let newp = { key:event.participantID, name: event.displayName || "", type: event.participantType || "None", typing: event.state==="active" || false };
             let found = _.find(this.participants, (p) => {return p.key===newp.key} );
             if (found) {
                //console.log("participant found", found);
                //this.participants = _.remove(this.participants, (p) => {return p.key===found.key});
             }  else {
                this.participants = _.concat(this.participants, newp);
             }            
        }

		parseEvents = (events) => {
				console.log(`parsing ${events.length} events`);
				//this.events = _.concat(this.events, events);
				_.map(events, (event) => {
					if (event.displayName && event.participantType)	
                    this.updateParticipants(event);   
                     
					//todo complete	& improve			
						switch (event.type) {
							case "text":
								if (event.value) 
								{
									let sender = (event.participantType==="WebUser") ? 1 : 2;
									this.messages = this.messages.concat([{key:event.sequenceNumber, sender:sender, displayName:event.displayName, message:event.value, timeStamp: new moment()}]);
								}                            
								break;
							case "participantStateChanged":
								console.log("participant state:",event);
								break;
							case "typingIndicator":
								console.log("typing:",event);
								break;
							default:
								break;
						}
    		});       
		}
		
		@action sendMessage(message) {
			message.timeStamp = new moment();
			chatClient.send(this.particpantId, message.message)
			.then((response) => this.parseResponse("send", response.data.chat));
		}

		@action disconnect() {	
			if (this.tick) clearInterval(this.tick);			
			chatClient.disconnect(this.participantId)
			.then((response) => this.parseResponse("exit", response.data.chat));
		}

		@computed get messagesCount() {
			return this.messages.length;
		}

		@computed get connected() {
			return  !!(this.chatId  && this.participantId )
		}

		@computed get participantsList() {
    		return this.participants.map((p) => {return p.name});
		}
}

export default ChatStore