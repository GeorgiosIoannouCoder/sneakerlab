import React, {useState, useEffect} from 'react'
import { Row, Col, Form, Button, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import { listMyOrders } from '../actions/orderActions'

function ProfileScreen({history}) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const userDetails = useSelector(state => state.userDetails)
    const {error, loading, user} = userDetails
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin
    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const {success} = userUpdateProfile
    const orderListMy = useSelector(state => state.orderListMy)
    const {loading:loadingOrders, error:errorOrders, orders} = orderListMy

    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        }
        else if(!user || !user.name || success || userInfo._id !== user._id){
            dispatch({type:USER_UPDATE_PROFILE_RESET})
            dispatch(getUserDetails('profile'))
            dispatch(listMyOrders())
        }
        else{
            setName(user.name)
            setEmail(user.email)
        }
    }, [dispatch, history, userInfo, user , success])

    const submitHandler = (e) => {
        e.preventDefault()
        if(password !== confirmPassword){
            setMessage('Passwords do not match!')
        }
        else{
            dispatch(updateUserProfile({'id':user._id, 'name':name, 'email':email, 'password':password}))
            setMessage('')
        }
    }

  return (
    <Row>
        <Col md={4}>
            <h2>
                <strong>
                    My SneakerLab Profile
                </strong>
            </h2>
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
                    <Form.Control type='password' placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId='passwordConfirm' className='py-2'>
                    <Form.Label>
                        <h5>
                            Confirm Password
                        </h5>
                    </Form.Label>
                    <Form.Control type='password' placeholder='Please Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <Button type='submit' variant='primary'>
                    <h6>Update</h6>
                </Button>
            </Form>
        </Col>
        <Col md={8}>
            <h2 className="text-center">
                <strong>
                    My SneakerLab Orders
                </strong>
            </h2>
            {loadingOrders ? (
                <Loader/>
            ) : errorOrders ? (
                <Message variant='danger'>{errorOrders}</Message>
            ) : (
                <Table striped hover responsive className='table-sm'>
                    
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Paid</th>
                            <th>Delivered</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.createdAt.substring(0,10)} {order.createdAt.substring(11,19)}</td>
                                <td>${order.totalPrice}</td>
                                <td>{order.isPaid ? (order.paidAt.substring(0,10) + ' ' + order.paidAt.substring(11,19)) : (<i className='fas fa-times' style={{color: 'red'}}></i>)}</td>
                                <td>
                                    <LinkContainer to={`/order/${order._id}`}>
                                        <Button type='button' className='btn-sm'>
                                            <h6>Details</h6>
                                        </Button>
                                    </LinkContainer>
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

export default ProfileScreen