import React, {useEffect} from 'react'
import { LinkContainer} from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import { Row, Col, Table, Button, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProducts, deleteProduct, createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

function ProductListScreen({match, history}) {
    const dispatch = useDispatch()
    const productList = useSelector(state => state.productList)
    const {loading, error, products} = productList
    const productDelete = useSelector(state => state.productDelete)
    const {loading:loadingDelete, error:errorDelete, success:successDelete} = productDelete
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin
    const productCreate = useSelector(state => state.productCreate)
    const {loading:loadingCreate, error:errorCreate, success:successCreate, product:createdProduct} = productCreate
    
    useEffect(() => {
        dispatch({type:PRODUCT_CREATE_RESET})

        if(!userInfo.isAdmin){
            history.push('/login')
        }

        if(successCreate){
            history.push(`/admin/product/${createdProduct._id}/edit`)
        }
        else{
            dispatch(listProducts())
        }
    }, [dispatch, history, userInfo, successDelete, successCreate, createdProduct])

    const deleteHandler = (id) => {
        if(window.confirm('You are going to delete the product with id: ' + id.toString() + '. Proceed?')){
            dispatch(deleteProduct(id))
        }
    }
    
    const createProductHandler = () => {
        dispatch(createProduct())
    }
  return (
    <div>
        <Row className='align-items-center'>
            <Col>
                <h1>
                    <strong>
                        Products
                    </strong>
                </h1>
            </Col>
            <Col className='text-center'>
                <Button className='my-3' onClick={createProductHandler}>
                    <h5>
                        Create Product
                    </h5>
                    <i className='fas fa-plus'></i> 
                </Button>
            </Col>
        </Row>
        {loadingDelete && <Loader/>}
        {errorDelete && <Message variant={'danger'}>{errorDelete}</Message>}
        {loadingCreate && <Loader/>}
        {errorCreate && <Message variant={'danger'}>{errorCreate}</Message>}
        {loading ? (<Loader/>) : error ? (<Message variant='danger'>{error}</Message>) : (
        <Table striped hover responsive className='table-sm'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Size</th>
                    <th>Image</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {products.map(product => (
                    <tr key={product._id}>
                        <td>{product._id}</td>
                        <td>${product.price}</td>
                        <td>{product.category}</td>
                        <td>{product.brand}</td>
                        <td>{product.name}</td>
                        <td>{product.countInStock}</td>
                        <td>{product.size}</td>
                        <td class="w-25"><Link to={`/product/${product._id}`}><Image src={product.image} alt={product.name} fluid rounded/></Link></td>
                        <td>
                            <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                <Button variant='dark' className='btn-sm'>
                                    <i class="fa-solid fa-pen"></i>
                                </Button> 
                            </LinkContainer> 
                            {' '}
                            <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
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

export default ProductListScreen