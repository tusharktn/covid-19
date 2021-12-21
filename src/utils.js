import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

export const sortData = (data) => {
  const sortedData = [...data];

  return sortedData.sort((a, b) => (a.active > b.active ? -1 : 1));
};

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    multiplier: 300,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 300,
  },
  deaths: {
    hex: "#fb4443",
    multiplier: 2000,
  },
};

export const prettyStat = (stat) => {
  return stat ? `+${numeral(stat).format("0,0a")}` : `+0`;
};
export const showMapData = (data, casesType = "cases") => {
  return data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.6}
      fillColor={casesTypeColors[casesType].hex}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info-cotainer">
          <div
            className="info-flag"
            style={{
              background: `url(${country.countryInfo.flag})`,
            }}
          />
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
};
