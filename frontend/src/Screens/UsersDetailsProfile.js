import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetail, updateUserProfile } from '../actions/userActions';
import {  useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {Form, Button, Image,  Table} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import { Link } from "react-router-dom"
import {  USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import axios from 'axios';
import { Row, Col,} from "react-bootstrap"
import { deletePost, listMyPost } from '../actions/postActions';


function UsersDetailsProfile() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [email, setEmail] = useState('')
    const [image, setImage] = useState('')
    const [message, setMessage] = useState('')
    const [fileTypeError, setFileTypeError] = useState('');

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    const userDetailsProfile = useSelector(state => state.userDetailsProfile)
    const {error, loading, user, success: successDetails} = userDetailsProfile

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const {success} = userUpdateProfile

    const postDelete = useSelector(state => state.postDelete)
    const {loading: loadingDelete, error:errorDelete, success: successDelete} = postDelete

    const myListPost = useSelector(state => state.myListPost)
    const {loading: loadingMyListPost, error: errorMyListPost, success: successPostList, posts} = myListPost

    useEffect(() => {
    
        if (!userInfo) {
            navigate("/login")
        } else {
            if(!user || !user.username || success || userInfo.id !== user.id) {
                dispatch({type: USER_UPDATE_PROFILE_RESET})
                dispatch(getUserDetail())
                
            }else {
                dispatch(listMyPost())
                setUsername(user.username)
                setEmail(user.email)
                
            }
         }
    }, [dispatch, navigate, userInfo, successDelete, success, user, successPostList])

    const submitHandler = (e) => {
        e.preventDefault()
        if (confirmPassword !== password) {
            setMessage("Паролі не співпадають!")
        }  else {
            dispatch(updateUserProfile({
                id: user.id,
                username,
                email,
                password,
            }))
        }  
       
      
    }

    const handleImage = (e) => {
        e.preventDefault();
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const selectedImage = e.target.files[0];
        if (selectedImage && allowedImageTypes.includes(selectedImage.type)) {
            setImage(selectedImage);
        
            const formData = new FormData();
            formData.append('image', selectedImage);
          
            const config = {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${userInfo.token}`,
              }
            };
          
            axios.post('http://127.0.0.1:8000/api/users/upload-image/', formData, config)
              .then(res => {
                setFileTypeError(null);
              }).catch(err => console.log(err));
        } else{
            setFileTypeError(`Непідтримуваний тип файлу "${selectedImage.name}". Загрузіть, будь ласка, зоображення.`)
        }
       
      };


      const deleteHandler = (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цей пост?')) {
            dispatch(deletePost(id))
        } 
      }
    

  return (
    <Row>
    <h1>Редагувати профіль</h1>
    <Col md={5}>

                {error && <Message variant='danger'>{error}</Message>}
                {loading && <Loader/>}
                {message && <Message variant='danger'>{message}</Message>}
                {fileTypeError && <Message variant="danger">{fileTypeError}</Message>}
        <Image
          src={`http://127.0.0.1:8000${user.avatar}`}
          style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
          className='center-img'
        /><br></br>
      <Form.Group controlId="formFile" className="mb-3" onChange={handleImage}>
        <Form.Control type="file" className='center-img' style={{ width: '140px', height: "auto" }}/>
      </Form.Group>
      

  <Form onSubmit={submitHandler}>
      <Form.Group controlId='username'>
              <Form.Label>Ім'я користувача</Form.Label>
              <Form.Control type='name' placeholder='enter name' value={username}
              onChange={(e) => setUsername(e.target.value)}
              ></Form.Control>
      </Form.Group>

      <Form.Group controlId='email'>
              <Form.Label>email</Form.Label>
              <Form.Control  type='email' placeholder='enter email' value={email}
              onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
      </Form.Group>


      <Form.Group controlId='password'>
              <Form.Label>Новий пароль</Form.Label>
              <Form.Control  type='password' placeholder='enter password' value={password} autoComplete='on'
              onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
      </Form.Group>

      <Form.Group controlId='passwordConfirm'>
              <Form.Label>Підтвердити пароль</Form.Label>
              <Form.Control  type='password' placeholder='enter password' value={confirmPassword} autoComplete='on'
              onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
      </Form.Group><br></br>

  <br></br>
  <Button type='submit' variant='btn btn-dark' onClick={submitHandler}>Редагувати</Button>
  </Form>
    </Col>
   
    <Col md={7}>
                <h2>Мої пости</h2>
                {loadingMyListPost ? (
                    <Loader/>
                ): errorMyListPost ? (
                    <Message variant="danger">{errorMyListPost}</Message>
                ):
                !posts.length ?   (
                    <div>Ти ще не створив жодного поста!
                        Нажимай кнопку "створити пост", щоб створити свій перший пост.<br/>
                        <Link to="/create-post" className="btn btn-light my-3">створити пост</Link>
                    </div>
                ):
                (
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
                      {posts.map(post => (
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
              
                )}
            </Col>
  
    </Row>

  )
}

export default UsersDetailsProfile