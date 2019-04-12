'use strict';

const dogHtml = $('#dog-template').html();
const template = Handlebars.compile(dogHtml);

const gatoHtml = $('#gato-template').html();
const gatoTemplate = Handlebars.compile(gatoHtml);

const allDogs = [];

function Dog (dog){
  this.name = dog.name;
  this.image_url = dog.image_url;
  this.hobbies = dog.hobbies;
  allDogs.push(this);
}


Dog.getDogData = function(){
  $.get('data.json', 'json').then( data => {
    data.forEach(dog => new Dog(dog));
    allDogs.forEach(dog => dog.renderWithHandlebars());
  })

}

Dog.prototype.renderWithHandlebars = function(){
  const newDogHtml = template(this); // pass contextual this (Dog object) through our handlebars template
  $('#dogs').append(newDogHtml); // use jquery to append it to the page
}


Dog.getDogData();

/*
const context = {
  title: '301d46 is rad',
  body: 'lets have fun everyday'
};

var source = document.getElementById('entry-template').innerHTML;
var template = Handlebars.compile(source);



const newHtml = template(context);
$('main').append(newHtml);
*/

const gato = {
  fur: 'orange',
  lasagna: 'very much likey',
  owner: '<p>Jon</p>',
  gato_url: 'ginger-princess.jpg'
}

const newGatoHtml = gatoTemplate(gato);
console.log(newGatoHtml);
$('main').prepend(newGatoHtml);

