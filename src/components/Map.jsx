import React from "react";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import "../styling/Map.css";
import { showMapData } from "../utils";
function Map({ center, zoom, countries, casesType }) {
  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {showMapData(countries, casesType)}
      </LeafletMap>
    </div>
  );
}

export default Map;
