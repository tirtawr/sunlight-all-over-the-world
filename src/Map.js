import React from "react";
import mapboxgl from 'mapbox-gl';

import getDarknessPolygon from './getDarknessPolygon'
import getPopulationInDaylight from './getPopulationInDaylight'
import population from './population.json';

class Map extends React.Component {
  constructor(props) {
    super(props);
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2V0YXBhazIwMTkiLCJhIjoiY2szdzJhdGx3MDVpaDNpcGltZ3luNDUyMSJ9.lwsV4FsgU1SfbS6QRFlO_A';
    this.state = {
      lng: 0, // Initial state for mapbox
      lat: 0, // Initial state for mapbox
      zoom: 1, // Initial state for mapbox
      darknessPolygon: getDarknessPolygon(new Date())
    };
  }

  componentDidMount() {

    // console.log('population.length', population.length);

    // for (let i = 0; i < population.length; i++) {

    //   console.log('population[i].length', population[i].length)
    // }

    const populationInDaylight = getPopulationInDaylight(new Date());

    console.log('populationInDaylight', populationInDaylight);

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });


    map.on('load', () => {
      // Add zoom and rotation controls to the map.
      map.addControl(new mapboxgl.NavigationControl());
      map.addControl(new mapboxgl.ScaleControl({
        maxWidth: 240,
        unit: 'metric'
      }));

      map.addSource('darkness', {
        'type': 'geojson',
        'data': this.state.darknessPolygon
      });

      map.addLayer({
        'id': 'darkness',
        'type': 'fill',
        'source': 'darkness',
        'layout': {},
        'paint': {
          'fill-color': '#000000',
          'fill-opacity': 0.2
        }
      });
    });
  }

  render() {
    return (
      <div>
        <div ref={el => this.mapContainer = el} className="mapContainer" />
      </div>
    )
  }
}

export default Map;
