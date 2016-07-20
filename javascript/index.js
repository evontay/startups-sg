/* global $ */
var serverURL = 'http://startups-sg.herokuapp.com/'

$(document).on('click', '#cospace-cat', function (event) {
  var newid = $(this).attr('id')
  window.location = 'cospaces.html'
  console.log(newid)
})

$(document).on('click', '#inc-cat', function (event) {
  var newid = $(this).attr('id')
  window.location = 'incubators.html'
  console.log(newid)
})

$(document).on('click', '#event-cat', function (event) {
  var newid = $(this).attr('id')
  window.location = 'events.html'
  console.log(newid)
})

$(document).on('click', '#govt-cat', function (event) {
  var newid = $(this).attr('id')
  window.location = 'govs.html'
  console.log(newid)
})
