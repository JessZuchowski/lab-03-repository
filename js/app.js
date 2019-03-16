'use strict';

function Horn(rawDataObject){
  for(let key in rawDataObject){
    this[key] = rawDataObject[key];
  }
}
Horn.allHorns = [];

Horn.prototype.toHtml = function(){
  let $template = $('#photo-template').html();
  let compiledTemplate = Handlebars.compile($template);
  return compiledTemplate(this);
}


Horn.readJson = () => {
  $.get('/data/page-1.json', 'json')
    .then(data => {
      data.forEach(object=> {
        Horn.allHorns.push(new Horn(object));
      })
    })
    .then(Horn.fillArray)
    .then(sortHorns)
    .then(Horn.sortByNumber)
    .then(Horn.filter)
    .then(Horn.renderHorn);
}

Horn.renderHorn = () =>{
  Horn.allHorns.forEach(newHornObject =>{
    $('#photo').append(newHornObject.toHtml());
  })
}

Horn.fillArray = () =>{
  const filtered_array = [];

  Horn.allHorns.forEach(image => {
    if(!filtered_array.includes(image.keyword)) filtered_array.push(image.keyword);
  })
  filtered_array.sort();
  filtered_array.forEach(keyword => {
    let optionTag = `<option value="${keyword}">${keyword}</option>`
    $('select').append(optionTag);
  })
}

const sorted_array = Horn.allHorns;
const sortHorns = (sorted_array) =>{
  Horn.allHorns.sort(function(a,b){
    if(a.title > b.title) return 1;
    if(a.title < b.title) return -1;
    return 0;
  })
  return sorted_array;
}

Horn.sortByNumber = () => {
  $('form input').on('change', function(){
    $('input[name=title]').removeAttr('checked');
    
  })
}


Horn.filter = () => {
  $('select').on('change', function(){
    let selected = $(this).val();
    if (selected !== 'Filter By Keyword') {
      $('section').hide();

      Horn.allHorns.forEach(image => {
        if (selected === image.keyword) {
          $(`section[class="${selected}"]`).fadeIn();
        }
      })
    }
  })
}

Horn.handleSelect = () => {
  $('form input').on('change', function(){
    let clicked = $("form input[type='radio']:checked").val();
    if(clicked === 'title'){
      //call sort function
    }else if(clicked === 'num-of-horns'){
      //call sort function
    }
  })
}

$(() => Horn.readJson());

