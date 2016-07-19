/* globals $ */
function userAuthSuccess () {
  $('#login').hide()
  $('#signup').hide()
  $('#logout').show()
}

function userAuthFailed () {
  // if login fails then we want to redirect as this page is secret
  $('#login').show()
  $('#signup').show()
  $('#logout').hide()
  // window.location.href = 'index.html'
}
