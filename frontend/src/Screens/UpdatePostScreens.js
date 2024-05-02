import {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom'
import {  useNavigate } from 'react-router-dom';
import {Form, Button} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import axios from 'axios';
import { detailPost, updatePost } from '../actions/postActions';
import { POST_UPDATE_RESET } from '../constants/postConstants';


function UpdatePostScreens() {
    const params = useParams();
    const postId = params.id
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [image, setImage] = useState('')
    const [fileTypeError, setFileTypeError] = useState('');
    const [uploading, setUploading] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate();

    
    const postDetail = useSelector(state => state.postDetail)
    const {error, loading, post} = postDetail
    
    const postUpdate = useSelector(state => state.postUpdate)
    const {error: errorUpdate, loading: loadingUpdate, success: successUpdate} = postUpdate


    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

  

    useEffect(() => {
        if (successUpdate) {
          dispatch({ type: POST_UPDATE_RESET });
          navigate('/mylistpost');
        } else {
          if (!post || !post.title || post.id !== Number(postId)) {
            dispatch(detailPost(postId));
          } else {
            setTitle(post.title);
            setDescription(post.description);
            setImage(post.image);
            setCategory(post.category);
          }
        }
      }, [dispatch, post, postId, navigate, successUpdate, image, fileTypeError]);

    
 
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updatePost({
            id: postId,
            title,
            description,
            image,
            category,
        }))
        }

      
    
    const uploadFileHandler = async (e) => {
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const file = e.target.files[0]
      
      if (file && allowedImageTypes.includes(file.type)) {
          const formData = new FormData()

          formData.append('image', file)
          formData.append('post_id', postId)

          setUploading(true)

          try {
              const config = {
                  headers: {
                      'Content-Type': 'multipart/form-data',
                  }
              }

              const {data} = await axios.post('http://127.0.0.1:8000/api/posts/upload-image/', formData, config)

              setImage(data)
              setFileTypeError(null);
              setUploading(false)

          } catch(error) {
              setUploading(false)
          }
      } else {
        
        setFileTypeError(`Непідтримуваний тип файлу "${file.name}". Загрузіть, будь ласка, зоображення.`)
      
      }
       
    }

    if (userInfo && post  && userInfo.id !== post.user.id) {
      return (
        <Message variant="danger">Ви не є власником цього поста!</Message>
      )
    }

  
    
    
  return (
    <div>
         <Link to="/" className="btn btn-light my-3">Повернутися назад</Link>

            <h1>Редагувати Пост</h1>
            {loadingUpdate && <Loader/>}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            {fileTypeError && <Message variant="danger">{fileTypeError}</Message>}
            {loading ? <Loader/> : error ? <Message variant="danger">{error}</Message>: (
                 
                 <Form onSubmit={submitHandler}>
                 <Form.Group controlId='title'>
                         <Form.Label>Назва</Form.Label>
                         <Form.Control  type='title' placeholder='Введіть заголовок' value={title}
                         onChange={(e) => setTitle(e.target.value)}
                         ></Form.Control>
             </Form.Group>

         
             <Form.Group controlId='description'>
                         <Form.Label>Опис</Form.Label>
                         <Form.Control   as="textarea" type='textarea' placeholder='enter description' value={description}
                         onChange={(e) => setDescription(e.target.value)}
                         ></Form.Control>
             </Form.Group>

                <Form.Group controlId='image'>
                             <Form.Label>Image</Form.Label>
                             <Form.Control  type='text' placeholder='enter image' value={image}
                             onChange={(e) => setImage(e.target.value)}
                             ></Form.Control>
                        <Form.Group controlId="formFile" className="mb-3" onChange={uploadFileHandler}>
                            <Form.Control type="file"/>
                        </Form.Group>
                        {uploading && <Loader/>}
                </Form.Group>





                <Form.Group controlId='category'>
                             <Form.Label>Category</Form.Label>
                             <Form.Control  type='text' placeholder='enter category' value={category}
                             onChange={(e) => setCategory(e.target.value)}
                             ></Form.Control>
                </Form.Group>

              
 
                 <br></br>
 
                     <Button type='submit' disabled={fileTypeError} variant='btn btn-dark' onClick={submitHandler}>Update</Button>
 
                     
                 </Form>
            )}

     
            
    </div>
    
  )
} 

export default UpdatePostScreens