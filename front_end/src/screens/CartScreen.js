import React, {useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import { addToCart, removeFromCart } from '../actions/cartActions'
import Message from '../components/Message'

function CartScreen({match, location, history}) {
  const productId = match.params.id
  const quantity = location.search ? Number(location.search.split('=')[1]) : 1
  const dispatch = useDispatch()
  const cart = useSelector(state => state.cart)
  const {cartItems} = cart

  useEffect(() => {
    if(productId){
      dispatch(addToCart(productId,quantity))
    }
  }, [dispatch, productId, quantity])

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping')
  }

  return (
    <Row>
        <Col md={8}>
          <h1>
            <strong>
              My SneakerLab Cart
            </strong>
          </h1>
          <h6>
            Review your items
          </h6>
          {
          cartItems.length === 0 ? (
            <Message variant='info'>
              <h2>
                Your SneakerLab Cart is empty <Link to='/'><strong>Go Back</strong></Link>
              </h2>
            </Message>
          ) : (
            <ListGroup variant = 'flush'>
              {cartItems.map(item => (
                <ListGroup.Item key={item.product}>
                  <Row>
                    <Col md={2}>
                      <Link to={`/product/${item.product}`}><Image src={item.image} alt={item.name} fluid rounded/></Link>
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>
                      <h5>
                        <strong>
                          ${item.price}
                        </strong>
                      </h5>
                    </Col>
                    <Col md={3}>
                      <Form.Control as="select" value={item.quantity} onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}>
                        {
                          [...Array(item.countInStock).keys()].map((x) =>(
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))
                        }
                        </Form.Control>
                    </Col>
                    <Col md={1}>
                      <Button type='button' variant='light' onClick={() => removeFromCartHandler(item.product)}>
                        <i className='fas fa-trash'></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )
          }
          <Col md={4}>
          </Col>
        </Col>
        <Col md={4}>
          <Card className="rounded">
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <h2>
                      Subtotal <strong>({cartItems.reduce((temp, item) => temp + item.quantity, 0)})</strong> items
                    </h2>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <h5>
                      <strong>
                        ${cartItems.reduce((temp, item) => temp + item.quantity * item.price, 0).toFixed(2)}
                      </strong>
                    </h5>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <Link to='/'>
                      <Button type='button' className='btn-block'>
                        <h6>Continue Shopping</h6>
                      </Button>
                    </Link>
                    <Button type='button' className='btn-block' disabled={cartItems.length === 0} onClick={checkoutHandler}>
                      <h6>Go to Checkout</h6>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
    </Row>
  )
}

export default CartScreen