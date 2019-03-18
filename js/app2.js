'use strict';

function Horn(item){
  for(let key in item){
    this[key] = item[key];
  }
}
Horn.allHorns = [];

Horn.prototype.toHtml = function(){
  let $template = $('#photo-template').html();
  let compiledTemplate = Handlebars.compile($template);
  return compiledTemplate(this);
};


Horn.readJson = () => {
  $.get('/data/page-2.json', 'json')
    .then(data => {
      data.forEach(object=> {
        Horn.allHorns.push(new Horn(object));
      })
    })
    .then(Horn.fillArray)
    .then(sortHornsByTitle)
    .then(Horn.sort)
    .then(Horn.renderHorn)
    .then(Horn.filter)
    .then(Horn.clickImage)
    
}

Horn.renderHorn = () =>{
  Horn.allHorns.forEach(image =>{
    $('#photo').append(image.toHtml());
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

const title_sorted_array = Horn.allHorns;
const sortHornsByTitle = (title_sorted_array) =>{
  Horn.allHorns.sort(function(a,b){
    if(a.title > b.title) return 1;
    if(a.title < b.title) return -1;
    return 0;
  })
  return title_sorted_array;
}

const num_sorted_array = Horn.allHorns;
const sortHornsByNum = (num_sorted_array) =>{
  Horn.allHorns.sort(function(a,b){
    if(a.horns > b.horns)return 1;
    if(a.horns < b.horns) return -1;
    return 0;
  })
  return num_sorted_array;
}

Horn.sort = () => {
  $('form input').on('change', function(){
    $('select').val('default');
    $('section').hide();
    let selected = $(this).val();
    if(selected === 'num-of-horns'){
      $('input[name=title]').prop('checked',false);
      $('input[name=num-of-horns]').prop('checked',true);
      sortHornsByNum();
      num_sorted_array.forEach(image =>{
        console.log(num_sorted_array);
        $('#photo').append(image.toHtml());
      })
    }
    if(selected === 'title'){
      $('input[name=num-of-horns]').prop('checked',false);
      $('input[name=title]').prop('checked',true);
      sortHornsByTitle();
      $('section').show()
    }
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

Horn.clickImage = () =>{
  $('section').on('click', function(event){
    event.stopPropagation();
    $(this).attr('id','selected');
    $('section').hide();
    $('section[id=selected]').show();
  }) 
  $('main').on('click',function(){
    $('section').attr('id','');
    $('section').show();
  })
}

$(() => {
  Horn.readJson()
});

