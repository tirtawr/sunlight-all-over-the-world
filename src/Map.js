import React from "react";
import mapboxgl from 'mapbox-gl';

import getDarknessPolygon from './getDarknessPolygon'

class Map extends React.Component {
  constructor(props) {
    super(props);
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2V0YXBhazIwMTkiLCJhIjoiY2szdzJhdGx3MDVpaDNpcGltZ3luNDUyMSJ9.lwsV4FsgU1SfbS6QRFlO_A';
    this.state = {
      lng: 0, // Initial state for mapbox
      lat: 0, // Initial state for mapbox
      zoom: 0, // Initial state for mapbox
      darknessPolygon: getDarknessPolygon(new Date())
    };
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });


    map.on('load', () => {
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

      map.fitBounds([[-180, 90], [180, -60]], {
        padding: { top: 0, bottom: 0, left: 0, right: 0 }
      });
    });
  }

  render() {
    return (
      <>
        <div ref={el => this.mapContainer = el} className="map-container" />
      </>
    )
  }
}

export default Map;
