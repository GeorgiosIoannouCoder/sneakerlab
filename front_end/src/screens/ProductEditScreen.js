import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import axios from 'axios'

function ProductEditScreen({match, history}) {
    const productId = match.params.id
    const [price, setPrice] = useState(0)
    const [category, setCategory] = useState('')
    const [brand, setBrand] = useState('')
    const [name, setName] = useState('')
    const [image, setImage] = useState('')
    const [description, setDescription] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [size, setSize] = useState('')
    const [uploading, setUploading] = useState(false)
    const dispatch = useDispatch()
    const productDetails = useSelector(state => state.productDetails)
    const {error, loading, product} = productDetails
    const productUpdate = useSelector(state => state.productUpdate)
    const {error:errorUpdate, loading:loadingUpdate, success:successUpdate} = productUpdate

    useEffect(() => {
        if(successUpdate){
            dispatch({type:PRODUCT_UPDATE_RESET})
            history.push('/admin/productlist')
        }
        else{
            if((!product.name || product._id) !== Number(productId)){
                dispatch(listProductDetails(productId))
            }
            else{
                setPrice(product.price)
                setCategory(product.category)
                setBrand(product.brand)
                setName(product.name)
                setImage(product.image)
                setDescription(product.description)
                setCountInStock(product.countInStock)
                setSize(product.size)
            }   
        }  
    }, [dispatch, product, productId, history, successUpdate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateProduct({_id:productId, price, category, brand, name, image, description, countInStock, size}))
    }

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        formData.append('product_id', productId)
        setUploading(true)
        try{
            const config = {
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            }
            const {data} = await axios.post('/api/products/upload/', formData, config)
            setImage(data)
            setUploading(false)
        }catch(error){
            setUploading(false)
        }
    }
  return (
    <div>
        <Link to='/admin/productlist' className='btn btn-light my-3 btn-outline-primary'>
            <h4>
                <strong>
                    Go Back to Product List
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
                                Edit Product
                            </strong>
                        </h1>
                    </Col>
                </Row>
            </Container>
            {loadingUpdate && <Loader/>}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            {loading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> : (
                <Form onSubmit = {submitHandler}>
                    <Form.Group controlId='price' className='py-2'>
                        <Form.Label>
                            <h5>
                                Price
                            </h5>
                        </Form.Label>
                        <Form.Control type='number' placeholder='Enter Price' value={price} onChange={(e) => setPrice(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='category' className='py-2'>
                        <Form.Label>
                            <h5>
                                Category
                            </h5>
                        </Form.Label>
                        <Form.Control type='text' placeholder='Enter Category' value={category} onChange={(e) => setCategory(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='brand' className='py-2'>
                        <Form.Label>
                            <h5>
                                Brand
                            </h5>
                        </Form.Label>
                        <Form.Control type='text' placeholder='Enter Brand' value={brand} onChange={(e) => setBrand(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='name' className='py-2'>
                        <Form.Label>
                            <h5>
                                Name
                            </h5>
                        </Form.Label>
                        <Form.Control type='name' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='image' className='py-2'>
                        <Form.Label>
                            <h5>
                                Image
                            </h5>
                        </Form.Label>
                        <Form.Control type='text' placeholder='Enter Image' value={image} onChange={(e) => setImage(e.target.value)}></Form.Control>
                        <input type="file" id='image-file'accept="image/png, image/jpeg" onChange={uploadFileHandler}></input>
                        {uploading && <Loader/>}
                    </Form.Group>
                    <Form.Group controlId='description' className='py-2'>
                        <Form.Label>
                            <h5>
                                Description
                            </h5>
                        </Form.Label>
                        <Form.Control type='text' placeholder='Enter Description' value={description} onChange={(e) => setDescription(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='countInStock' className='py-2'>
                        <Form.Label>
                            <h5>
                                In Stock
                            </h5>
                        </Form.Label>
                        <Form.Control type='number' placeholder='Enter Stock Quantity' value={countInStock} onChange={(e) => setCountInStock(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='size' className='py-2'>
                        <Form.Label>
                            <h5>
                                Size
                            </h5>
                        </Form.Label>
                        <Form.Control type='text' placeholder='Enter Size' value={size} onChange={(e) => setSize(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Button type='submit' variant='primary'>
                        <h5>Update Product</h5>
                    </Button>
                </Form>
            )}
            
        </FormContainer>
      </div>
  )
}

export default ProductEditScreen