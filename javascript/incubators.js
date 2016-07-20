/* global $ google alert geocoder */
var serverURL = 'http://startups-sg.herokuapp.com/'

$(document).on('click', '.map-btn', function (event) {
  console.log('map-btn clicked')
  $('#header').toggleClass('hide')
  $('#map').toggleClass('hide')
})

$(function () {
  // listen for the form login
  getData()
  // Show individual item
  $(document).on('click', '#incubator .one-item', function (event) {
    var newid = $(this).attr('id')
    console.log(newid)
    showDetail(newid)
  })
  $(document).on('click', '.one-map-item', function (event) {
    var newid = $(this).attr('id')
    console.log(newid)
    showDetail(newid)
  })
  $(document).on('click', '#incubator-show', function (event) {
    $('#incubator').show()
    $('#incubator-show').html('')
  })
  $('#add-incubator-form').on('submit', function (event) {
    event.preventDefault()
    var formData = $(this).serialize()
    addincubator(formData)
  })
})

function showDetail (newid) {
  $.get(serverURL + 'incubator-accelerators/' + newid)
    .done(function (data) {
      $('#header').hide()
      $('#incubator').hide()
      $('#map').hide()

      $('#incubator-show').html('')
      if ((data.incubator.logo === '') || (data.incubator.logo === undefined) || (data.incubator.logo === null)) {
        data.incubator.logo = 'img/default-logo.svg'
        console.log(data.incubator.logo)
      }
      if ((data.incubator.image === '') || (data.incubator.image === undefined) || (data.incubator.image === null)) {
        data.incubator.image = 'img/default-img.svg'
        console.log(data.incubator.image)
      }
      $('#incubator-show').append(
        '<h4>' + data.incubator.name + '</h4>' +
        '<div id=' + data.incubator._id + ' class="one-item">' +
        '<img class="logo-all img-circle" src="' + data.incubator.logo + '"/>' +
        '<div class="item-blurb norm">' +
        '<p class="hyphenate"><a href="' + data.incubator.website + '">' + data.incubator.website + '</a></p>' +
        '<p class="grey 400">' + data.incubator.address + '</p>' +
        '<p class=" full grey 400">' + data.incubator.description + '</p></div></div>' +
        '<div class="image"><img src="' + data.incubator.image + '"/>' +
        '</div>'
      )
      console.log(data.incubator.description)
      console.log(data.incubator.image)
    })
}

function getData () {
  $.get(serverURL + 'incubator-accelerators')
    .done(function (data) {
      data.forEach(function (datum) {
        if ((datum.logo === '') || (datum.logo === undefined) || (datum.logo === null)) {
          datum.logo = 'img/default-logo.svg'
          console.log(datum.logo)
        }
        $('#incubator').append(
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

function addincubator (formData) {
  $.ajax({
    type: 'POST',
    url: serverURL + 'incubator-accelerators',
    data: formData,
    success: function (response) {
      // then redirect
      window.location.href = 'incubators.html'
    },
    error: function (xhr, ajaxOptions, thrownError) {
      // else output error
      console.log(xhr.status)
      console.log(thrownError)
      window.alert('add incubator Failed')
    }
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
