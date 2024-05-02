import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom';
import {Form, Button, Row, Col} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';

import {login} from '../actions/userActions';


function LoginScreens() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    const location = useLocation();
    const navigate = useNavigate();
    const redirect = location.search ? location.search.split("=")[1] : '/'

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }

    const userLogin = useSelector(state => state.userLogin)
    const {error, loading, userInfo} = userLogin

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, userInfo, redirect])

    return (
        <div>
            <h1>Sign In</h1>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader/>}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='username'>
                    <Form.Label>username</Form.Label>
                    <Form.Control type='text' placeholder='enter username' value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>password</Form.Label>
                    <Form.Control type='password' placeholder='enter password' value={password} autoComplete='on'
                    onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group><br></br>

                <Button type='submit' variant='btn btn-dark'>Sign In</Button>
            </Form>

            <Row className='py-3'>
                <Col>
                    New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
                </Col>
            </Row>
        </div>
    )
}

export default LoginScreens