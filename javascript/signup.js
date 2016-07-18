/* global $ */
var serverURL = 'http://localhost:3000/'

$(function () {
  // listen for the form login
  $('#register-form').on('submit', function (event) {
    event.preventDefault()
    var formData = $(this).serialize()
    signup(formData)
  })
})

function signup (formData) {
  $.ajax({
    type: 'POST',
    url: 'https://startups-sg.herokuapp.com/signup',
    data: formData,
    success: function (response) {
      // then redirect
      window.location.href = 'user.html'
    },
    error: function (xhr, ajaxOptions, thrownError) {
      // else output error
      console.log(xhr.status)
      console.log(thrownError)
      window.alert('Signup Failed')
    }
  })
}
