import axios from 'axios';
import Mock from './ChatAxiosClient.Mock';
import config from './ChatAxiosClient.Config';

const debugMode = config.debugMode;

export default class ChatClient {
    constructor(p) {
        this.axiosInstance = axios.create({
            rootUri: config.rootUri,
            interceptors: {
                response: [config.responseHook, config.errorHook]
            }
        });
        if (p.mock) this.mock = new Mock(this.axiosInstance);
        if (debugMode) console.log(this.mock ? "init ***MOCKED ***chatclient: " : "init ++WEBAPI++ chatclient: ", this.axiosInstance.rootUri);
    }

    start = (params) => {       
        if (debugMode) console.log("sending start (p, default): " + this.axiosInstance.rootUri + "chat/start", params);
        return this.axiosInstance
            .post("chat/start", params);         
    }

    poll = (participantId) => {        
        return this.axiosInstance.get(`chat/poll/${participantId}`);
    }

    send = (pid, messageText) => {
        return this.axiosInstance.post(`chat/sendMessage/${pid}`, {message: messageText});         
    }

    setTypingState = (pid, typingState) => {
        return this.axiosInstance.post(`chat/setTypingState/${pid}`, {typingIndicator: typingState});         
    }

    disconnect = (participantId) => {
        return this.axiosInstance.post(`chat/disconnect/${participantId}`);         
    }

    reconnect = (chatid) => {
        return this.axiosInstance.post(`chat/reconnect/${chatid}`);   // ${this.axiosInstance.rootUri}+
    }

    test = () => {
        this.axiosInstance
            .get("test")
            .then((result) => {
                console.log("test done", result.data);
            })
            .catch((err) => {
                console.error("test error", err);
                return null;
            })
    }
}
