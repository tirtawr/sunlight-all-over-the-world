import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Map from './Map'

import './App.css';

function App() {
  return (
    <Container className="p-5">
      <Row>
        <Col>
          <h1 className="text-center">Daylight All Over The World</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Map />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
