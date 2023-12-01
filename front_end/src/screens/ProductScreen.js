import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProductDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

function ProductScreen({ match, history }) {
  const [quantity, setQuantity] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('') 
  const dispatch = useDispatch()
  const productDetails = useSelector(state => state.productDetails)
  const {loading, error, product} = productDetails
  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin
  const productReviewCreate = useSelector(state => state.productReviewCreate)
  const {loading:loadingProductReview, error:errorProductReview, success:successProductReview} = productReviewCreate

  useEffect(() => {
    if(successProductReview){
      setRating(0)
      setComment('')
      dispatch({type:PRODUCT_CREATE_REVIEW_RESET})
    }
    dispatch(listProductDetails(match.params.id))
  }, [dispatch, match, successProductReview])

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id} ? quantity=${quantity}`)
  }
  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(match.params.id, {rating, comment}))
  }

  return (
    <div>
      <Link to='/' className='btn btn-light my-3 btn-outline-primary'>
        <h4>
          <strong>
            Return to Home Page
          </strong>
        </h4>
      </Link> 
      {
        loading ? <Loader/>
        : error ? <Message variant='danger'>{error}</Message>
        :(
          <div>
            <Row>
              <Col md={9}>
                <Image src={product.image} alt={product.name} fluid/>
              </Col>
              <Col md={3}>
                <Card className="rounded my-3">
                  <ListGroup variant='flush'>
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <h4>
                            Price:
                          </h4>
                        </Col>
                        <Col>
                         <h4>
                          <strong>${product.price}</strong>
                         </h4>
                       </Col>
                     </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <h4>
                            Status:
                          </h4>
                        </Col>
                        <Col>
                          <h4>
                            <strong>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</strong>
                          </h4>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                      {product.countInStock > 0 && (
                        <ListGroup.Item>
                          <Row>
                            <Col>
                              <h4>
                                Quantity:
                              </h4>
                              <h6>
                                <strong>
                                  (Please click box)
                                </strong>
                              </h6>
                            </Col>
                            <Col xs='auto' className='my-1'>
                              <Form.Control as="select" value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                                {
                                  [...Array(product.countInStock).keys()].map((x) =>(
                                    <option key={x + 1} value={x + 1}>
                                      {x + 1}
                                    </option>
                                  ))
                                }
                              </Form.Control>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      )}
                      <ListGroup.Item>
                        <Row>
                          <Col>
                            <h4>
                              Size:
                            </h4>
                          </Col>
                          <Col>
                            <h4>
                              <strong>{product.size}</strong>
                            </h4>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Button onClick={addToCartHandler} className='btn-block' disabled={product.countInStock === 0} type='button'>
                          <i class="fa-solid fa-cart-plus"></i>
                          <h4>
                            <strong>Add to Cart</strong>
                          </h4>
                        </Button>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card>
                </Col>
                <Col md={9}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <h3>
                        <strong>{product.name}</strong>
                      </h3>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'}/>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <h4>
                        <strong>Description:</strong>
                      </h4>
                      {product.description}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
            </Row>
            <Row>
              <Col md={6} className='mt-3'>
                <h3>
                  <i>Reviews</i>
                </h3>
                {product.reviews.length === 0 && <Message variant='info'>No reviews</Message>}
                <ListGroup variant='flush'>
                  {product.reviews.map((review) => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating value={review.rating} color='#f8e825'/>
                      <p>{review.comment}</p>
                      <h6><strong>Date: {review.createdAt.substring(0,10) + ' ' + review.createdAt.substring(11,19)}</strong></h6>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item>
                    <h3 className="text-center">
                      Write A Review
                    </h3>
                    {loadingProductReview && <Loader/>}
                    {successProductReview && <Message variant='success'>Review successfully submitted</Message>}
                    {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}
                    {userInfo ? (
                      <Form onSubmit={submitHandler}>
                        <Form.Group controlId='rating'>
                          <Form.Label>
                            <h4><strong>Select Rating</strong></h4>
                          </Form.Label>
                          <Form.Control as='select' value={rating} onChange={(e) => setRating(e.target.value)}>
                            <option value=''>Select...</option>
                            <option value='1'>1 - Bad</option>
                            <option value='2'>2 - Okay</option>
                            <option value='3'>3 - Good</option>
                            <option value='4'>4 - Great</option>
                            <option value='5'>5 - Excellent</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='comment'>
                          <Form.Label>
                            <h4 className='my-3'><strong>Comment Review</strong></h4>
                          </Form.Label>
                          <Form.Control as='textarea' row='5' value={comment} placeholder='Comment...' onChange={(e) => setComment(e.target.value)}>
                          </Form.Control>
                        </Form.Group>

                        <Button disabled={loadingProductReview} type='submit' variant='primary' className='my-3'>
                          <h6>Submit</h6>
                        </Button>
                      </Form>
                    ) : (
                      <h6><strong><Message variant='info'>Please <Link to='/login'>login</Link> to write a review</Message></strong></h6>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </div>
          )
        }
    </div>
  )
}

export default ProductScreen