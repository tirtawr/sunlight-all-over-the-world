/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useCountUp } from 'react-countup';

import getPopulationInDaylight from './getPopulationInDaylight'
import Map from './Map'

import './App.css';

function App() {
  const { countUp: populationCount, update: setPopulationCount } = useCountUp({
    start: 0,
    end: 0,
    duration: 2,
    separator: ',',
    useEasing: false
  });

  const tick = (initialPopulationCount) => {
    let currentPopulationCount = initialPopulationCount;
    let targetPopulationCount = getPopulationInDaylight(new Date(new Date().getTime() + 5 * 60 * 1000));
    const diffPerSmallTick = (targetPopulationCount - currentPopulationCount) / 150;
    const miniTick = setInterval(() => {
      currentPopulationCount += diffPerSmallTick
      setPopulationCount(currentPopulationCount)
    }, 2 * 1000)
    setTimeout(() => {
      clearInterval(miniTick)
    }, (5 * 60 * 1000) - (500))
  }

  useEffect(() => {
    const initialPopulationCount = getPopulationInDaylight(new Date())
    setPopulationCount(initialPopulationCount)
    tick(initialPopulationCount)
  }, [])

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
      <Row>
        <Col>
          <div className="population-count">
            {populationCount}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
