import React, {useState} from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { saveShippingAddress } from '../actions/cartActions'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'

function ShippingScreen({history}) {
    const cart = useSelector(state => state.cart)
    const {shippingAddress} = cart
    const [address, setAddress] = useState(shippingAddress.address)
    const [zipCode, setZipCode] = useState(shippingAddress.zipCode)
    const [city, setCity] = useState(shippingAddress.city)
    const [country, setCountry] = useState(shippingAddress.country)
    const dispatch = useDispatch()

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({address, zipCode, city, country}))
        history.push('/payment')
    }
  
    return (
    <FormContainer>
        <CheckoutSteps step1 step2/>
        <h1 className="text-center">
            <strong>
                Shipping
            </strong>
        </h1>
        <Form onSubmit={submitHandler}>
            <Form.Group controlId='address' className='py-2'>
                <Form.Label>
                    <h5>
                        Address
                    </h5>
                </Form.Label>
                <Form.Control required type='text' placeholder='Enter Address' value={address ? address : ''} onChange={(e) => setAddress(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId='zipCode' className='py-2'>
                <Form.Label>
                    <h5>
                        Zip Code
                    </h5>
                </Form.Label>
                <Form.Control required type='text' placeholder='Enter Zip Code' value={zipCode ? zipCode : ''} onChange={(e) => setZipCode(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId='city' className='py-2'>
                <Form.Label>
                    <h5>
                        City
                    </h5>
                </Form.Label>
                <Form.Control required type='text' placeholder='Enter City' value={city ? city : ''} onChange={(e) => setCity(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId='country' className='py-2'>
                <Form.Label>
                    <h5>
                        Country
                    </h5>
                </Form.Label>
                <Form.Control required type='text' placeholder='Enter Country' value={country ? country : ''} onChange={(e) => setCountry(e.target.value)}></Form.Control>
            </Form.Group>
            <Button type='submit' variant='primary'>
                <h6>Next Step</h6>
            </Button>

        </Form>
    </FormContainer>
  )
}

export default ShippingScreen