'use strict';

// immediate import and configuration
require('dotenv').config();

// global constants
const PORT = process.env.PORT || 3000 ;
const express = require('express');
const cors = require('cors');
const superagent = require('superagent'); // talks to the web
const pg = require('pg'); // postgres, talks to psql

// postgres client setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', error => console.error(error))

// server definition
const app = express();
app.use(cors());

app.get('/location', searchLatLng);

app.get('/weather', getWeather);

app.use('*', (request, response) => {
  response.send('Our server runs.');
})

// Text
const SQL = {};
SQL.getLocation = 'SELECT * FROM locations WHERE search_query=$1'
SQL.insertLocation = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4)'

const API = {};
API.geoCode = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
API.darksky = 'https://api.darksky.net/forecast/';


// ==============================================
// Helper Functions
// ==============================================

function Location(query, data){ // (front end query, data from google)
  this.search_query = query;
  this.formatted_query = data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
}

function DailyWeather(rawDayObj){
  this.forecast = rawDayObj.summary;
  this.time = new Date (rawDayObj.time * 1000).toString().slice(0, 15);
}

function searchLatLng(request, response){
  const searchQuery = request.query.data;
  client.query(SQL.getLocation, [searchQuery])
    .then(result => {
      if (result.rows.length) {
        console.log('Exists in the DATABASE');
        response.send(result.rows[0])
      } else {
        getStuffFromGoogle(searchQuery, response)
      }
    })
}

function getStuffFromGoogle(searchQuery, response){
  const url = `${API.geoCode}${searchQuery}&key=${process.env.GEOCODE_API_KEY}`;
  superagent.get(url).then(result => {
    const location = new Location(searchQuery, result.body.results[0]);
    response.send(location);
    console.log('got location from Google API, inserting into DATABASE');
    client.query(SQL.insertLocation, [location.search_query, location.formatted_query, location.latitude, location.longitude]);
  })
}

function getWeather (request, response) {
  console.log('from the front end: \n', request.query.data);
  superagent.get(`${API.darksky}${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`).then(result => {
    response.send(result.body.daily.data.map(dayObj => new DailyWeather(dayObj)));
  })
    .catch(console.error)
}

//server start
app.listen(PORT, ()=> {
  console.log(`app is up on PORT ${PORT}`)
})
