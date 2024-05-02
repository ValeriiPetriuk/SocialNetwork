import { NOTIFICATION_LIST_FAIL, NOTIFICATION_LIST_REQUEST, NOTIFICATION_LIST_RESET, NOTIFICATION_LIST_SUCCESS } from "../constants/notificationConstants";


export const notificationsListReducer = (state = {notifications:[]}, action) => {
    switch (action.type) {
        case NOTIFICATION_LIST_REQUEST:
            return {...state, loading: true, notifications:[]}

        case NOTIFICATION_LIST_SUCCESS:
            return {
                ...state,
                loading: false, 
                notifications: action.payload
            }

        case NOTIFICATION_LIST_FAIL:
            return {loading: false, error: action.payload}
		
		case NOTIFICATION_LIST_RESET:
				return { notifications: [] };

        default: 
            return state
    }
}