import axios from "axios"
import { ADD_MESSAGE, CHAT_CREATE_FAIL, CHAT_CREATE_REQUEST,  CHAT_CREATE_SUCCESS, CHAT_DELETE_FAIL, CHAT_DELETE_REQUEST, CHAT_DELETE_SUCCESS, CHAT_LIST_FAIL, CHAT_LIST_REQUEST, CHAT_LIST_SUCCESS, MESSAGE_LIST_FAIL, MESSAGE_LIST_REQUEST, MESSAGE_LIST_SUCCESS } from "../constants/chatConstants"


export const listChat = () => async (dispatch, getState) => {
    try {
        dispatch({ type: CHAT_LIST_REQUEST })

        const {
            userLogin: {userInfo}
        } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(`http://127.0.0.1:8000/chat/`, config)

        dispatch({
            type: CHAT_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: CHAT_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}



export const createChat = (recipient) =>  async (dispatch, getState) => {
    try {
        dispatch({
            type: CHAT_CREATE_REQUEST,
        })

        const {
            userLogin: {userInfo}
        } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.post(`http://127.0.0.1:8000/chat/`,
            {recipient},
            config
          )

        dispatch({
            type: CHAT_CREATE_SUCCESS,
            payload: data,
        })


    }
    catch(error) {
        if (error.response && error.response.data.recipient && error.response.data.recipient.length) {
            dispatch({
                type: CHAT_CREATE_FAIL,
                payload: error.response.data.recipient[0]
            })
        } else {
            dispatch({
                type: CHAT_CREATE_FAIL,
                payload: "Упс! Щось пішло не так!"
            })
        }
    }
} 



export const deleteChat = (id) =>  async (dispatch, getState) => {
    try {
        dispatch({
            type: CHAT_DELETE_REQUEST,
        })

        const {
            userLogin: {userInfo}
        } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.delete(`http://127.0.0.1:8000/chat/${id}/delete`,
            
            config
          )

        dispatch({
            type: CHAT_DELETE_SUCCESS,
            payload: data,
        })


    } catch (error) {
        dispatch({
            type: CHAT_DELETE_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
        }) 
    }
} 


export const fetchMessage = (chat_uuid) => async (dispatch, getState) => {
    try {
        dispatch({ type: MESSAGE_LIST_REQUEST })

        const {
            userLogin: {userInfo}
        } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(`http://127.0.0.1:8000/chat/${chat_uuid}`, config)

        dispatch({
            type: MESSAGE_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: MESSAGE_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const addMessage = (messageData) => (dispatch) => {
    dispatch({
      type: ADD_MESSAGE,
      payload: messageData,
    });
  };