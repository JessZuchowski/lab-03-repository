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
  $.get('/data/page-2.json', 'json')
    .then(data => {
      data.forEach(object=> {
        Horn.allHorns.push(new Horn(object));
      })
    })
    .then(Horn.fillArray)
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

$(() => Horn.readJson());


