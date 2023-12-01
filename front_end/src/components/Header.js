import React from 'react'
import { Navbar, Nav, Container, Col, NavDropdown, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../actions/userActions'


function Header() {
  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin
  const dispatch = useDispatch()

  const logoutHandler = () => {
    dispatch(logout())
  }

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>
              <h1>
                SneakerLab
              </h1>
            </Navbar.Brand>
          </LinkContainer> 
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className='mr-auto'>
              <LinkContainer to='/cart'>
                <Nav.Link>
                  <Button>
                    <h6>
                      <i className="fas fa-shopping-cart"></i>
                      {' '}
                      <strong>
                        Cart
                      </strong>
                    </h6>
                  </Button>
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <Col >
                  <h6>
                    <strong>
                      <Button><h6><i class="fa-solid fa-user"></i><NavDropdown title={userInfo.name} id='username'>
                        <LinkContainer to='/profile'>
                          <NavDropdown.Item>
                            <p>
                              <strong>Profile </strong>
                              <i class="fa-solid fa-id-card"></i>
                            </p>
                          </NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to='/login'>
                          <NavDropdown.Item onClick={logoutHandler}>
                            <p>
                              <strong>Logout </strong>
                              <i class="fa-solid fa-arrow-right-from-bracket"></i>
                            </p>
                          </NavDropdown.Item>
                        </LinkContainer>
                      </NavDropdown></h6></Button>
                    </strong>
                  </h6>
                </Col>) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                      <Button>
                        <h6>
                          <i className="fas fa-user"></i>
                           {' '}
                          <strong>
                            Login
                          </strong>
                        </h6>
                      </Button>
                  </Nav.Link>
                </LinkContainer>)}
                {userInfo && userInfo.isAdmin && (
                  <Button type="button" class="btn btn-primary btn-sm"><h6><i class="fa-solid fa-user-gear"></i><NavDropdown title='Admin' id='adminmenu'>
                    <LinkContainer to='/admin/userlist'>
                      <NavDropdown.Item>
                        <p>
                          <strong>Users </strong>
                          <i class="fa-solid fa-users"></i>
                        </p>                      
                      </NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/productlist'>
                      <NavDropdown.Item>
                        <p>
                          <strong>Products </strong>
                          <i class="fa-solid fa-box-open"></i>
                        </p>                      
                      </NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/orderlist'>
                      <NavDropdown.Item>
                        <p>
                          <strong>Orders </strong>
                          <i class="fa-solid fa-truck"></i>
                        </p>                      
                      </NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown></h6></Button>
                )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header