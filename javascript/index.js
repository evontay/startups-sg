/* global $ */
var serverURL = 'http://startups-sg.herokuapp.com/'

$(document).on('click', '#cospace-cat', function (event) {
  var newid = $(this).attr('id')
  console.log(newid)
  $.get('cospaces.html')
})

$(document).on('click', '#inc-cat', function (event) {
  var newid = $(this).attr('id')
  console.log(newid)
  $.get('incubators.html')
})

$(document).on('click', '#event-cat', function (event) {
  var newid = $(this).attr('id')
  console.log(newid)
  $.get('events.html')
})

$(document).on('click', '#govt-cat', function (event) {
  var newid = $(this).attr('id')
  console.log(newid)
  $.get('govt.html')
})
