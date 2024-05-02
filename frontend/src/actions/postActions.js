import axios from "axios"
import { POST_COMMENTS_CREATE_FAIL, POST_COMMENTS_CREATE_REQUEST, POST_COMMENTS_CREATE_SUCCESS,  POST_COMMENTS_DELETE_FAIL,  POST_COMMENTS_DELETE_REQUEST,  POST_COMMENTS_DELETE_SUCCESS,  POST_CREATE_FAIL, POST_CREATE_REQUEST, POST_CREATE_SUCCESS, POST_DELETE_FAIL, POST_DELETE_REQUEST, POST_DELETE_SUCCESS, POST_DETAILS_FAIL, POST_DETAILS_REQUEST, POST_DETAILS_SUCCESS, POST_LIKE_FAIL, POST_LIKE_REQUEST, POST_LIKE_SUCCESS, POST_LIST_FAIL, POST_LIST_MY_FAIL, POST_LIST_MY_REQUEST, POST_LIST_MY_SUCCESS, POST_LIST_REQUEST, POST_LIST_SUCCESS, POST_UPDATE_FAIL, POST_UPDATE_REQUEST,  POST_UPDATE_SUCCESS } from "../constants/postConstants"


export const listPosts = () => async (dispatch, getState) => {
    try {
        dispatch({ type: POST_LIST_REQUEST })

        const {
            userLogin: {userInfo}
        } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${userInfo.token}`
            }
        }
        
        if (userInfo && userInfo.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }

        const { data } = await axios.get(`http://127.0.0.1:8000/api/posts/`, config)

        dispatch({
            type: POST_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: POST_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const detailPost = (id) =>  async (dispatch) => {
    try {
        dispatch({
            type:POST_DETAILS_REQUEST
        })
        const { data } = await axios.get(`http://127.0.0.1:8000/api/posts/${id}`)
      
        dispatch({
            type: POST_DETAILS_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: POST_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
        }) 
    }
}


export const listMyPost = () =>  async (dispatch, getState) => {
    try {
        dispatch({
            type: POST_LIST_MY_REQUEST,
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
        const {data} = await axios.get(`http://127.0.0.1:8000/api/posts/mypost/`,
            config
          )

        dispatch({
            type: POST_LIST_MY_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: POST_LIST_MY_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
        }) 
    }
}

export const createPost = (title, description, category, image) => async (dispatch, getState) => {
    try {
      dispatch({
        type: POST_CREATE_REQUEST,
      });
  
      const {
        userLogin: { userInfo },
      } = getState();
  
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('image', image);
  
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
  
      const { data } = await axios.post('http://127.0.0.1:8000/api/posts/create/', formData, config);
  
      dispatch({
        type: POST_CREATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: POST_CREATE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

export const updatePost = (post) =>  async (dispatch, getState) => {
    try {
        dispatch({
            type: POST_UPDATE_REQUEST,
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
        const {data} = await axios.put(`http://127.0.0.1:8000/api/posts/update/${post.id}/`,
            post,
            config
          )

        dispatch({
            type: POST_UPDATE_SUCCESS,
            payload: data,
        })

        dispatch({type: POST_DETAILS_SUCCESS, payload: data})

    } catch (error) {
        dispatch({
            type: POST_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
        }) 
    }
}

export const deletePost = (id) =>  async (dispatch, getState) => {
    try {
        dispatch({
            type: POST_DELETE_REQUEST,
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
        const {data} = await axios.delete(`http://127.0.0.1:8000/api/posts/delete/${id}/`,
            config
          )

        dispatch({
            type: POST_DELETE_SUCCESS,
            payload: data,
        })


    } catch (error) {
        dispatch({
            type: POST_DELETE_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
        }) 
    }
} 


export const deleteComment = (id) =>  async (dispatch, getState) => {
    try {
        dispatch({
            type: POST_COMMENTS_DELETE_REQUEST,
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
        const {data} = await axios.delete(`http://127.0.0.1:8000/api/posts/comment-delete/${id}/`,
            config
          )

        dispatch({
            type: POST_COMMENTS_DELETE_SUCCESS,
            payload: data,
        })


    } catch (error) {
        dispatch({
            type: POST_COMMENTS_DELETE_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
        }) 
    }
} 



export const likePost = (post_id) =>  async (dispatch, getState) => {
    try {
        dispatch({
            type: POST_LIKE_REQUEST,
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
        const {data} = await axios.post(`http://127.0.0.1:8000/api/posts/like_post/${post_id}`, null,
            config
          )

        dispatch({
            type: POST_LIKE_SUCCESS,
            payload: data,
        })

       

    } catch (error) {
        dispatch({
            type: POST_LIKE_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
        }) 
    }
}


export const CommentCreate = (post_id, text, parent=NaN) =>  async (dispatch, getState) => {
    try {
        dispatch({
            type: POST_COMMENTS_CREATE_REQUEST,
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
        const {data} = await axios.post(`http://127.0.0.1:8000/api/posts/create_comment/${post_id}`, 
            {text, parent},
            config
          )

        dispatch({
            type: POST_COMMENTS_CREATE_SUCCESS,
            payload: data,
        })

       

    } catch (error) {
        dispatch({
            type: POST_COMMENTS_CREATE_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
        }) 
    }
}

