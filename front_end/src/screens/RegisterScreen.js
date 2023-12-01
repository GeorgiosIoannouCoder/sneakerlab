import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Form, Button, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../actions/userActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'

function RegisterScreen({location, history}) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const redirect = location.search ? location.search.split('=')[1] : '/'
    const userRegister = useSelector(state => state.userRegister)
    const {error, loading, userInfo} = userRegister

    useEffect(() => {
        if (userInfo) {
            history.push(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        if(password !== confirmPassword){
            setMessage('Passwords do not match!')
        }
        else{
            dispatch(register(name, email, password))
        }
    }

  return (
    <FormContainer>
        <Container>
            <Row>
                <Col></Col>
                <Col xs={8}>
                    <h1>
                        <strong>
                            Sign In
                        </strong>
                    </h1>
                </Col>
            </Row>
        </Container>
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader/>}
        <Form onSubmit = {submitHandler}>
            <Form.Group controlId='name' className='py-2'>
                <Form.Label>
                    <h5>
                        Name
                    </h5>
                </Form.Label>
                <Form.Control required type='name' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId='email' className='py-2'>
                <Form.Label>
                    <h5>
                        Email Address
                    </h5>
                </Form.Label>
                <Form.Control required type='email' placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId='password' className='py-2'>
                <Form.Label>
                    <h5>
                        Password
                    </h5>
                </Form.Label>
                <Form.Control required type='password' placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId='passwordConfirm' className='py-2'>
                <Form.Label>
                    <h5>
                        Confirm Password
                    </h5>
                </Form.Label>
                <Form.Control required type='password' placeholder='Please Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
            </Form.Group>
            <Button type='submit' variant='primary'>
                    <h6>Join the SneakerLab family!</h6>
            </Button>
        </Form>
        <Row className='py-3'>
            <Col>
                <strong>Already a SneakerLab Member?</strong>
                    <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                        <i>Sign in</i>
                    </Link>
            </Col>
        </Row>
    </FormContainer>
  )
}

export default RegisterScreen