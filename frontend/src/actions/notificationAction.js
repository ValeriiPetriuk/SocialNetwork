import axios from "axios"
import { NOTIFICATION_LIST_FAIL, NOTIFICATION_LIST_REQUEST, NOTIFICATION_LIST_SUCCESS } from "../constants/notificationConstants"


export const listNotifications = () => async (dispatch, getState) => {
    try {
        dispatch({ type: NOTIFICATION_LIST_REQUEST})

        const {
            userLogin: {userInfo}
        } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(`http://127.0.0.1:8000/notifications/`, config)

        dispatch({
            type: NOTIFICATION_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: NOTIFICATION_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}