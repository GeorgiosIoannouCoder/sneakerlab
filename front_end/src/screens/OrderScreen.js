import React, { useState, useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import { PayPalButton } from "react-paypal-button-v2";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

function OrderScreen({ match, history }) {
  const orderId = match.params.id;
  const [sdkReady, setSdkReady] = useState(false);
  const dispatch = useDispatch();
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;
  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading && !error) {
    order.itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2);
  }

  const addPayPalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AePw9zn6132sb9U1SRgD_BRM9YDdVXNIUlALNyOW8S3hb2fYDz1ENsPqvf1PT8ndqushR_df75lpflOr";
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }
    if (
      !order ||
      successPay ||
      order._id !== Number(orderId) ||
      successDeliver
    ) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, order, orderId, successPay, successDeliver]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <h1>
        <strong>Order:#{order._id}</strong>
      </h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <p>
                <h3>Shipping</h3>
                <h4>
                  <strong>Name: {order.user.name}</strong>
                </h4>
                <h4>
                  <strong>
                    Email:{" "}
                    <a href={`mailto:${order.user.email}`}>
                      {order.user.email}
                    </a>
                  </strong>
                </h4>
                <h4>
                  <strong>
                    Address: {order.shippingAddress.address},{" "}
                    {order.shippingAddress.zipCode}
                    {"  "}
                    {order.shippingAddress.city},{"  "}
                    {order.shippingAddress.country}
                  </strong>
                </h4>
              </p>
              {order.isDelivered ? (
                <h4>
                  <strong>
                    <Message variant="success">
                      Delivered on {order.deliveredAt.substring(0, 10)}{" "}
                      {order.deliveredAt.substring(11, 19)}
                    </Message>
                  </strong>
                </h4>
              ) : (
                <Message variant="warning">
                  <h4>Not Delivered!</h4>
                </Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <p>
                <h3>Payment Method</h3>
                <h4>
                  <strong>
                    Method:
                    {order.paymentMethod}
                  </strong>
                </h4>
              </p>
              {order.isPaid ? (
                <h4>
                  <strong>
                    <Message variant="success">
                      Paid on {order.paidAt.substring(0, 10)}{" "}
                      {order.paidAt.substring(11, 19)}
                    </Message>
                  </strong>
                </h4>
              ) : (
                <Message variant="info">
                  <h4>Not Paid!</h4>
                </Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h3>My SneakerLab Order</h3>
              {order.orderItems.length === 0 ? (
                <h2>
                  <Message variant="info">
                    Your SneakerLab order is empty
                  </Message>
                </h2>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={2}>
                          <Link to={`/product/${item.product}`}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Link>
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          <h6>
                            <strong>
                              {item.quantity} X ${item.price} = $
                              {(item.quantity * item.price).toFixed(2)}
                            </strong>
                          </h6>
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
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <h6>
                      <strong>Items:</strong>
                    </h6>
                  </Col>
                  <Col>
                    <h6>
                      <strong>${order.itemsPrice}</strong>
                    </h6>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <h6>
                      <strong>Shipping:</strong>
                    </h6>
                  </Col>
                  <Col>
                    <h6>
                      <strong>${order.shippingPrice}</strong>
                    </h6>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <h6>
                      <strong>Tax:</strong>
                    </h6>
                  </Col>
                  <Col>
                    <h6>
                      <strong>${order.taxPrice}</strong>
                    </h6>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <h6>
                      <strong>Total:</strong>
                    </h6>
                  </Col>
                  <Col>
                    <h6>
                      <strong>${order.totalPrice}</strong>
                    </h6>
                  </Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item className="my-2 py-3">
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
            {loadingDeliver && <Loader />}
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    class="btn btn-outline-success light"
                    onClick={deliverHandler}
                  >
                    <h1>
                      <strong>Mark As Deliver</strong>
                    </h1>
                  </Button>
                </ListGroup.Item>
              )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderScreen;
