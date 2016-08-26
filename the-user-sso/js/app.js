/* global $, DronaHQ, Identicon */

var App = function () {
  var _getDefaultImage = function (inputHash) {
    // set up options
    var hash = 'myUnicodeUsername!' // Any unicode string
    var options = {
      background: [255, 255, 255, 255], // rgba white
      margin: 0.2, // 20% margin
      size: 290 // 420px square
    }

    // create a base64 encoded PNG
    var data = new Identicon(hash, options).toString()

    return 'data:image/png;base64, ' + data;
  }

  var _initUser = function () {
    DronaHQ.user.getProfile(function (uData) {
      console.log('User ID: ' + uData.uid)
      $('#spUserName').text(uData.name)
      $('#spUserEmail').text(uData.email)
      if (uData.designation) {
        $('#userDesg').removeClass('hide')
        $('#spUserDesg').text(uData.designation)
      }
      if (uData.profile_image) {
        $('#imgUserProfile').attr('src', uData.profile_image)
      } else {
        $('#imgUserProfile').attr('src', _getDefaultImage(uData.uid))
      }

      $('#spUserNonce').text(uData.nonce)
    })
  }

  return {
    init: function () {
      _initUser()
    }
  }
}

$(document).on('deviceready', function () {
  var objApp = new App()
  objApp.init()
})
