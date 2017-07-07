import axios from 'axios';
import Mock from './ChatAxiosClient.Mock';
import config from './ChatAxiosClient.Config';

const debugMode = config.debugMode;

const axiosInstance = axios.create({
    rootUri: config.rootUri
});
//do directly in config?
axiosInstance
    .interceptors
    .response
    .use(config.responseHook, config.errorHook);
//

export default class ChatClient {
    constructor(p) {
        p.mock ? this.mock = new Mock(axiosInstance) : this.mock = undefined;

        if (debugMode) console.log(this.mock ? "init ***MOCKED ***chatclient: " : "init ++WEBAPI++ chatclient: ", axiosInstance.rootUri);
    }
    start = (params) => {       
        if (debugMode) console.log("sending start (p, default): " + axiosInstance.rootUri + "chat/start", params);
        return axiosInstance
            .post(axiosInstance.rootUri+"chat/start", params);         
    }

    poll = (participantId) => {        
        return axiosInstance.get(`${axiosInstance.rootUri}chat/poll/${participantId}`);
    }

    send = (pid, messageText) => {
        return axiosInstance.post(`${axiosInstance.rootUri}chat/sendmessage/${pid}`, {message: messageText});         
    }

    setTypingState = (pid, typingState) => {
        return axiosInstance.post(`${axiosInstance.rootUri}chat/setTypingState/${pid}`, {typingIndicator: typingState});         
    }

    disconnect = (participantId) => {
        return axiosInstance.post(`${axiosInstance.rootUri}chat/disconnect/${participantId}`);         
    }

    reconnect = (chatid) => {
        return axiosInstance.post(`${axiosInstance.rootUri}chat/reconnect/${chatid}`);         
    }

    test = () => {
        axiosInstance
            .get(axiosInstance.rootUri+"test")
            .then((result) => {
                console.log("test done", result.data);
            })
            .catch((err) => {
                console.error("test error", err);
                return null;
            })
    }
}
