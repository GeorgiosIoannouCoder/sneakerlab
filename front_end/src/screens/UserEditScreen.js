import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_UPDATE_RESET } from '../constants/userConstants'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'

function UserEditScreen({match, history}) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    const userId = match.params.id
    const dispatch = useDispatch()
    const userDetails = useSelector(state => state.userDetails)
    const {error, loading, user} = userDetails
    const userUpdate = useSelector(state => state.userUpdate)
    const {error:errorUpdate, loading:loadingUpdate, success:successUpdate} = userUpdate

    useEffect(() => {
        if(successUpdate){
            dispatch({type:USER_UPDATE_RESET})
            history.push('/admin/userlist')
        }
        else{
            if((!user.name || user._id) !== Number(userId)){
                dispatch(getUserDetails(userId))
            }
            else{
                setName(user.name)
                setEmail(user.email)
                setIsAdmin(user.isAdmin)
            }
        }
    }, [user, userId, successUpdate, history])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({_id:user._id, name, email, isAdmin}))
    }

  return (
    <div>
        <Link to='/admin/userlist' className='btn btn-light my-3 btn-outline-primary'>
            <h4>
                <strong>
                    Go Back to User List
                </strong>
            </h4>
        </Link>
        <FormContainer>
            <Container>
                <Row>
                    <Col></Col>
                    <Col xs={8}>
                        <h1>
                            <strong>
                                Edit User
                            </strong>
                        </h1>
                    </Col>
                </Row>
            </Container>
            {loadingUpdate && <Loader/>}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            {loading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> : (
                <Form onSubmit = {submitHandler}>
                    <Form.Group controlId='name' className='py-2'>
                        <Form.Label>
                            <h5>
                                Name
                            </h5>
                        </Form.Label>
                        <Form.Control type='name' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='email' className='py-2'>
                        <Form.Label>
                            <h5>
                                Email Address
                            </h5>
                        </Form.Label>
                        <Form.Control type='email' placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                    </Form.Group>
                    <h5>
                        <strong>
                            <Form.Group controlId='isadmin' className='py-2'>
                                <Form.Check type='checkbox' label='Is Admin' checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)}></Form.Check>
                            </Form.Group>
                        </strong>
                    </h5>
                    <Button type='submit' variant='primary'>
                        <h5>Update User</h5>
                    </Button>
                </Form>
            )}
            
        </FormContainer>
      </div>
  )
}

export default UserEditScreen