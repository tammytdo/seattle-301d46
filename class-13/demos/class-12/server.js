'use strict';

require('dotenv').config();

const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
// const superagent = require('superagent');

const app = express();

// make a pg client that will talk to my database
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

const PORT = process.env.PORT || 3000;

// adds a body property to 'request' and stores the form data there
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.set('view-engine', 'ejs');

// boilerplate code to strip the _method property and reroute the type of request
app.use(methodOverride((request, response) => {
  if(request.body && typeof request.body === 'object' && '_method' in request.body) {
    // look in the urlencoded POST body and delete _method
    // change to a put
    let method = request.body._method; // 'PUT';
    delete request.body._method;
    return method; // 'PUT'
  }

}))


app.get('/', showTasks)

app.get('/add-task', showTaskForm);

app.post('/add-task', addTask);

app.put('/update-task/:id', updateTask);

app.post('/update-task', (request, response) =>{
  console.log('came on a post');
  console.log(request.body);
})


app.get('/task/:task_id', getOneTask);

app.listen(PORT, () => {console.log(`app us running on port ${PORT}`)});

function showTasks(request, response) {
  client.query('SELECT * FROM tasks;').then(result => {
    response.render('pages/index.ejs', {data: result.rows});
  })

  //call the response.render method on an ejs file to turn it into html and give it to the front end
}

function showTaskForm (request, response){
  // response.send('about to get formy');
  response.render('pages/add-view.ejs');
}

function addTask(request, response){
  client.query('INSERT INTO tasks (title, description, category, contact, status) VALUES ($1, $2, $3, $4, $5)', Object.values(request.body))

  // dummyData.push(request.body);
  // console.log(dummyData);

  //instead of rerendering and copying code (not dry);
  // I will force chrome to redirect to my home route
  response.redirect('/')
}

function getOneTask(request, response) {
  let SQL = 'SELECT * FROM tasks WHERE id=$1;';
  let values = [request.params.task_id];

  return client.query(SQL, values)
    .then(result => {
      // console.log('single', result.rows[0]);
      return response.render('pages/detail-view.ejs', { task: result.rows[0] });
    })
    .catch(console.error);
}

function updateTask(request, response) {
  console.log('from a put');
  console.log(request.body);

  const {title, description, category, contact, status} = request.body;
  console.log(title);
  client.query(
    `UPDATE tasks
    SET title=$1, 
    description=$2,
    category=$3,
    contact=$4,
    status=$5
    WHERE id=$6`,
    [title, description, category, contact, status, request.params.id])
    .then(result => {
      console.log(result);
      response.redirect('/');
    })

}
