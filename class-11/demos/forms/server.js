'use strict';

const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('./public'));
//finds any data from the form and combines it in the .body property of the request
app.use(express.urlencoded({extended:true}));

// app.get('/contact', (request, response) =>{
//   response.send('it worked');
// })

app.post('/contact', (request, response) => {

  // This is where my data will live from the form
  console.log(request.body);

  //This is extra, I want to show how clanky it is
  response.sendFile('./thanks.html', {root: './public'});
})

app.post('/helloworld', (request, response) =>{
  response.send('hello world');
})

app.listen(PORT, () => console.log(`app is up on port ${PORT}`));
