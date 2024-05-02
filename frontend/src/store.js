import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import {postCreateCommentReducer, postCreateReducer,  postDeleteCommentReducer,  postDeleteReducer, postDetailsReducers, postLikeReducers, postListMyReducers, postListReducer, postUpdateReducer } from './reducers/postReducers';
import { userDetailsReducer, userLoginReducer, userRegisterReducer, userUpdateProfileReducer } from './reducers/userReducers';
import {chatCreateReducer, chatDeleteReducer, chatListReducer, messageListReducer} from './reducers/chatReducers'
import { notificationsListReducer } from './reducers/notificationReducers';

 
const reducer = combineReducers({
    postsList: postListReducer,
    postDetail: postDetailsReducers,
    myListPost: postListMyReducers,
    postCreate: postCreateReducer,
    postUpdate: postUpdateReducer,
    postDelete: postDeleteReducer,
    postLike: postLikeReducers,
    postCommentCreate: postCreateCommentReducer,
    postCommentDelete: postDeleteCommentReducer,

    userDetailsProfile: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,

    chatList: chatListReducer,
    chatCreate: chatCreateReducer,
    chatDelete: chatDeleteReducer,
    messageList: messageListReducer,

    notificationList: notificationsListReducer,
    
})


const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null

const middleware = [thunk]

const initialState = {
    userLogin: {userInfo: userInfoFromStorage},
}

export const store = createStore(reducer, initialState,composeWithDevTools(applyMiddleware(...middleware)))