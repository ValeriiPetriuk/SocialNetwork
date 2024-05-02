import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom';
import {Form, Button, Row, Col} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {register} from '../actions/userActions';


function RegisterScreens() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')


    const dispatch = useDispatch()

    const location = useLocation();
    const navigate = useNavigate();
    const redirect = location.search ? location.search.split("=")[1] : '/'

    
    const userRegister = useSelector(state => state.userRegister)
    const {error, loading, userInfo} = userRegister

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage('Password do not match')
        } else {
            dispatch(register(name, email, password, username))
        }
        
    }
  return (
    <div>
          <h1>Register</h1>
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader/>}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control required type='name' placeholder='enter name' value={name}
                        onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                </Form.Group>

                <Form.Group controlId='username'>
                        <Form.Label>username</Form.Label>
                        <Form.Control required type='username' placeholder='enter username' value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        ></Form.Control>
                </Form.Group>

                <Form.Group controlId='email'>
                        <Form.Label>email</Form.Label>
                        <Form.Control required type='email' placeholder='enter email' value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                        <Form.Label>password</Form.Label>
                        <Form.Control required type='password' placeholder='enter password' value={password} autoComplete='on'
                        onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                </Form.Group>

                <Form.Group controlId='passwordConfirm'>
                        <Form.Label>confirm password</Form.Label>
                        <Form.Control required type='password' placeholder='enter password' value={confirmPassword} autoComplete='on'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        ></Form.Control>
                </Form.Group><br></br>

                <Button type='submit' variant='btn btn-dark'>Register</Button>

                <Row className='py-3'>
                    <Col>
                        Have an Account ? <Link to={'/login'}>Sign In</Link>
                    </Col>
                </Row>
            </Form>

          
    </div>
  )
}

export default RegisterScreens