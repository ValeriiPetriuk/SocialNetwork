import { useEffect, useState } from "react"
import { useDispatch, useSelector} from 'react-redux'
import { Link } from "react-router-dom"
import { Row, Col, Image, ListGroup, Button } from "react-bootstrap"
import {useParams} from "react-router-dom"
import { CommentCreate, deleteComment, detailPost } from "../actions/postActions"
import {Form} from 'react-bootstrap'
import Loader from '../components/Loader';
import Message from '../components/Message';
import CommentCard from "../components/CommentCard"
import {
    MDBBtn,
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
import { POST_COMMENTS_CREATE_RESET } from "../constants/postConstants"

function PostScreens() {
    const params = useParams();
    const dispatch = useDispatch();
    

    const postDetail = useSelector(state => state.postDetail);
    const {error, loading, post} = postDetail;
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin
    
    const postCommentCreate = useSelector(state => state.postCommentCreate);
    const { success: successCreate} = postCommentCreate;


    const postCommentDelete = useSelector(state => state.postCommentDelete);
    const {  success: successCommentDelete} = postCommentDelete;
    const [text, setText] = useState('')

    useEffect(() => {
        dispatch({type: POST_COMMENTS_CREATE_RESET})
        dispatch(detailPost(params.id))
      
    
      }, [dispatch, params, successCommentDelete, successCreate])

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteComment(id))
            dispatch(detailPost(params.id))
        }
    }

    return (
        loading ? <Loader/> : error ? <Message variant="danger">{error}</Message> :
        <div>
            <Link to="/" className="btn btn-light my-3">Повернутися назад</Link>
            <Row>
                <Col md={5}>
                    {post && post.image &&  <Image src={`http://127.0.0.1:8000${post && post.image}`} alt={post && post.title} fluid />}
               
                </Col>
                <Col md={3}>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <h3>{post && post.title}</h3>
                    </ListGroup.Item>
                
                    <ListGroup.Item>
                        Description: { post && post.description}
                    </ListGroup.Item>
                </ListGroup>

                
            </Col>
            </Row>
            <Row>
                <Col>
                    <h2>Comment</h2>
                    <CommentCard  id={params.id}/>
                    

        {/* <section className="vh-100" >
        <MDBContainer className="py-5"  >
            <MDBRow className="justify-content-center">
            
            <MDBCol md="12" lg="10" xl="8">
          
                <MDBCard>
                {post && post.comments && post.comments.map(comment => (
                <MDBCardBody key={comment.id}>
                <MDBRow >
                <MDBCol>
                <div className="d-flex flex-start">
                    
                   {!comment.parent &&  <MDBCardImage
                      className="rounded-circle shadow-1-strong me-3"
                      src={`http://127.0.0.1:8000${comment && comment.author.avatar}`}
                      alt="avatar"
                      width="65"
                      height="65"
                    />}

                    <div className="flex-grow-1 flex-shrink-1">
                    {!comment.parent &&   <div>
                        <div className="d-flex justify-content-between align-items-center">
                          <p className="mb-1">
                            { comment.author.username}{" "}
                            <span className="small">- {comment.created.substring(0,10)}</span>
                          </p>
                          <a href="#!">
                            <MDBIcon fas icon="reply fa-xs" />
                            <span className="small"> reply</span>
                          </a>

                          <Button onClick={ () => deleteHandler(comment.id)
                          }>
                            <MDBIcon fas icon="reply fa-xs" />
                            <span className="small"> delete</span>
                          </Button>
                        </div>
                        <p className="small mb-0">
                            { comment.text}
                        </p>
                      </div>}
                       
                     {comment.parent &&
                     
                        <div className="d-flex flex-start mt-4" style={{ marginLeft: '10%' }}>
                            <a className="me-3" to="#">
                            <MDBCardImage
                                className="rounded-circle shadow-1-strong me-3"
                                src={`http://127.0.0.1:8000${comment && comment.author.avatar}`}
                                alt="avatar"
                                width="65"
                                height="65"
                            />
                            </a>

                            <div className="flex-grow-1 flex-shrink-1">
                            <div>
                                <div className="d-flex justify-content-between align-items-center">
                                <p className="mb-1">
                                { comment.author.username}{" "}
                                    <span className="small">- {comment.created.substring(0,10)}</span>
                                </p>
                                </div>
                                <p className="small mb-0">
                                {comment.text}
                                </p>
                            </div>
                            </div>
                        </div>
                     }
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
                        onChange={e => 
                                setText(e.target.value)
                        }
                    />
                    </div>
                    <div className="float-end mt-2 pt-1">
                    <Button size="sm" className="me-1" onClick={() => {
                        dispatch(CommentCreate(post.id, text))
                        
                        // setParrent(null)
                        
                    }}>Post comment</Button>
                  
                    </div>
                </MDBCardFooter>
                </MDBCard>
                
            </MDBCol>
          
            </MDBRow>
            
        </MDBContainer>
        </section> */}
                    
                </Col>
            </Row>

        </div>
        
        
    )
    
  }
  

export default PostScreens

                   
