import  React from 'react';
import {Circle, Popup} from 'react-leaflet'

export const sortData = (data) => {
    const sortedData = [...data];

    return sortedData.sort((a,b) => b.cases - a.cases);
};

const casesTypeColors = {
    cases: {
      hex: "#CC1034",
      mulitiplier: 300,
    },
  
    recovered: {
      hex: "#7DD71D",
      mulitiplier: 600,
    },
  
    deaths: {
      hex: "#C0C0C0",
      mulitiplier: 800,
    },
  };

export const prettyPrintStat = (stat) =>
  stat ? `+ ${stat}` : "+ 0";

//Déssine un cercle sur la carte
export const showDataOnMap = (data, casesType) =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      pathOptions={{
        color: casesTypeColors[casesType].hex,
        fillColor: casesTypeColors[casesType].hex,
      }}
      radius={
        Math.sqrt(country[casesType]) *
        casesTypeColors[casesType].mulitiplier
      }
    >
      <Popup>
        <div className="info-container">
            <div
                className="info-flag"
                style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
            />
                <div className="info-name">
                    {country.country}
                </div>
                <div className="info-confirmed">
                    Cas confirmés: {country.cases}
                </div>
                <div className="info-recovered">
                    Guérisons: {country.recovered}
                </div>
                <div className="info-deaths">
                    Décès: {country.deaths}
                </div>
        </div>
      </Popup>
    </Circle>
  ));