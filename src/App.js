/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useCountUp } from 'react-countup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import RangeSlider from 'react-bootstrap-range-slider';

import getPopulationInDaylight from './getPopulationInDaylight'
import Map from './Map'

import './App.css';

function App() {
  const { countUp: displayedPopulationCount, update: setDisplayedPopulationCount, pauseResume: toggleAnimation } = useCountUp({
    start: 0,
    end: 0,
    duration: 1,
    separator: ',',
    useEasing: false
  });

  const [targetPopulationCount, setTargetPopulationCount] = useState(0)
  const [populationCount, setPopulationCount] = useState(0)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [hourOffset, setHourOffset] = useState(0)
  const [miniTickInterval, setMiniTickInterval] = useState(null)

  useEffect(() => {
    setCurrentDate(new Date(new Date().getTime() + hourOffset * 60 * 60 * 1000))
  }, [hourOffset])

  const easedSetPopulationCount = (target) => {
    let current = populationCount;
    const diffPerMiniTick = (target - populationCount) / 300;
    console.log('[easedSetPopulationCount] diffPerMiniTick', diffPerMiniTick)
    let counter = 0;
    const miniTick = () => {
      if (counter >= 300) {
        clearInterval(miniTickInterval)
        setPopulationCount(current)
      }
      current += diffPerMiniTick
      toggleAnimation()
      setDisplayedPopulationCount(current)
      counter++
    }
    miniTick()
    const miniTickInterval = setInterval(miniTick, 1 * 1000)
    setMiniTickInterval(miniTickInterval)
  }

  useEffect(() => {
    if (populationCount > 0) {
      console.log('[useEffect] new populationCount', populationCount)
      const target = getPopulationInDaylight(new Date(currentDate.getTime() + 5 * 60 * 1000))
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
    const initialPopulationCount = getPopulationInDaylight(currentDate)
    
    setDisplayedPopulationCount(initialPopulationCount)
    setPopulationCount(initialPopulationCount)
  }, [])

  const onDateChanged = (event) => {
    const offset = event.target.value
    setPopulationCount(getPopulationInDaylight(new Date(new Date().getTime() + offset * 60 * 60 * 1000)))
    clearInterval(miniTickInterval)
  }

  return (
    <Container className="p-5">
      <Row>
        <Col>
          <h1 className="text-center">Daylight All Over The World</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Map currentDate={currentDate} />
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="population-count">
            {displayedPopulationCount}
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <RangeSlider
            value={hourOffset}
            onChange={changeEvent => setHourOffset(changeEvent.target.value)}
            onAfterChange={onDateChanged}
            step={1}
            min={-24}
            max={24}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
