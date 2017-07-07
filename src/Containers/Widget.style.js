import {red700} from 'material-ui/styles/colors';
const style = {
    Theme: {
        palette: {
            primary1Color: red700
        },
        appBar: {
            height: 40
        }
    },
    primaryColor: red700,
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
        maxWidth: "720px",
        maxHeight: "85vh",
        borderRadius: "1em"
    }
}

export default style