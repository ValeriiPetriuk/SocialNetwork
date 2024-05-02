import axios from "axios"
import {  USER_DETAILS_FAIL, USER_DETAILS_REQUEST, USER_DETAILS_RESET, 
     USER_DETAILS_SUCCESS, USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS,
      USER_LOGOUT, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, 
      USER_UPDATE_PROFILE_FAIL, USER_UPDATE_PROFILE_REQUEST, 
      USER_UPDATE_PROFILE_SUCCESS, USER_UPDATE_AVATAR_REQUEST, USER_UPDATE_AVATAR_SUCCESS,USER_UPDATE_AVATAR_FAIL} from "../constants/userConstants"
import { POST_LIST_MY_RESET } from "../constants/postConstants"
import { CHAT_LIST_RESET } from "../constants/chatConstants"

export const login = (email, password) =>  async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST,
        })

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        const {data} = await axios.post('http://127.0.0.1:8000/api/users/login/', {'username': email, 'password': password}, config)

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        })

        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
        }) 
    }
} 

export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo')
    dispatch({type: USER_LOGOUT})
    dispatch({type: POST_LIST_MY_RESET})
    dispatch({type: CHAT_LIST_RESET})
   
}


export const register = (name, email, password, username) =>  async (dispatch) => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST,
        })

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        const {data} = await axios.post('http://127.0.0.1:8000/api/users/register/',
         {'name': name,'email': email, 'password': password, 'username': username}, config)

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data,
        })

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        })

        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
        }) 
    }
} 


export const getUserDetail = () =>  async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_DETAILS_REQUEST,
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
        const {data} = await axios.get(`http://127.0.0.1:8000/api/users/profile/`,
          config)

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
        }) 
    }
} 


export const updateUserProfile = (user) =>  async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST,
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
        const {data} = await axios.put(`http://127.0.0.1:8000/api/users/profile/update/`,
            user,
            config
          )

        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: data,
        })

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        })

        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch (error) {
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
        }) 
    }
} 


