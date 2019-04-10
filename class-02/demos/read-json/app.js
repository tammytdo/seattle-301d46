'use strict';

/*
{
    "name": "Ginger",
    "image_url": "ginger-princess.jpg",
    "hobbies": "Fetching things and being a princess"
  },
*/
//our constructor will take "dog-like" data and make t a real dog
const allDogs = [];

function Dog (dog){
  this.name = dog.name;
  this.image_url = dog.image_url;
  this.hobbies = dog.hobbies;
  allDogs.push(this);
}

// One way to render in jquery is to copy the inner Html of a "template" element and then change it, adding our own content
// 1.  add our own empty element to the <main>
// 2. extract the html of a template element already on the page
// 3. Insert the template html into our empty element
// 4. modify the content as needed using our data

Dog.prototype.render = function(){
  const dogSectionHtml = $('#dog-template').html()

  $('main').append('<section id="clone"></section>');
  $('#clone').html(dogSectionHtml);

  //put data in their place

  $('#clone').find('h2').text(this.name);
  $('#clone').find('img').attr('src', this.image_url);
  // Fetching things and being a princess
  $('#clone').find('p').text(this.hobbies);
  $('#clone').attr('id', '');
}

const testDog = new Dog({});
testDog.render();

Dog.getDogData = function(){
  $.get('data.json', 'json').then( data => {
    data.forEach(dog => new Dog(dog));
    allDogs.forEach(dog => dog.render());
  })

}

Dog.getDogData();
