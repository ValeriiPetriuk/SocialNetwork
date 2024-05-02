import { useEffect} from 'react';
import {LinkContainer} from 'react-router-bootstrap'
import { useNavigate} from 'react-router-dom';
import {Table, Button, Row, Col} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { deletePost, listMyPost } from '../actions/postActions';
import { POST_CREATE_RESET } from '../constants/postConstants';




function MyListPostScreens() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
  
    const myListPost = useSelector(state => state.myListPost)
    const {loading, error,  posts} = myListPost
     
    const postDelete = useSelector(state => state.postDelete)
    const {loading: loadingDelete, error:errorDelete, success: successDelete} = postDelete

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin


    useEffect(() => {
        dispatch({type: POST_CREATE_RESET})

        if (!userInfo) {
            navigate('/login')
        } else {
            dispatch(listMyPost())             
        }        
    }, [dispatch, navigate, userInfo, successDelete])


    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deletePost(id))
        }
       
    }

 
 
    return (
        <div>
            <Row className='align-items-center'>
                <Col>
                    <h1>Мої пости</h1>
                </Col>
                <Col className='col-md-12 text-right'>
                <LinkContainer to="/create-post">
                    <Button className='btn btn-dark my-3'>
                            <i className='fas fa-plus'></i> Створити пост
                    </Button>
                </LinkContainer>
                  
                </Col>
            </Row> 

            {loadingDelete && <Loader/>}
            {errorDelete && <Message variant="danger">{errorDelete}</Message>}

            {loading ? (<Loader/>) : error ? (<Message variant="danger">{error}</Message>) : (
                <div>
                <Table striped hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>Назва</th>
                            <th>Користувач</th>
                            <th>Категорія</th>
                            <th>Дата</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {Array.isArray(posts) && posts.map(post => (
                            <tr key={post.id}>
                                <LinkContainer to={`/post/${post.id}`} style={{cursor: "pointer"}}>
                                    <td>{post.title}</td>
                                </LinkContainer>
                              
                                <td>{post.user.username}</td>
                                <td>{post.category}</td>
                                <td>{post.created_at.substring(0,10)}</td>
                            <td>
                                <LinkContainer to={`/update-post/${post.id}`}>
                                    <Button variant='btn btn-light' className='btn-sm'>
                                        <i className='fas fa-edit'></i>
                                    </Button>
                                </LinkContainer>
                                <Button variant='btn btn-danger' className='btn-sm' onClick={() => deleteHandler(post.id)}>
                                    <i className='fas fa-trash'></i>
                                    </Button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                
                </div>
            )}
        </div>
    )
}

export default MyListPostScreens