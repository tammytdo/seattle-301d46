'use strict';

let DDAarray = [];

const DDATemplateSource = $('#DDA-template').html();
const DDATemplate = Handlebars.compile(DDATemplateSource);

const DDAOptionTemplateSource = $('#DDA-option-template').html();
const DDAOptionTemplate = Handlebars.compile(DDAOptionTemplateSource);

function DDAConst(dda) {
  this.imageUrl = dda.image_url;
  this.title = dda.title;
  this.description = dda.description;
  this.keyword = dda.keyword;
  this.horns = dda.horns;
}

DDAConst.prototype.render = function(){
  const newHtml = DDATemplate(this);
  $('main').append(newHtml);
}

DDAConst.prototype.makeOption = function(){
  if($(`option[value=${this.keyword}]`).length) return;

  const newHtml = DDAOptionTemplate(this);
  $('select').append(newHtml);
}

const getAnimalData = data => {
  $.get(`${data}`, 'json').then(data => {
    data.forEach( val => DDAarray.push(new DDAConst(val)));
    DDAarray.forEach(DDA => DDA.render());
    DDAarray.forEach(DDA => DDA.makeOption())
  })
}

$(document).ready(() => {
  getAnimalData('page-1.json');

  $('header').on('click', 'button', function(){
    DDAarray = [];
    $('main').empty();
    console.log($(this).text());
    getAnimalData(`${$(this).text()}.json`);
  })

  $('header').on('click', 'p.big', function() {
    //sort them alphabetically
    DDAarray.sort((a,b) => {
      if(a.title > b.title) {
        return 1
      }
      if( a.title < b.title) return -1;
      return 0;
    })
    $('main').empty();
    DDAarray.forEach(DDA => DDA.render());
  })
})

/*
{
    "image_url": "http://3.bp.blogspot.com/_DBYF1AdFaHw/TE-f0cDQ24I/AAAAAAAACZg/l-FdTZ6M7z8/s1600/Unicorn_and_Narwhal_by_dinglehopper.jpg",
    "title": "UniWhal",
    "description": "A unicorn and a narwhal nuzzling their horns",
    "keyword": "narwhal",
    "horns": 1
  },
*/
