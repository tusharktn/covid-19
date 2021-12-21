import "./App.css";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import Table from "./components/Table";
import { prettyStat, sortData } from "./utils";
import LineGraph from "./components/LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  useEffect(() => {
    getCountriesData();
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  const getCountriesData = async () => {
    await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const allCountries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }));
        setMapCountries(data);
        const sortedData = sortData(data);
        setTableData(sortedData);
        setCountries(allCountries);
      });
  };

  // console.log(tableData);
  // console.log(countryInfo);
  // console.log(mapCountries);
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    const url =
      countryCode === "Worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(e.target.value);
        setCountryInfo(data);
        if (countryCode === "Worldwide") {
          setMapCenter({ lat: 34.80746, lng: -40.4796 });
          setMapZoom(3);
        } else {
          const newLatLong = {
            lat: data.countryInfo.lat,
            lng: data.countryInfo.long,
          };
          setMapCenter(newLatLong);
          setMapZoom(4);
        }
      });
  };

  // console.log(mapCenter);
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19-TRACKER</h1>
          <FormControl className="app__dropdown" variant="outlined">
            <Select value={country} onChange={onCountryChange}>
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {countries &&
                countries.map((country) => {
                  return (
                    <MenuItem
                      value={country.value}
                      key={`${country.value}${country.name}`}
                    >
                      {country.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Corona Virus Cases"
            cases={prettyStat(countryInfo.todayCases)}
            total={prettyStat(countryInfo.cases)}
          ></InfoBox>
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyStat(countryInfo.todayRecovered)}
            total={prettyStat(countryInfo.recovered)}
          ></InfoBox>
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyStat(countryInfo.todayDeaths)}
            total={prettyStat(countryInfo.deaths)}
          ></InfoBox>
        </div>
        <Map
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live cases by country</h3>
            <Table countries={tableData} />
            <h3>Worldwide {casesType}</h3>
            <LineGraph className="app__graph" casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
