import { red700 } from 'material-ui/styles/colors';
import { blue800 } from 'material-ui/styles/colors';
import { green400 } from 'material-ui/styles/colors';

const style = {
    Themes:
    {
        red: { palette: { primary1Color: red700 } },
        blue: { palette: { primary1Color: blue800 } },
        green: { palette: { primary1Color: green400 } }
    },
    FloatingButton: {
        position: "absolute",
        bottom: 24,
        right: 24
    },

    Chat: {
        display: 'none',
        position: "absolute",
        bottom: 112,
        right: 24,
        width: "50vw",
        minWidth: "360px",
        maxWidth:  "50vw",
        maxHeight: "85vh",
        borderRadius: "1em"
    },

    TextField: {
        width: "70%",
        marginRight: "1em"
    },

    MessageList: {
        maxHeight: "50vh",
        Width: "98%",
        overflow: "auto",
    },

    Message: { 
        padding: "1em" ,
        maxWidth: "700px",
    }
}

export default style