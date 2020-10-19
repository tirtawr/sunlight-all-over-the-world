// import { point } from '@turf/turf'

import population from './population.json';
import getDarknessPolygon from './getDarknessPolygon'
import { point, booleanPointInPolygon as isInside } from '@turf/turf'

// Returns the number of people residing in a steradian of 1 degree lng by 1 degree lat
function getPopulation(longitude, latitude) {
  // get north-east point of the steradian
  const lng = Math.floor(longitude);
  const lat = Math.floor(latitude);

  const lngIdx = lng + 180;
  const latIdx = -lat + 90;

  return population[latIdx][lngIdx];
}

function getPopulationInDaylight(date) {
  console.log('[getPopulationInDaylight]', date)
  date = (date instanceof Date) ? date : new Date();

  const darknessPolygon = getDarknessPolygon(date);
  let total = 0;

  for (let lat = 90; lat > -90; lat--) {
    for (let lng = -180; lng < 180; lng++) {
      const steradianPopulation = getPopulation(lng, lat);
      if (steradianPopulation > 0) {
        const steradianCenteroid = point([lng + 0.5, lat + 0.5])
        if (!isInside(steradianCenteroid, darknessPolygon)) {
          total += steradianPopulation
        }
      }
    }
  }

  return Math.round(total);
}

export default getPopulationInDaylight;
