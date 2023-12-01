import React, {useState} from 'react'
import { Col, Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { savePaymentMethod } from '../actions/cartActions'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'

function PaymentScreen({history}) {
    const cart = useSelector(state => state.cart)
    const {shippingAddress} = cart
    const dispatch = useDispatch()
    const [paymentMethod, setPaymentMethod] = useState('PayPal')

    if(!shippingAddress.address){
        history.push('/shipping')
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        history.push('/placeorder')
    }

  return (
    <FormContainer>
        <CheckoutSteps step1 step2 step3/>
        <Form onSubmit={submitHandler}>
            <Form.Group>
                <Form.Label as='legend'>
                    <h1 className="text-center">
                        <strong>
                            Select Payment Method
                        </strong>
                    </h1>
                </Form.Label>
                <Col>
                    <h4>
                        <Form.Check type='radio' label='Paypal or Credit Card' id='paypal' name='paymentMethod' checked onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>
                    </h4>
                </Col>
            </Form.Group>
            <Button type='submit' variant='primary'>
                <h6>Next Step</h6>
            </Button>
        </Form>
    </FormContainer>
  )
}

export default PaymentScreen