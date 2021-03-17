import React from 'react';
import './Map.css';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { showDataOnMap } from '../utils';

function Map({countries,casesType,center,zoom}) {
    function ChangeView({ center, zoom }) {
        const map = useMap();
        map.setView(center, zoom);
        return null;
      }

    return (
        <div>
            <MapContainer center={center} zoom={zoom} className="map">
                <ChangeView center={center} zoom={zoom} />
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {showDataOnMap(countries,casesType)}
            </MapContainer>
        </div>
    )
}

export default Map
