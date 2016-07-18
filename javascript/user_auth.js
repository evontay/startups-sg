/* global $ pageReady */
var serverURL = 'http://localhost:3000/'
var currentUser = null

// We are assuming Local Storage is supported
$(function () {
  if (!window.localStorage['email'] || !window.localStorage['auth_token']) window.location.href = 'user.html'
  else loadUser()
})

// load the user from the server. This ensures we have a logged in user
function loadUser () {
  $.ajax({
    type: 'GET',
    url: 'https://startups-sg.herokuapp.com/user',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('User-Email', window.localStorage['email'])
      xhr.setRequestHeader('Auth-Token', window.localStorage['auth_token'])
    },
    success: function (response) {
      console.log(response)
      // asign the current user
      currentUser = response
      // tell the current page we are ready
      if (pageReady) pageReady()
    },
    error: function (xhr, ajaxOptions, thrownError) {
      // else error, redirect to login
      window.location.href = 'user.html'
    }
  })
}
