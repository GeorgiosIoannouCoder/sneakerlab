import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">
            &copy; {currentYear} SneakerLab New York LLC. All Rights Reserved
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
