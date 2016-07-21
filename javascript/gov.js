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
  $(document).on('click', '#gov .one-item', function (event) {
    newid = $(this).attr('id')
    console.log(newid)
    showDetail(newid)
  })
  $(document).on('click', '.one-map-item', function (event) {
    var newid = $(this).attr('id')
    console.log(newid)
    showDetail(newid)
  })
  $(document).on('click', '#gov-show', function (event) {
    $('#gov').show()
    $('#gov-show').html('')
  })
  $('#add-gov-form').on('submit', function (event) {
    event.preventDefault()
    var formData = $(this).serialize()
    addGov(formData)
  })
  $('#edit-gov-form').on('submit', function (event) {
    event.preventDefault()
    var formData = $(this).serialize()
    editGov(formData, newid)
  })
  $(document).on('click', '#delete', function (event) {
    event.preventDefault()
    deleteGov(newid)
  })
})

// $(document).on('click', '.map-btn', function (event) {
//   console.log('map-btn clicked')
//   $('#header').toggleClass('hide')
//   $('#map').toggleClass('hide')
// })

function showDetail (newid) {
  $.get(serverURL + 'government-programs/' + newid)
    .done(function (data) {
      $('#header').hide()
      $('#gov').hide()
      $('#map').hide()

      $('#gov-show').html('')
      if ((data.government_program.logo === '') || (data.government_program.logo === undefined) || (data.government_program.logo === null)) {
        data.government_program.logo = 'img/default-logo.svg'
        console.log(data.government_program.logo)
      }
      if ((data.government_program.image === '') || (data.government_program.image === undefined) || (data.government_program.image === null)) {
        data.government_program.image = 'img/default-img.svg'
        console.log(data.government_program.image)
      }
      $('#gov-show').append(
        '<h4>' + data.government_program.name + '</h4>' +
        '<div id=' + data.government_program._id + ' class="one-item">' +
        '<img class="logo-all img-circle" src="' + data.government_program.logo + '"/>' +
        '<div class="item-blurb norm">' +
        '<p class="hyphenate"><a href="' + data.government_program.website + '">' + data.government_program.website + '</a></p>' +
        '<p class="grey 400">' + data.government_program.address + '</p>' +
        '<p class=" full grey 400">' + data.government_program.description + '</p></div></div>' +
        '<div class="image"><img src="' + data.government_program.image + '"/>' +
        '</div>' + '<h3 class="btn btn-md formbutton" data-toggle="modal" data-target="#editModal"><a href="#"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span>EDIT</a></h3>' +
        '<h3 class="btn btn-md formbutton" type="submit" id="delete"><a href="#"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>DELETE</a></h3>'
      )
      console.log(data.government_program.description)
      console.log(data.government_program.image)
    })
}

function getData () {
  $.get(serverURL + 'government-programs')
    .done(function (data) {
      data.forEach(function (datum) {
        if ((datum.logo === '') || (datum.logo === undefined) || (datum.logo === null)) {
          datum.logo = 'img/default-logo.svg'
          console.log(datum.logo)
        }
        $('#gov').append(
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

function addGov (formData) {
  $.ajax({
    type: 'POST',
    url: serverURL + 'government-programs',
    data: formData,
    success: function (response) {
      // then redirect
      window.location.href = 'govs.html'
    },
    error: function (xhr, ajaxOptions, thrownError) {
      // else output error
      console.log(xhr.status)
      console.log(thrownError)
      window.alert('add gov Failed')
    }
  })
}

function editGov (formData, newid) {
  $.ajax({
    type: 'PUT',
    url: serverURL + 'government-programs/' + newid,
    data: formData,
    success: function (response) {
      // then redirect
      window.location.href = 'govs.html'
    },
    error: function (xhr, ajaxOptions, thrownError) {
      // else output error
      console.log(xhr.status)
      console.log(thrownError)
      window.alert('edit Gov Program Failed')
    }
  })
}

function deleteGov (newid) {
  $.ajax({
    type: 'DELETE',
    url: serverURL + 'government-programs/' + newid,
    success: function (response) {
      // then redirect
      window.location.href = 'govs.html'
    },
    error: function (xhr, ajaxOptions, thrownError) {
      // else output error
      console.log(xhr.status)
      console.log(thrownError)
      window.alert('delete Gov Program Failed')
    }
  })
}

function createMarkers (map) {
  $.get(serverURL + 'government-programs')
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
