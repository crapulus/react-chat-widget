import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';


// MOCK REST API //
axios.rootUri =  "http://chatapi.n-allo.dev/api/";
const mock = new MockAdapter(axios, {delayResponse: 500});
const commonResponse = {chat: { pollWaitSuggestion: 3000, cfgVer: 1, status:{type:"success"}}}
//start
mock
    .onPost(/chat\/start/)
    .reply(200, {
        chat: {
            pollWaitSuggestion: 3000,
            cfgVer: 1,
            participantID: "94e8c3b0-aeee-40e1-ba5a-a593c8047fc5",
            dateFormat: "M/d/yyyy",
            timeFormat: "h:mm:sstt",
            chatID: "73db8632-9ee8-459e-a193-4d25684499d0",
            status: {
                type: "success"
            },
            events: [
                {
                    "type": "text",
                    "participantID": "00000000-0000-0000-0000- 000000000000",
                    "sequenceNumber": 1,
                    "conversationSequenceNumber": 0,
                    "contentType": "text/plain",
                    "value": "Welcome to our chat!",
                    "displayName": "IC",
                    "participantType": "System"
                }, {
                    "type": "participantState",
                    "participantID": "00000000-0000-0000-0000- 000000000000",
                    "sequenceNumber": 2,
                    "state": "active",
                    "displayName": "IC",
                    "participantType": "Agent"
                }
            ]
        }
    });

//poll
mock
    .onGet(/chat\/poll/)
    .reply(200, {
        "chat": {
            pollWaitSuggestion: 2000,
            cfgVer: 1,
            events: [
                {
                    "type": "text",
                    "participantID": "00000000- 0000-0000-0000-000000000000",
                    "sequenceNumber": 3,
                    "conversationSequenceNumber": 0,
                    "contentType": "text/plain",
                    "value": "Interaction alerting Alan Agent.",
                    "displayName": "IC"
                }, {
                    "type": "text",
                    "participantID": "94e8c3b0-aeee-40e1-ba5aa593c8047fc5",
                    "sequenceNumber": 4,
                    "conversationSequenceNumber": 0,
                    "contentType": "text/plain",
                    "value": "Can you please tell me my account balance? My account number is 12345.",
                    "displayName": "John Doe",
                    "participantType": "WebUser"
                }, {
                    "type": "text",
                    "participantID": "94e8c3b0-aeee-40e1-ba5aa593c8047fc6",
                    "sequenceNumber": 5,
                    "conversationSequenceNumber": 0,
                    "contentType": "text/plain",
                    "value": "Your account balance is 123.45$",
                    "displayName": "Alan Agent",
                    "participantType": "Agent"
                }
            ],
            status: {
                type: "success"
            }
        }
    })

//Send
mock
    .onPost(/chat\/sendmessage/)
    .reply(200, {
        chat: {
            pollWaitSuggestion: 2000,
            cfgVer: 1,
            status: {
                type: "success"
            },
            events: [
                {
                    "type": "text",
                    "participantID": "94e8c3b0-aeee-40e1-ba5aa593c8047fc5",
                    "sequenceNumber": 6,
                    "conversationSequenceNumber": 0,
                    "contentType": "text/plain",
                    "value": "Sample sent by John message",
                    "displayName": "John Doe",
                    "participantType": "WebUser"
                }
            ]
        }
    });

//test
mock
    .onGet(/test/)
    .reply(200, commonResponse);
//disco
mock
    .onPost(/chat\/disconnect/)
    .reply(200, commonResponse);

//typing
mock
    .onPost(/chat\/setTypingState/)
    .reply(200, commonResponse);
//reconnect
mock
    .onPost(/chat\/reconnect/)
    .reply(200, commonResponse);
    
//// MOCK REST API //

export default mock 
