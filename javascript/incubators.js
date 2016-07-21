/* global $ google alert geocoder */
var serverURL = 'http://startups-sg.herokuapp.com/'

$(function () {
  $('#map').addClass('hide')
  $.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href)
    if (results) return results[1]
    return 0
  }
  var id = $.urlParam('id')
  if (id) {
    showDetail(id)
  } else {
    getData()
  }
  // listen for the form login
  var search
  var newid

  // Show individual item
  $(document).on('click', '#incubator .one-item', function (event) {
    newid = $(this).attr('id')
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
    addIncubator(formData)
  })
  $('#edit-incubator-form').on('submit', function (event) {
    event.preventDefault()
    var formData = $(this).serialize()
    editIncubator(formData, newid)
  })
  $(document).on('click', '#delete', function (event) {
    event.preventDefault()
    deleteIncubator(newid)
  })
})

$(document).on('click', '.map-btn', function (event) {
  console.log('map-btn clicked')
  $('#header').toggleClass('hide')
  $('#map').toggleClass('hide')
})

function showDetail (newid) {
  $.get(serverURL + 'incubator-accelerators/' + newid)
    .done(function (data) {
      $('#header').hide()
      $('#incubator').hide()
      $('#map').hide()

      $('#incubator-show').html('')
      if ((data.incubator_accelerator.logo === '') || (data.incubator_accelerator.logo === undefined) || (data.incubator_accelerator.logo === null)) {
        data.incubator_accelerator.logo = 'img/default-logo.svg'
        console.log(data.incubator_accelerator.logo)
      }
      if ((data.incubator_accelerator.image === '') || (data.incubator_accelerator.image === undefined) || (data.incubator_accelerator.image === null)) {
        data.incubator_accelerator.image = 'img/default-img.svg'
        console.log(data.incubator_accelerator.image)
      }
      $('#incubator-show').append(
        '<h4>' + data.incubator_accelerator.name + '</h4>' +
        '<div id=' + data.incubator_accelerator._id + ' class="one-item">' +
        '<img class="logo-all img-circle" src="' + data.incubator_accelerator.logo + '"/>' +
        '<div class="item-blurb norm">' +
        '<p class="hyphenate"><a href="' + data.incubator_accelerator.website + '">' + data.incubator_accelerator.website + '</a></p>' +
        '<p class="grey 400">' + data.incubator_accelerator.address + '</p>' +
        '<p class=" full grey 400">' + data.incubator_accelerator.description + '</p></div></div>' +
        '<div class="image"><img src="' + data.incubator_accelerator.image + '"/>' +
        '</div>' + '<h3 class="btn btn-md formbutton" data-toggle="modal" data-target="#editModal"><a href="#"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span>EDIT</a></h3>' +
        '<h3 class="btn btn-md formbutton" type="submit" id="delete"><a href="#"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>DELETE</a></h3>'
      )
      console.log(data.incubator_accelerator.description)
      console.log(data.incubator_accelerator.image)
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

function addIncubator (formData) {
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

function editIncubator (formData, newid) {
  $.ajax({
    type: 'PUT',
    url: serverURL + 'incubator-accelerators/' + newid,
    data: formData,
    success: function (response) {
      // then redirect
      window.location.href = 'incubators.html'
    },
    error: function (xhr, ajaxOptions, thrownError) {
      // else output error
      console.log(xhr.status)
      console.log(thrownError)
      window.alert('edit Incubator / Accelerator Failed')
    }
  })
}

function deleteIncubator (newid) {
  $.ajax({
    type: 'DELETE',
    url: serverURL + 'incubator-accelerators/' + newid,
    success: function (response) {
      // then redirect
      window.location.href = 'incubators.html'
    },
    error: function (xhr, ajaxOptions, thrownError) {
      // else output error
      console.log(xhr.status)
      console.log(thrownError)
      window.alert('delete Incubator / Accelerator Failed')
    }
  })
}

function createMarkers (map) {
  $.get(serverURL + 'incubator-accelerators')
    .done(function (data) {
      data.forEach(function (datum) {
        geocoder = new google.maps.Geocoder()
        console.log(datum.address, datum.name)
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

// SEARCH FUNCTION ALGOLIA
$(document).ready(function () {
  var client = algoliasearch('MSZ2UYVAZJ', '78510e196a674bb800715809fb0ad104')
  var index = client.initIndex('startup_index')
  var $input = $('input')
  autocomplete('#search-input', {hint: false}, [
    {
      source: autocomplete.sources.hits(index, {hitsPerPage: 5}),
      displayKey: 'name',
      templates: {
        suggestion: function (suggestion) {
          return suggestion._highlightResult.name.value
        }
      }
    }
  ]).on('autocomplete:selected', function (event, suggestion, dataset) {
    search = suggestion
    var confirmsearch = search._id
    showDetail(confirmsearch)
  })
// $input.keyup(function() {
//   index.search($input.val(), {
//     hitsPerPage: 10,
//     facets: '*'
//   }, searchCallback)
// }).focus()
})

function searchCallback (err, content) {
  if (err) {
    console.error(err)
    return
  }
  var $users = $('#users')
  $users.empty()
  for (var i = 0; i < content.hits.length; i++) {
    $users.append('<li>' + content.hits[i].name + '</li>')
  }
}
