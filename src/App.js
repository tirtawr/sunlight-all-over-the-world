/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useCountUp } from 'react-countup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import getPopulationInDaylight from './getPopulationInDaylight'
import DateSlider from './DateSlider'
import Map from './Map'

import './App.css';

function App() {
  const { countUp: displayedPopulationCount, update: setDisplayedPopulationCount, pauseResume: togglePopulationCountAnimation } = useCountUp({
    start: 0,
    end: 0,
    duration: 1,
    separator: ',',
    useEasing: false
  });

  const { countUp: displayedPopulationDiffPerSecond, update: setDisplayedPopulationDiffPerSecond, pauseResume: togglePopulationDiffPerSecondAnimation } = useCountUp({
    start: 0,
    end: 0,
    duration: 1,
    separator: ',',
    useEasing: true
  });

  const [targetPopulationCount, setTargetPopulationCount] = useState(0)
  const [populationCount, setPopulationCount] = useState(0)
  const [populationPercentage, setPopulationPercentage] = useState(0)
  const [populationDiffPerSecond, setPopulationDiffPerSecond] = useState(0)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [hourOffset, setHourOffset] = useState(0)
  const [miniTickInterval, setMiniTickInterval] = useState(null)

  useEffect(() => {
    setCurrentDate(new Date(new Date().getTime() + hourOffset * 60 * 60 * 1000))
  }, [hourOffset])

  const easedSetPopulationCount = (target) => {
    let current = populationCount;
    const diffPerSecond = (target - populationCount) / 300;
    setPopulationDiffPerSecond(diffPerSecond)
    console.log('[easedSetPopulationCount] diffPerSecond', diffPerSecond)
    let counter = 0;
    const miniTick = () => {
      if (counter >= 300) {
        clearInterval(miniTickInterval)
        setPopulationCount(current)
      }
      current += diffPerSecond
      togglePopulationCountAnimation()
      setDisplayedPopulationCount(current)
      counter++
    }
    miniTick()
    const miniTickInterval = setInterval(miniTick, 1 * 1000)
    setMiniTickInterval(miniTickInterval)
  }

  useEffect(() => {
    if (populationDiffPerSecond === 0) return; 
    togglePopulationDiffPerSecondAnimation()
    setDisplayedPopulationDiffPerSecond(Math.abs(Math.round(populationDiffPerSecond)))
  }, [populationDiffPerSecond])

  useEffect(() => {
    if (populationCount > 0) {
      console.log('[useEffect] new populationCount', populationCount)
      setPopulationPercentage(Math.round(populationCount / 7800000000 * 100))
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

  // a hack to avoid precalculation
  const onDateChanged = (event) => {
    const offset = event.target.value
    setPopulationCount(getPopulationInDaylight(new Date(new Date().getTime() + offset * 60 * 60 * 1000)))
    clearInterval(miniTickInterval)
  }

  return (
    <div className="page-container">
      <main>
        <Container className="px-5 pt-5">
          <Row>
            <Col>
              <h1 className="text-center">Sunlight All Over The World</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <Map currentDate={currentDate} />
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="population-count-label">
                Number of people receiving sunlight:
          </div>
              <div className="population-count">
                {displayedPopulationCount}
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <DateSlider
                value={hourOffset}
                onChange={changeEvent => setHourOffset(changeEvent.target.value)}
                onAfterChange={onDateChanged}
                step={1}
                min={-24}
                max={24}
              />
            </Col>
          </Row>
          <Row>
            <div className="fun-fact">
              <span className="fun-fact-number mr-2">{`${populationPercentage}%`}</span>
              <span>{` of the world's population are receiving sunlight`}</span>

            </div>
          </Row>
          <Row>
            <div className="fun-fact">
              <span>{`Every second, `}</span>
              <span className="fun-fact-number mx-2">{`${displayedPopulationDiffPerSecond} ${populationDiffPerSecond > 0 ? 'More' : 'Less'}`}</span>
              <span>{` people are receiving sunlight`}</span>
            </div>
          </Row>
          <Row>
            <Col>
              <div className="description">
                <p>
                  The sun is something we all share. Each day (for the most part) we take turns in enjoying our marvelous sun. Exposure to sunlight increases the brain’s release of serotonin, stabilizing our mood and increasing feelings of well-being.
                </p>
                <p>
                  This calculation uses United Nation's 2020 world population distribution estimate gathered through <a href="https://sedac.ciesin.columbia.edu/data/set/gpw-v4-admin-unit-center-points-population-estimates-rev11/data-download" target="_blank" rel="noopener noreferrer">NASA’s Socioeconomic Data and Applications Center (SEDAC)</a>.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </main>
      <footer>
        Made with ♥ by <a href="https://tirtawr.com" target="_blank" rel="noopener noreferrer">Tirta Rachman</a> - <a href="https://github.com/tirtawr/sunlight-all-over-the-world" target="_blank" rel="noopener noreferrer">View on GitHub</a> - <a href="https://github.com/tirtawr/sunlight-all-over-the-world/issues" target="_blank" rel="noopener noreferrer">Report A Bug</a>
      </footer>
    </div>
  );
}

export default App;
