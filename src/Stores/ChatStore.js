import {observable, computed, action} from "mobx";
import ChatClient from './ChatAxiosClient';
import _ from 'lodash';
import moment from 'moment';

const chatClient = new ChatClient();

class ChatStore {
		constructor(params) {
			console.log("store started", params);			
			chatClient.start(params)
				.then(this.startPolling)
				.catch((err) => {
					console.error("start error:",err);
				})
		}

		@observable messages = [];
		@observable pollingActive = false;
		 participants = [];
		 events = [];
		 rootUri = chatClient.rootUri;
		 config;

		//@computed get pollingActive() {return this.tick && this.tick>0}

		@action startPolling = (startresult) => {	
			if (!startresult) return;
			console.log("start chat:",startresult.data.chat);
			this.config = startresult.data.chat;
			this.events = _.concat(this.events, startresult.data.chat.events);
			this.parseEvents(startresult.data.chat.events);
			this.tick = setInterval(this.poll, this.config.pollWaitSuggestion);		
			this.pollingActive = true;	
		}

		@action stopPolling = () => {	
			console.log("stopped polling");
			//clearInterval(this.tick);
			this.pollingActive = false;	
			console.log("polling", this.pollingActive);
		}

		poll = () => {
			if (!this.pollingActive) return;
			//console.log("polling", this.pollingActive);
			chatClient.poll(this.config.participantID)
				.then((response) => this.parseEvents(response.data.chat.events));
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
				this.events = _.concat(this.events, events);
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
        	//console.table(this.participants.slice());           
		}
		
		@action sendMessage(message) {
				this.pollingActive = true;
				message.timeStamp = new moment();
				//this.messages.push(message);
				chatClient.send(this.config.participantID, message.message)
				.then((response) => this.parseEvents(response.data.chat.events));
		}

		@action disconnect() {	
				if (this.tick > 0) clearInterval(this.tick);			
				chatClient.disconnect(this.config.participantID)
				.then((response) => this.parseEvents(response.data.chat.events));
		}

		@computed get messagesCount() {
				return this.messages.length;
		}

		@computed get sessionstate() {
				return this.config  && this.config.participantID ? "started" : "offline";
		}

		@computed get participantsList() {
                
				return this.participants.map((p) => {return p.name});
		}
}

export default ChatStore