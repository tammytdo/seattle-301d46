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
  // Take the data from the front end ('Seattle')
  const searchQuery = request.query.data;
  //check if it has been looked for before
  console.log('checking the DATABASE');
  client.query('SELECT * FROM locations WHERE search_query=$1', [searchQuery])
    .then(result => {
      console.log('result from DATABASE');
      if (result.rows.length) { // (stuff in the db)
        console.log('Exists in the DATABASE');
        response.send(result.rows[0])
      } else { // I've never searched that before
        getStuffFromGoogle(searchQuery, response)

      }
    })

  // ask superagent to go get data from google, if I don't have the data muself

}

function getStuffFromGoogle(searchQuery, response){
  // Compose the url using our secret api key and the search term
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${process.env.GEOCODE_API_KEY}`;
  // go get the data from google
  superagent.get(url).then(result => {
    // take the front end query and the results from google and normalize the data
    const location = new Location(searchQuery, result.body.results[0]);
    console.log('From Google API: \n', location);
    // send the location to the front end
    response.send(location);

    console.log('Not in the database, inserting into DATABASE');
    client.query(`INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4)`, [location.search_query, location.formatted_query, location.latitude, location.longitude]);
  })
}


function getWeather (request, response) {
  console.log('from the front end: \n', request.query.data);
  // use the data from the front end to ask darksky for weather data
  superagent.get(`https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`).then(result => {
  // map over the results and make new weather objects
    response.send(result.body.daily.data.map(dayObj => new DailyWeather(dayObj)));
  })
    .catch(console.error)
}

//server start
app.listen(PORT, ()=> {
  console.log(`app is up on PORT ${PORT}`)
})
