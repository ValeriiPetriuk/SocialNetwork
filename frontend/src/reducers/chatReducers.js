import { CHAT_CREATE_FAIL, CHAT_CREATE_REQUEST, CHAT_CREATE_RESET, CHAT_CREATE_SUCCESS, 
    CHAT_LIST_FAIL, CHAT_LIST_REQUEST, CHAT_LIST_RESET, CHAT_LIST_SUCCESS,
    CHAT_DELETE_REQUEST,  CHAT_DELETE_SUCCESS, CHAT_DELETE_FAIL, MESSAGE_LIST_REQUEST, MESSAGE_LIST_SUCCESS, MESSAGE_LIST_FAIL, MESSAGE_LIST_RESET, ADD_MESSAGE,} from "../constants/chatConstants"



export const chatListReducer = (state = {chats:[]}, action) => {
    switch (action.type) {
        case CHAT_LIST_REQUEST:
            return {...state, loading: true, chats:[]}

        case CHAT_LIST_SUCCESS:
            return {
                ...state,
                loading: false, 
                chats: action.payload
            }

        case CHAT_LIST_FAIL:
            return {loading: false, error: action.payload}
		
		case CHAT_LIST_RESET:
				return { chats: [] };

        default: 
            return state
    }
}

export const chatCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case CHAT_CREATE_REQUEST:
            return {  loading: true };

        case CHAT_CREATE_SUCCESS:
            return {loading: false, success: true, chat: action.payload };

        case CHAT_CREATE_FAIL:
            return { loading: false, error: action.payload };

        case CHAT_CREATE_RESET:
            return { loading: false, error: action.payload };

        default: 
            return state;
    }
};




export const chatDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case CHAT_DELETE_REQUEST:
            return {...state, loading: true}

        case CHAT_DELETE_SUCCESS:
            return {...state,loading: false, success:true}

        case CHAT_DELETE_FAIL:
            return {loading: false, error: action.payload}

        default: 
            return state
    }
}




export const messageListReducer = (state = {messages:[]}, action) => {
    switch (action.type) {
        case MESSAGE_LIST_REQUEST:
            return {loading: true, messages:[]}

        case MESSAGE_LIST_SUCCESS:
            return {
                loading: false, 
                messages: action.payload
            }

        case MESSAGE_LIST_FAIL:
            return {loading: false, error: action.payload}
            
        
        case MESSAGE_LIST_RESET:
            return {messages : [] };

        case ADD_MESSAGE:
                return {
                  ...state,
                  messages: [...state.messages, action.payload],
                };

        default: 
            return state
    }
}