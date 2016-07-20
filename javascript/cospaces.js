/* global $ */
var serverURL = 'http://startups-sg.herokuapp.com/'
$(function () {
  // listen for the form login
  getData()
  // Show individual item
  $(document).on('click', '#cospace .one-item', function (event) {
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
        if ((datum.logo === '') || (datum.logo === undefined) || (datum.logo === null)) {
          datum.logo = 'img/default-logo.svg'
          console.log(datum.logo)
        }
        $('#cospace').append(
          '<div id=' + datum._id + ' class="one-item">' +
          '<img class="logo-all img-circle full-avatar" src="' + datum.logo + '"/>' +
          '<div class="item-blurb norm">' +
          '<h6 class="name-all">' + datum.name + '</h6>' +
          '<p class="hyphenate"><a href="' + datum.website + '">' + datum.website + '</a></p>' +
          '<p class="address">' + datum.address + '</p>' +
          '<p class="truncate full grey">' + datum.description + '</p>' +
          '</div>'
        )
      })
    // console.log(data)
    }).fail(function (jqXHR, textStatus, errorThrown) {
    console.log(errorThrown)
  })
}
