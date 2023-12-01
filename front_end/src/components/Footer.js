import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

function Footer() {
  return (
    <footer>
        <Container>
          <Row>
            <Col className="text-center py-3">
                &copy; 2022 SneakerLab New York LLC. All Rights Reserved
            </Col>
          </Row>
        </Container>
    </footer>
  )
}

export default Footer