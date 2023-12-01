import React, {useEffect} from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listUsers, deleteUser } from '../actions/userActions'

function UserListScreen({history}) {
    const dispatch = useDispatch()
    const userList = useSelector(state => state.userList)
    const {loading, error, users} = userList
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin
    const userDelete = useSelector(state => state.userDelete)
    const {success:successDelete} = userDelete
    
    useEffect(() => {
        if(userInfo && userInfo.isAdmin){
            dispatch(listUsers())
        }
        else{
            history.push('/login')
        }
    }, [dispatch, history, successDelete, userInfo])

    const deleteHandler = (id) => {
        if(window.confirm('You are going to delete the user with id: ' + id.toString() + '. Proceed?')){
            dispatch(deleteUser(id))
        }
    }
  return (
    <div>
        <h1>
            <strong>
                Users
            </strong>
        </h1>
        {loading ? (<Loader/>) : error ? (<Message variant='danger'>{error}</Message>) : (
        <Table striped hover responsive className='table-sm'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Admin?</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.isAdmin ? (
                            <i className='fas fa-check' style={{color : 'green'}}></i>
                        ) : (
                            <i className='fas fa-xmark' style={{color : 'red'}}></i>
                        )}</td>
                        <td>
                            <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                <Button variant='dark' className='btn-sm'>
                                    <i class="fa-solid fa-user-pen"></i>
                                </Button>
                            </LinkContainer>
                            {' '}
                            <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(user._id)}>
                                <i class="fa-solid fa-trash-can"></i>
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>)}
    </div>
  )
}

export default UserListScreen