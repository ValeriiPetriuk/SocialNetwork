import React, { useEffect, useState } from "react";
import {  useDispatch, useSelector } from 'react-redux';
import {
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBTextArea,
} from "mdb-react-ui-kit";
import { CommentCreate, deleteComment, detailPost } from "../actions/postActions";
import { Button } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import { Link } from 'react-router-dom';
import { POST_COMMENTS_CREATE_RESET } from "../constants/postConstants";


export default function CommentCard({id}) {
    
    const dispatch = useDispatch()
    const postDetail = useSelector(state => state.postDetail);
    const {post} = postDetail;
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    const postCommentCreate = useSelector(state => state.postCommentCreate);
    const { success: successCreate} = postCommentCreate;


    const postCommentDelete = useSelector(state => state.postCommentDelete);
    const { error, loading, success} = postCommentDelete;

    const [text, setText] = useState('')
    const [parrent, setParrent] = useState(null)
    

    useEffect(() => {
        // dispatch({type: POST_COMMENTS_CREATE_RESET})
       
        dispatch(detailPost(id))
              
    }, [dispatch, id, success, successCreate])

    const deleteHandler = (comment_id) => {
        if (window.confirm('Ви справді хочете видалити цей комент?')) {
            dispatch(deleteComment(comment_id))
            dispatch(detailPost(id))
        }
    }

    const createReplyHandler = (comment_id, reply_username=NaN) => {
        console.log('username:', reply_username)
        setParrent(comment_id);
        setText(`${reply_username}, `);
        
    }
    
    return (
        
        loading ? <Loader/> : error ? <Message variant="danger">{error}</Message> :
        
        <MDBContainer className="py-5"  >
            <MDBRow className="justify-content-center">
            
            <MDBCol md="12" lg="10" xl="8">
          
                <MDBCard>
                {post && post.comments && post.comments.map(comment => (
                
                <MDBCardBody key={comment.id}>
                <MDBRow >
                <MDBCol>
                <div className="d-flex flex-start">
                    
                     <MDBCardImage
                      className="rounded-circle shadow-1-strong me-3"
                      src={`http://127.0.0.1:8000${comment && comment.author.avatar}`}
                      alt="avatar"
                      width="65"
                      height="65"
                    />

                    <div className="flex-grow-1 flex-shrink-1">
                      <div>
                        <div className="d-flex justify-content-between align-items-center">
                          <p className="mb-1">
                            { comment.author.username}{" "}
                            <span className="small">- {comment.created.substring(0,10)}</span>
                          </p>
                          <Button  onClick={() => createReplyHandler(comment.id, comment.author.username)}>
                            <MDBIcon fas icon="reply fa-xs" />
                            <span className="small"> reply</span>
                          </Button>

                          {comment.author.id === userInfo.id && 
                            <Button onClick={() => deleteHandler(comment.id)}>
                                <MDBIcon fas icon="delete fa-xs" />
                                <span className="small"> delete</span>
                            </Button>
                          } 
                        </div>
                        <p className="small mb-0">
                            { comment.text}
                        </p>
                      </div>
                       
                    
                     {comment.replies.map((reply) => (
                            <div key={reply.id} className="d-flex flex-start mt-4" style={{ marginLeft: '10%' }}>     
                               <Link className="me-3" to="#">
                               <MDBCardImage
                                   className="rounded-circle shadow-1-strong me-3"
                                   src={`http://127.0.0.1:8000${reply && reply.author.avatar}`}
                                   alt="avatar"
                                   width="65"
                                   height="65"
                               />
                               </Link>

                               <div className="flex-grow-1 flex-shrink-1">
                                
                               <div>

                                   <div className="d-flex justify-content-between align-items-center">
                                    
                                   <p className="mb-1">
                                   { reply.author.username}{" "}
                                       <span className="small">- {comment.created.substring(0,10)}</span>
                                   </p>
                                   </div>
                                   <p className="small mb-0">
                                   {reply.text}
                                   </p>
                               </div>
                               </div>
                           </div>
                     ))}
                     
                     
                      </div>
                </div>                     
                </MDBCol>
                </MDBRow>
              
                </MDBCardBody>
                     ))}
                <MDBCardFooter
                    className="py-3 border-0"
                    style={{ backgroundColor: "#f8f9fa" }}
                >

                    <div className="d-flex flex-start w-100">
                    <MDBCardImage
                        className="rounded-circle shadow-1-strong me-3"
                        src={`http://127.0.0.1:8000${userInfo.avatar}`}
                        alt="avatar"
                        width="40"
                        height="40"
                    />

                    <MDBTextArea placeholder="Коментувати" id='textAreaExample' rows={4} style={{backgroundColor: '#fff'}} wrapperClass="w-100"
                        value={text}
                        onChange={e => 
                                setText(e.target.value)
                        }
                    />
                    </div>
                    <div className="float-end mt-2 pt-1">
                    <Button size="sm" className="me-1" onClick={() => {
                        dispatch(CommentCreate(post.id, text, parrent))
                        setParrent(null)
                        setText('')
                    }}>Post comment</Button>
                  
                    </div>
                </MDBCardFooter>
                </MDBCard>
                
            </MDBCol>
          
            </MDBRow>
            
        </MDBContainer>
       
    );
}

  
