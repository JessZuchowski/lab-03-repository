'use strict';

function Horn(horn) {
  this.title = horn.title;
  this.image_url = horn.image_url;
  this.description = horn.description;
  this.keyword = horn.keyword;
}

Horn.allHorns = [];

Horn.prototype.render = function(){
  $('main').append('<div class="clone"></div>');
  let hornClone = $('div[class="clone"]');

  let hornHtml = $('#photo-template').html();

  hornClone.html(hornHtml)

  hornClone.find('h2').text(this.title);
  hornClone.find('img').attr('src', this.image_url);
  hornClone.find('p').text(this.description);
  hornClone.removeClass('clone');
  hornClone.attr('class', this.keyword);
}

Horn.readJson = () => {
  $.get('/data/page-1.json', 'json')
    .then(data => {
      data.forEach(item => {
        Horn.allHorns.push(new Horn(item));
      })
    })
    .then(Horn.loadHorns)
    .then(Horn.fillArray)
    .then(Horn.filter)
}

Horn.loadHorns = () => {
  Horn.allHorns.forEach(horn => horn.render())
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
      $('div').hide();

      Horn.allHorns.forEach(image => {
        if (selected === image.keyword) {
          $(`div [class="${selected}"]`).addClass('filtered').fadeIn();
        }
      })
      $(`div[class= "${selected}"]`).fadeIn();
    }
  })
}

$(() => Horn.readJson());
