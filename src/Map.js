/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import mapboxgl from 'mapbox-gl';

import getDarknessPolygon from './getDarknessPolygon'

function Map({ currentDate }) {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2V0YXBhazIwMTkiLCJhIjoiY2szdzJhdGx3MDVpaDNpcGltZ3luNDUyMSJ9.lwsV4FsgU1SfbS6QRFlO_A';
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [0, 0],
        zoom: 0
      });

      map.on('load', () => {
        setMap(map);

        map.addSource('darkness', {
          'type': 'geojson',
          'data': getDarknessPolygon(currentDate)
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

        map.fitBounds([[-180, 90], [180, -50]], {
          padding: { top: 0, bottom: 0, left: 0, right: 0 }
        });
      });

    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);

  useEffect(() => {
    if (map) map.getSource('darkness').setData(getDarknessPolygon(currentDate));
  }, [currentDate])

  return (
    <>
      <div ref={mapContainer} className="map-container"></div>
    </>
  );
}

export default Map;
