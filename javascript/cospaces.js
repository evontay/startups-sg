/* global $ */
var serverURL = 'http://startups-sg.herokuapp.com/'

$(function () {
  // listen for the form login
  getData()
  $(document).on('click', '#cospace ul', function (event) {
    var newid = $(this).attr('id')
    console.log(newid)
    $.get(serverURL + 'co-working-spaces/' + newid)
    .done(function (data) {
      $('#cospace').hide()
      $('#cospace-show').append('<h1>' + data.cospace.name + '</h1>')
    })
  })
})

function getData () {
  $.get(serverURL + 'co-working-spaces')
    .done(function (data) {
      data.forEach(function (datum) {
        if (datum.image === undefined) {
          datum.image = '<img src="default.svg">'
        }
        $('#cospace').append('<ul id=' + datum._id + '><li>' + datum.name + '</li><li>' + datum.address + '</li><li>' + datum.description + '</li><li>' + datum.website + '</li><li>' + datum.logo + '</li><li>' + datum.image + '</li></ul>')
      })
    // console.log(data)
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown)
    })
}
