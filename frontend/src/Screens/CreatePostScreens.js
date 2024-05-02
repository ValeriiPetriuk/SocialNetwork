import {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import {Form, Button} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';

import { createPost } from '../actions/postActions';


function CreatePostScreens() {
    const params = useParams();
    const postId = params.id
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [image, setImage] = useState('')
    // const [uploading, setUploading] = useState(false)
    
    const dispatch = useDispatch()

    const navigate = useNavigate();
    
    
    const postCreate = useSelector(state => state.postCreate)
    const {loading, error, success, post} = postCreate   


    useEffect(() => {

        if (success) {
            navigate('/')
        }
        
    }, [dispatch,post, postId, navigate, success]) 

 
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createPost(title, description, category, image))
        }


    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };


     
    
  return (
    <div>
       <Link to="/" className="btn btn-light my-3">Повернутися назад</Link>

            <h1>Створити пост</h1>
        
            {loading ? <Loader/> : error ? <Message variant="danger">{error}</Message>: (
                    <Form onSubmit={submitHandler}>
                    <Form.Group controlId='title'>
                            <Form.Label>Назва</Form.Label>
                            <Form.Control  type='title' placeholder='enter name' value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            ></Form.Control>
                </Form.Group>

            
                <Form.Group controlId='description'>
                            <Form.Label>Опис</Form.Label>
                            <Form.Control   as="textarea" type='textarea' placeholder='enter description' value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            ></Form.Control>
                </Form.Group>

                <Form.Group controlId="image">
                <Form.Label>Image</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="enter image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    ></Form.Control>
                <Form.Group controlId="formFile" className="mb-3">
                <Form.Control type="file" onChange={handleImageUpload} /> {/* Додайте обробник зміни значення поля вибору файлу */}
                </Form.Group>
                {/* {uploading && <Loader />} */}
            </Form.Group>
           

            <Form.Group controlId='category'>
                        <Form.Label>Category</Form.Label>
                        <Form.Control  type='text' placeholder='enter category' value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        ></Form.Control>
            </Form.Group>
                <br></br>
                <Button type='submit' variant='btn btn-dark' onClick={submitHandler}>Створоти</Button>
            </Form>
            
            ) }
                 
               
    </div>
    
  )
} 

export default CreatePostScreens