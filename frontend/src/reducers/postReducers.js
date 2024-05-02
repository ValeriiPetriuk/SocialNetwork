import { POST_COMMENTS_CREATE_FAIL, POST_COMMENTS_CREATE_REQUEST, POST_COMMENTS_CREATE_RESET, POST_COMMENTS_CREATE_SUCCESS, POST_COMMENTS_DELETE_FAIL, POST_COMMENTS_DELETE_REQUEST, POST_COMMENTS_DELETE_SUCCESS, POST_CREATE_FAIL, POST_CREATE_REQUEST, POST_CREATE_RESET, POST_CREATE_SUCCESS, POST_DELETE_FAIL, POST_DELETE_REQUEST, POST_DELETE_SUCCESS, POST_DETAILS_FAIL, POST_DETAILS_REQUEST, POST_DETAILS_SUCCESS, POST_LIKE_FAIL, POST_LIKE_REQUEST, POST_LIKE_SUCCESS, POST_LIST_FAIL, POST_LIST_MY_FAIL, POST_LIST_MY_REQUEST, POST_LIST_MY_RESET, POST_LIST_MY_SUCCESS, POST_LIST_REQUEST, POST_LIST_SUCCESS, POST_UPDATE_FAIL, POST_UPDATE_REQUEST, POST_UPDATE_RESET, POST_UPDATE_SUCCESS } from "../constants/postConstants"



export const postListReducer = (state = {posts:[]}, action) => {
    switch (action.type) {
        case POST_LIST_REQUEST:
            return {loading: true, posts:[], ...state}

        case POST_LIST_SUCCESS:
            return {
                ...state,
                loading: false, 
                posts: action.payload
            }

        case POST_LIST_FAIL:
            return {loading: false, error: action.payload}

        default: 
            return state
    }
}






export const postDetailsReducers = (state = {}, action) => {
    switch (action.type) {
        case POST_DETAILS_REQUEST:
            return {loading: true, ...state}

        case POST_DETAILS_SUCCESS:
            return {loading: false, post: action.payload}

        case POST_DETAILS_FAIL:
            return {loading: false, error: action.payload}

        default: 
            return state
    }
}


export const postListMyReducers = (state={posts: []}, action) => {
    switch (action.type) {
        case POST_LIST_MY_REQUEST:
            return {
                loading: true
            }

        case POST_LIST_MY_SUCCESS:
            return {
                loading: false,
                posts: action.payload
            }

        case POST_LIST_MY_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case POST_LIST_MY_RESET:
            return {
                posts: []
            }
            
        default: 
            return state
    }
}

export const postCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case POST_CREATE_REQUEST:
            return {loading: true}

        case POST_CREATE_SUCCESS:
            return {loading: false, success:true, post:action.payload}

        case POST_CREATE_FAIL:
            return {loading: false, error: action.payload}

        case POST_CREATE_RESET:
            return {loading: false, error: action.payload}

        default: 
            return state
    }
}

export const postUpdateReducer = (state = {post:{}}, action) => {
    switch (action.type) {
        case POST_UPDATE_REQUEST:
            return {loading: true}

        case POST_UPDATE_SUCCESS:
            return {loading: false, success:true, post:action.payload}

        case POST_UPDATE_FAIL:
            return {loading: false, error: action.payload}

        case POST_UPDATE_RESET:
            return {post:{}}

        default: 
            return state
    }
}

export const postDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case POST_DELETE_REQUEST:
            return {loading: true}

        case POST_DELETE_SUCCESS:
            return {...state, loading: false, success:true}

        case POST_DELETE_FAIL:
            return {loading: false, error: action.payload}

        default: 
            return state
    }
}

export const postDeleteCommentReducer = (state = {}, action) => {
    switch (action.type) {
        case POST_COMMENTS_DELETE_REQUEST:
            return {loading: true, ...state}

        case POST_COMMENTS_DELETE_SUCCESS:
            return {...state, loading: false, success:true}

        case POST_COMMENTS_DELETE_FAIL:
            return {loading: false, error: action.payload}

        default: 
            return state
    }
}

export const postLikeReducers = (state = {}, action) => {
    switch (action.type) {
        case POST_LIKE_REQUEST:
            return {loading: true}

        case POST_LIKE_SUCCESS:
            return {loading: false, success:true}

        case POST_LIKE_FAIL:
            return {loading: false, error: action.payload}

        default: 
            return state
    }
}


export const postCreateCommentReducer = (state = {}, action) => {
    switch (action.type) {
        case POST_COMMENTS_CREATE_REQUEST:
            return {...state, loading: true}

        case POST_COMMENTS_CREATE_SUCCESS:
            return {...state, loading: false, success:true, comment:action.payload}

        case POST_COMMENTS_CREATE_FAIL:
            return {...state, loading: false, error: action.payload}

        case POST_COMMENTS_CREATE_RESET:
            return {loading: false, error: action.payload}


        default: 
            return state
    }
}

