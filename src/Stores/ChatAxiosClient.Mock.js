import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';


// MOCK REST API //
axios.rootUri =  "http://chatapi.n-allo.dev/api/";
const mock = new MockAdapter(axios, {delayResponse: 500});
const commonResponse = {chat: { pollWaitSuggestion: 3000, cfgVer: 1, status:{type:"success"}, events:[]}}
const commonResponseFail = {chat: { pollWaitSuggestion: 3000, cfgVer: 1, status:{type:"failure", error:"fake error #12345 from back-end"}}}
let sequenceNumber = 0;


//start
mock
    .onPost(/chat\/start/)
    .reply(function(config) {
        const startParams = JSON.parse(config.data);
        console.warn("**** mocking start ****", startParams);
        sequenceNumber++;
        return [
            200,  {
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
                            "sequenceNumber": sequenceNumber,
                            "conversationSequenceNumber": 0,
                            "contentType": "text/plain",
                            "value": "Welcome to our chat!",
                            "displayName": "IC",
                            "participantType": "System"
                        }, {
                            "type": "participantState",
                            "participantID": "00000000-0000-0000-0000- 000000000000",
                            "sequenceNumber": sequenceNumber+1,
                            "state": "active",
                            "displayName": startParams.Participant.LastName || "Anonymous",
                            "participantType": "Agent"
                        }
                    ]
                }
            }];
    });

//poll
mock
    .onGet(/chat\/poll/)
        .reply(function(config) {
            sequenceNumber++;
            return new Promise(function(resolve, reject) {
                if (!!config.data) 
                {
                    console.warn("**** mocking poll request ****", config.url);
                let response =  commonResponse;
                console.warn("**** mocking poll response template = ", response);
                response.events = [
                        {
                            "type": "text",
                            "participantID": "94e8c3b0-aeee-40e1-ba5aa593c8047fc5",
                            "sequenceNumber": sequenceNumber,
                            "conversationSequenceNumber": 0,
                            "contentType": "text/plain",
                            "value": "Can you please tell me my account balance? My account number is 12345.",
                            "displayName": "John Doe",
                            "participantType": "WebUser"
                        }, {
                            "type": "text",
                            "participantID": "94e8c3b0-aeee-40e1-ba5aa593c8047fc6",
                            "sequenceNumber": sequenceNumber++,
                            "conversationSequenceNumber": 0,
                            "contentType": "text/plain",
                            "value": "Your account balance is 123.45$",
                            "displayName": "Alan Agent",
                            "participantType": "Agent"
                        }
                    ];
                console.warn("**** mocking poll response ****", response);
                resolve([200, response]);
                } 
                else 
                {
                    reject([200, commonResponseFail])
                }
                
            })
        });

//Send
mock
    .onPost(/chat\/sendmessage/)
        .reply(function(config) {
        const data = JSON.parse(config.data);
        console.warn("**** mocking send request ****", data, config.url);
        sequenceNumber++
        let response = commonResponse;
      
        response.events = [
                {
                    "type": "text",
                    "participantID": "94e8c3b0-aeee-40e1-ba5aa593c8047fc5",
                    "sequenceNumber": sequenceNumber,
                    "conversationSequenceNumber": 0,
                    "contentType": "text/plain",
                    "value": data.message,
                    "displayName": "John Doe",
                    "participantType": "WebUser"
                }];
        console.warn("**** mocking send response ****", response);
        return [200, response];
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
