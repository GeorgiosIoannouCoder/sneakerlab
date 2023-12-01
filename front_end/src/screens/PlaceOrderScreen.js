import React, {useEffect} from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createOrder } from '../actions/orderActions'
import CheckoutSteps from '../components/CheckoutSteps'
import Message from '../components/Message'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'


function PlaceOrderScreen({history}) {
    const cart = useSelector(state => state.cart)
    const dispatch = useDispatch()
    const orderCreate = useSelector(state => state.orderCreate)
    const {order, error, success} = orderCreate
    cart.itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price *item.quantity, 0).toFixed(2)

    if(!cart.paymentMethod){
        history.push('/payment')
    }

    useEffect(() => {
        if(success){
            history.push(`/order/${order._id}`)
            dispatch({type: ORDER_CREATE_RESET})
        }
    }, [success, history])
    
    const placeOrder = () => {
        dispatch(createOrder({orderItems:cart.cartItems, shippingAddress:cart.shippingAddress, paymentMethod:cart.paymentMethod, itemsPrice:cart.itemsPrice, shippingPrice:cart.shippingPrice, taxPrice:cart.taxPrice, totalPrice:cart.totalPrice}))
    }

    
    if(cart.itemsPrice > 300){
        cart.shippingPrice = (0).toFixed(2)
    }
    else if (cart.itemsPrice > 200){
        cart.shippingPrice = (10).toFixed(2)
    }
    else if (cart.itemsPrice > 100){
        cart.shippingPrice = (20).toFixed(2)
    }
    else{
        cart.shippingPrice = (30).toFixed(2)
    }

    if(cart.itemsPrice < 110){
        cart.taxPrice = (0).toFixed(2)
    }
    else{
        cart.taxPrice = Number((0.085) * cart.itemsPrice).toFixed(2)
    }

    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)

  return (
    <div>
        <CheckoutSteps step1 step2 step3 step4/>
        <Row>
            <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <p>
                            <h3>
                                Shipping
                            </h3>
                            <h4>
                                <strong>
                                    {cart.shippingAddress.address}, {cart.shippingAddress.zipCode}
                                    {'  '}
                                    {cart.shippingAddress.city},
                                    {'  '}
                                    {cart.shippingAddress.country}
                                </strong>
                            </h4>
                        </p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <p>
                            <h3>
                                Payment Method
                            </h3>
                            <h4>
                                <strong>
                                     {cart.paymentMethod}
                                </strong>
                            </h4>
                        </p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h3>
                            My SneakerLab Cart
                        </h3>
                        {cart.cartItems.length === 0 ? (
                        <h2><Message variant='info'>Your SneakerLab cart is empty</Message></h2>) : (
                            <ListGroup variant='flush'>
                                {cart.cartItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={2}>
                                                <Link to={`/product${item.product}`}>
                                                    <Image src={item.image} alt={item.name} fluid rounded/>
                                                </Link>
                                            </Col>
                                            <Col>
                                                <Link to={`/product${item.product}`}>
                                                    {item.name}
                                                </Link>
                                            </Col>
                                            <Col md={4}>
                                                <h6><strong>{item.quantity} X ${item.price} = ${(item.quantity * item.price).toFixed(2)}</strong></h6>
                                            </Col>

                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={4}>
                <Card className="rounded">
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    <h6><strong>Items:</strong></h6>
                                </Col>
                                <Col>
                                    <h6><strong>${cart.itemsPrice}</strong></h6>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    <h6><strong>Shipping:</strong></h6>
                                </Col>
                                <Col>
                                    <h6><strong>${cart.shippingPrice}</strong></h6>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    <h6><strong>Tax:</strong></h6>
                                </Col>
                                <Col>
                                    <h6><strong>${cart.taxPrice}</strong></h6>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    <h6><strong>Total:</strong></h6>
                                </Col>
                                <Col>
                                    <h6><strong>${cart.totalPrice}</strong></h6>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            {error && <Message variant='danger'>{error}</Message>}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button type='button' className='btn-block' disable={cart.cartItems === 0} onClick={placeOrder}>
                                <h3>Place Order</h3>
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
            <Col></Col>
            <Col md={5}>
                <div class="alert alert-info mt-3">
                    <h6>
                        <strong>
                            How shipping and tax costs are calculated
                        </strong>
                    </h6>
                    <u>Shipping Cost:</u>
                    <li>$0 for purchases greater than $300</li>
                    <li>$10 for purchases greater than $200 and less than $300</li>
                    <li>$20 for purchases greater than $100 and less than $200</li>
                    <li>$30 for purchases less than $100</li>
                    <u>Tax Cost:</u>
                    <li>Footwear under $110 are exempt from tax</li>
                    <li>Purchases above $110 are subject to a 8.5% sales tax</li>
                </div>   
            </Col>
        </Row>
    </div>
  )
}

export default PlaceOrderScreen