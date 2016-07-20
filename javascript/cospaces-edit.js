/* global $ */
var serverURL = 'http://startups-sg.herokuapp.com/'
$(function () {
  // listen for the form login
  getData()
})

function getData () {
  $.get(serverURL + 'co-working-spaces')
    .done(function (data) {
      data.forEach(function (datum) {
        if (datum.image == undefined) {
          datum.image = '<img src="default.svg">'
        }
        $('#cospace').append('<ul><li>' + datum.name + '</li><li>' + datum.address + '</li><li>' + datum.description + '</li><li>' + datum.website + '</li><li>' + datum.logo + '</li><li>' + datum.image + '</li></ul>')
      })
    // console.log(data)
    }).fail(function (jqXHR, textStatus, errorThrown) {
    console.log(errorThrown)
  })
}

function editData () {
  // $.put(severURL + 'co-working-spaces/' + id)
}
