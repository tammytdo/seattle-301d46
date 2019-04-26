'use strict';

require('dotenv').config();
const PORT = process.env.PORT || 3000;
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

const app = express();
app.use(cors());

function Geo_data_object(search_query, formatted_query, latitude, longitude) {
  this.search_query = search_query;
  this.formatted_query = formatted_query;
  this.latitude = latitude;
  this.longitude = longitude;
}

function Weather_data_object(forecast, time) {
  this.forecast = forecast;
  this.time = new Date(time * 1000);
}

app.get('/location', (request, response) => {
  response.send(search_location(request.query.data));
})

app.get('/weather', (request, response) => {
  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;
  superagent.get(url).then(result => {
    console.log(result.body) ;

    const weather_data = result.body;
    const weather_array = [];

    for (let i = 0; i < 8; i++) {
      const forecast = weather_data.daily.data[i].summary;
      const time = weather_data.daily.data[i].time;
      weather_array.push(new Weather_data_object(forecast, time));
    }
    console.log(weather_array);
    //instead of returning weather data, send it to the front end
    response.send(weather_array);
  })
    .catch(console.log)
  // response.send(search_weather());
})

// app.get('/meetups', (request, response))

app.use('*', (request, response) => response.send('Sorry, that route does not exist.'))

// Pulling location data from the Google Geo Api
function search_location(front_end_query) {
  const search_query = front_end_query;

  const geo_data = require('./data/geo.json');
  const formatted_query = geo_data.results[0].formatted_address;
  const latitude = geo_data.results[0].geometry.location.lat;
  const longitude = geo_data.results[0].geometry.location.lng;

  const location_object = new Geo_data_object(search_query, formatted_query, latitude, longitude);

  return location_object;
}

// Pulling weather data from DarkSky API
function search_weather() {
  // Do not need front_end_query defined in the parameter since it's already defined as a global variable
  const weather_data = require('./data/darksky.json');
  const weather_array = [];

  for (let i = 0; i < 8; i++) {
    const forecast = weather_data.daily.data[i].summary;
    const time = weather_data.daily.data[i].time;
    weather_array.push(new Weather_data_object(forecast, time));
  }
  return weather_array;
}

// Leave this on the last line allways
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
