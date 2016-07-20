/* global $ */
var serverURL = 'http://startups-sg.herokuapp.com/'
$(function () {
  // listen for the form login
  getData()
  // Show individual item
  $(document).on('click', '#cospace .one-item', function (event) {
    var newid = $(this).attr('id')
    console.log(newid)
    showDetail(newid)
  })
  $(document).on('click', '.one-map-item', function (event) {
    var newid = $(this).attr('id')
    console.log(newid)
    showDetail(newid)
  })
  $(document).on('click', '#cospace-show', function (event) {
    $('#cospace').show()
    $('#cospace-show').html('')
  })
})

function showDetail (newid) {
  $.get(serverURL + 'co-working-spaces/' + newid)
    .done(function (data) {
      $('#cospace').hide()
      $('#cospace-show').html('')
      if ((data.cospace.logo === '') || (data.cospace.logo === undefined) || (data.cospace.logo === null)) {
        data.cospace.logo = 'img/default-logo.svg'
        console.log(data.cospace.logo)
      }
      if ((data.cospace.image === '') || (data.cospace.image === undefined) || (data.cospace.image === null)) {
        data.cospace.image = 'img/default-img.svg'
        console.log(data.cospace.image)
      }
      $('#cospace-show').append(
        '<h4>' + data.cospace.name + '</h4>' +
        '<div id=' + data.cospace._id + ' class="one-item">' +
        '<img class="logo-all img-circle" src="' + data.cospace.logo + '"/>' +
        '<div class="item-blurb norm">' +
        '<p class="hyphenate"><a href="' + data.cospace.website + '">' + data.cospace.website + '</a></p>' +
        '<p class="grey 400">' + data.cospace.address + '</p>' +
        '<p class=" full grey 400">' + data.cospace.description + '</p></div></div>' +
        '<div class="image"><img src="' + data.cospace.image + '"/>' +
        '</div>'
      )
      console.log(data.cospace.description)
      console.log(data.cospace.image)
    })
}

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

function createMarkers (map) {
  $.get(serverURL + 'co-working-spaces')
    .done(function (data) {
      data.forEach(function (datum) {
        geocoder = new google.maps.Geocoder()

        geocoder.geocode({'address': datum.address}, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            // In this case it creates a marker, but you can get the lat and lng from the location.LatLng
            var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
            // title: datum.name
            })
            var contentString = '<div id=' + datum._id + ' class="one-map-item">' +
              datum.name +
              '</div>'
            var infowindow = new google.maps.InfoWindow({
              content: contentString
            })
            marker.addListener('click', function () {
              if (prevOpenWindow != null) {
                prevOpenWindow.close()
              }
              prevOpenWindow = infowindow
              infowindow.open(map, marker)
            })
          } else {
            alert('Geocode was not successful for the following reason: ' + status)
          }
        })
      })
    // console.log(data)
    }).fail(function (jqXHR, textStatus, errorThrown) {
    console.log(errorThrown)
  })
}

var prevOpenWindow = null

function initMap () {
  var mapDiv = document.getElementById('map')
  var map = new google.maps.Map(mapDiv, {
    center: {lat: 1.3521, lng: 103.8198},
    zoom: 11
  })

  createMarkers(map)
}
