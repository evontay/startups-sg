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
        if (datum.logo === '' || null || undefined) {
          datum.logo = '../../img/default.svg'
          console.log(datum.logo)
        }
        $('#cospace').append(
          '<div class="one-item">' +
          '<img class="logo-all img-circle" src="' + datum.logo + '"/>' +
          '<div class="item-blurb norm">' +
          '<h6 class="name-all">' + datum.name + '</h6>' +
          '<p class="hyphenate"><a href="' + datum.website + '">' + datum.website + '</a></p>' +
          '<p class="grey 400">' + datum.address + '</p>' +
          '<p class="truncate full grey 400">' + datum.description + '</p>' +
          '</div>'
        )
      })
    // console.log(data)
    }).fail(function (jqXHR, textStatus, errorThrown) {
    console.log(errorThrown)
  })
}
