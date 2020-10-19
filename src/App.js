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
  const { countUp: displayedPopulationCount, update: setDisplayedPopulationCount } = useCountUp({
    start: 0,
    end: 0,
    duration: 2,
    separator: ',',
    useEasing: false
  });

  const [targetPopulationCount, setTargetPopulationCount] = useState(0)
  const [populationCount, setPopulationCount] = useState(0)

  const easedSetPopulationCount = (target) => {
    let current = populationCount;
    const diffPerMiniTick = (target - populationCount) / 150;
    console.log('[easedSetPopulationCount] diffPerMiniTick', diffPerMiniTick)
    let counter = 0;
    const miniTick = setInterval(() => {
      if (counter >= 150) {
        clearInterval(miniTick)
        setPopulationCount(current)
      }
      current += diffPerMiniTick
      setDisplayedPopulationCount(current)
      counter++
    }, 2 * 1000)
  }

  useEffect(() => {
    if (populationCount > 0) {
      console.log('[useEffect] new populationCount', populationCount)
      const target = getPopulationInDaylight(new Date(new Date().getTime() + 5 * 60 * 1000))
      setTargetPopulationCount(target)
    }
  }, [populationCount])

  useEffect(() => {
    if (targetPopulationCount > 0) {
      console.log('[useEffect] new targetPopulationCount', targetPopulationCount)
      easedSetPopulationCount(targetPopulationCount)
    }
  }, [targetPopulationCount])

  useEffect(() => {
    const initialPopulationCount = getPopulationInDaylight(new Date())
    
    setDisplayedPopulationCount(initialPopulationCount)
    setPopulationCount(initialPopulationCount)
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
            {displayedPopulationCount}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
