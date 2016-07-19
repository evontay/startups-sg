/* global $ pageReady */
var serverURL = 'http://startups-sg.herokuapp.com/'
var currentUser = null

// We are assuming Local Storage is supported
$(function () {
  if (!window.localStorage['email'] || !window.localStorage['auth_token']) window.location.href = 'login.html'
  else loadUser()
})

// load the user from the server. This ensures we have a logged in user
function loadUser () {
  $.ajax({
    type: 'GET',
    url: serverURL + 'users/' + window.localStorage['id'],
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
      window.location.href = 'views/session/signin.html'
    }
  })
  if (currentUser) { $('#login').hide() }
  if (currentUser) { $('#signup').hide() }
}
