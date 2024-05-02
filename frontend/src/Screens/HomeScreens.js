import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import {
    MDBCard,
    MDBCardImage,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBCol,
    MDBRow,
  } from 'mdb-react-ui-kit';
import { likePost, listPosts } from '../actions/postActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {Link, useNavigate} from 'react-router-dom';
import { Button } from 'react-bootstrap';


function HomeScreens() {
  
    const dispatch = useDispatch()
    const postsList = useSelector(state => state.postsList)
    const {error, loading, posts} = postsList

    const postLike = useSelector(state => state.postLike)
    const {success: successLike} = postLike
    const navigate = useNavigate();
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

      useEffect(()=> {
          if (!userInfo) {
            navigate('/login/')
          }

        dispatch(listPosts())
      }, [dispatch, successLike])


  return (
    <div>
      <h1>Пости</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
          <MDBRow className='row-cols-1 row-cols-md-2 g-4'>
          {Array.isArray(posts) && posts.map((post) => (
            <MDBCol key={post.id}>
              
              <MDBCard style={{ maxWidth: '540px', marginRight: '10px', marginBottom: '10px'}}>
                {post.image &&   <MDBCardImage
                 src={`${post.image}`}
                  alt={post.title}
                  position='top'
                />}
              
                <MDBCardBody>
                <Link to={`/post/${post.id}`}>
                  <MDBCardTitle>{post.title}</MDBCardTitle>
                </Link>
                  <MDBCardText>{post.description.slice(0, 255)}</MDBCardText>
                  <MDBCardText>{post.created_at.substring(0,10)}</MDBCardText>
                  <MDBCardText>автор: {post.user.username}</MDBCardText>
                  <MDBCardText>
                
                  <Button
                    className={post.is_liked ? "btn btn-danger" : "btn btn-primary"}
                    onClick={() => dispatch(likePost(post.id))}
                  >
                       
                    <i className="fa-regular fa-heart"></i> : {post.like_count}
                    </Button> 
                    </MDBCardText>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))}
        </MDBRow>
      
      )}
    
    </div>
  );
}



export default React.memo(HomeScreens); 


