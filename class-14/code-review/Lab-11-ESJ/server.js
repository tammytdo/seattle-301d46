'use strict';


require('dotenv').config();

// Dependencies //

const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');

// Server Setup //

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - bridge between database and application //

app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));
app.set('view-engine', 'ejs');
app.use(methodOverride((request, response) => {
  if(request.body && request.body._method){
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}))

// Postgres //

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

// SQL //

const SQL = {};
SQL.getAll = 'SELECT * FROM book;';
SQL.getById = 'SELECT * FROM saved_books WHERE id=$1;';


// Function to handle errors //

function errorHandler(error, response){
  response.render('pages/error.ejs', {status: 500, message: 'Something has gone wrong!'});
  console.log('nooooooooooooooooo, there was a an error');
  console.error(error);
}

// Renders the home page on load //

app.post('/add-book', (request, response) => {
  //check if book data came to me
  console.log(request.body);
  // take the book data
  // save it to the db
  const body = request.body;


  client.query('INSERT INTO book (title, author, description, image) VALUES ($1, $2, $3, $4)', [body.title, body.author, body.description, body.image]);

  //redirect them to home
  response.redirect('/');
  // // redirect them to the new books details
  // response.redirect('/specificbook')
})

app.get('/', (request, response) => {
  client.query(SQL.getAll).then(result =>{
    // First parameter indicated where content will be rendered
    // Second parameter indicated retriev data
    response.render('pages/index.ejs', {book: result.rows});
  })
    .catch(error => errorHandler(error, response));
});

// Bring the user to the new page, displaying the specific book data

app.get('/specificBook/:book_id', (request, response) => {
  client.query('SELECT * FROM book WHERE id=$1', [request.params.book_id]).then(result =>{
    console.log(result.rows); //[book, book, book]
    // First parameter indicated where content will be rendered
    // Second parameter indicated retriev data
    response.render('pages/searches/show.ejs', {book: result.rows[0]});
  })
    .catch(error => errorHandler(error, response));
});

app.get('/books/:id', (request, response) => {
  const selected = parseInt(request.params.id);
  client.query(SQL.getById, [selected]).then(result => {
    response.render('pages/books/detail.ejs', {showBook: result.rows[0]});
  })
})

// Google book API search //

app.post('/searches', (request, response) => {
  console.log(request.body);
  superagent.get(`https://www.googleapis.com/books/v1/volumes?q=+intitle:${request.body.search[0]}`).then(result => {
    // response.send(new Book(result.body));
    // const bookArray = [];
    const bookToSend = new Book(result.body);
    response.render('pages/result.ejs', {book: bookToSend});

    // console.log(new Book(result.body));
  })
    .catch(error => errorHandler(error, response))
})

app.delete('/delete-book/:book_id', (request, response) =>{
  // client.query('DELETE FROM book WHERE id=$1', [request.body.id])
  client.query('DELETE FROM book WHERE id=$1', [request.params.book_id])
  response.redirect('/');
});




// Constructor Function //

function Book (data){
  this.title = data.items[0].volumeInfo.title || 'Title could not be found';
  this.author = data.items[0].volumeInfo.authors || 'Author could not be found';
  this.description = data.items[0].volumeInfo.description || 'No description available';
  this.image = data.items[0].volumeInfo.imageLinks.thumbnail.slice(0,4) + 's' + data.items[0].volumeInfo.imageLinks.thumbnail.slice(4);
}


app.listen(PORT, () => console.log(`listening on ${PORT}`));
