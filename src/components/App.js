import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { prettyPrintStat, sortData } from '../utils';
import './App.css';
import InfoBox from './InfoBox';
import LineGraph from './LineGraph';
import Map from './Map';
import Table from './Table';
import 'leaflet/dist/leaflet.css';

function App() {

  const [countries,setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [tableData, setTableData] = useState([]);
  const [countryInfo, setCountryInfo] = useState({});
  const [mapCenter, setMapCenter] = useState([46, 2]);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType,setCasesType] = useState("cases");

  useEffect(() => {
      fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
    })
  }, [])

  /* Endpoint permettant de récupérer les statistiques du Covid pour chaque pays
      https://disease.sh/v3/covid-19/countries
  */
  useEffect(() => {
    // Ce code est exécuté uniquement au premier chargement du composant
    // async => Envoyer une requête au serveur, attendre qu'il nous réponde
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country, // retourne le nom du pays : France, United State
            value: country.countryInfo.iso2 // retourne le code Iso2 : FR, US
          }
        ));
        const sortedData = sortData(data)
        setTableData(sortedData);
        setCountries(countries);
        setMapCountries(data)
      })
    }
    getCountriesData();
  },[]);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    const url = countryCode === 'worldwide' 
      ? 'https://disease.sh/v3/covid-19/all' 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 : EVOLUTION</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value={country}>Worldwide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem key={country.name} value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={e => setCasesType('cases')} 
            title="Cas confirmés" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={countryInfo.cases}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={e => setCasesType('recovered')} 
            title="Guérisons" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={countryInfo.recovered}
          />
          <InfoBox
            active={casesType === "deaths"}
            onClick={e => setCasesType('deaths')}  
            title="Décès" 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={countryInfo.deaths}
          />
        </div>
        <Map countries={mapCountries} casesType={casesType} center={mapCenter} zoom={mapZoom}/>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Nombre de cas par pays</h3>
          <Table countries={tableData}/>
          <h3 className="app__graphTitle">
            {casesType === 'cases' 
              ? 'Nouveaux cas dans le monde entier'
              : casesType === 'recovered'
              ? 'Guérisons dans le monde entier'
              : 'Décès dans le monde entier'
            }
          </h3>
          <LineGraph className="app__graph" casesType={casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
