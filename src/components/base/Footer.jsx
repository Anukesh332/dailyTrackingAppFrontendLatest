import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
 
function Footer() {
  return (
    <footer className="text-light" style={{"backgroundColor": "gray"}}>
      <Container>
        <Row>
          <Col md={4} className='mt-4'>
            <h5>About Us</h5>
            <p>DailyTracking is one of the most trusted Brand.</p>
          </Col>
          <Col md={4} className='mt-4'>
            <h5>Contact Us</h5>
            <p>Email: dailytracking@example.com</p>
            <p>Phone: +1234567890</p>
          </Col>
          <Col md={4} className='mt-4'>
            <h5>Follow Us</h5>
            <ul className="list-unstyled">
              <li>
                Facebook
              </li>
              <li>
                Twitter
              </li>
              <li>
                Instagram
              </li>
            </ul>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col className="text-center">
            <p>&copy; 2024 Daily Tracking Company. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
 
export default Footer;