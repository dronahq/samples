/* global $, alert,Handlebars, swal, Q, DronaHQ */
/* exported startDivBlock, stopDivBlock*/

'use strict';

var fnAjaxRequest = function(ajaxURL, ajaxReqMethod, ajaxReqData, onSucess, onError) {
  $.ajax({
    type: ajaxReqMethod,
    url: ajaxURL,
    data: ajaxReqData,
    success: onSucess,
    error: onError
  });
};

var startPageBlock = function() {
  $.blockUI({
    message: '<p>please wait...</p>',
    css: {
      border: 'none',
      padding: '10px',
      backgroundColor: '#000',
      '-webkit-border-radius': '10px',
      '-moz-border-radius': '10px',
      opacity: 0.5,
      color: '#fff'
    }
  });
};

var startDivBlock = function($e) {
  $e.block({
    message: '<p>please wait...</p>',
    css: {
      border: 'none',
      padding: '20px',
      backgroundColor: '#000',
      '-webkit-border-radius': '10px',
      '-moz-border-radius': '10px',
      opacity: 0.5,
      color: '#fff'
    }
  });
};

var stopDivBlock = function($e) {
  $e.unblock();
};

var stopPageBlock = function() {
  $.unblockUI();
};

var Pigeon = function() {
  var _$dvMsgBox = $('#dvMsgBox');
  var _$dvUsrLst = $('#dvUserList');
  var _$dvMsgLst = $('#dvInbox');
  var _$txtMessage = $('#txtMessage');
  var _$lnkBack = $('#lnkBack');
  var _$lnkSend = $('#lnkSend');
  var _$btnSearch = $('#btnSeachUser');
  var _$txtSearch = $('#txtSeach');
  var _$ajaxLoader = $('#ajaxLoader');
  var _loadMore = true;
  var _maxId = 0;
  var _thisUser = {};
  var pictureSource; // picture source
  var destinationType; // sets the format of returned value
  var msgStore; //Data Store for caching messages

  var _getDronaHQUser = function() {
    var deferred = Q.defer();

    DronaHQ.user.getProfile(function(data) {
        deferred.resolve(data);
      },
      function(err) {
        deferred.reject(err);
      });

    return deferred.promise;
  };

  var _getUsers = function(fromStart) {
    if (fromStart) {
      _maxId = 0;
      $('#ulUserList').empty();
    }

    var fnSuccess = function(data) {
      if (data && data.length === 0) {
        _loadMore = false;
        return;
      }

      /*jshint camelcase:false*/
      _maxId = data[data.length - 1].user_id;
      /*jshint camelcase:true*/

      var userData = {
        user: data
      };

      var userTemplate = $('#tmpl-user').html();
      var template = Handlebars.compile(userTemplate);
      var userList = template(userData);

      $('#ulUserList').append(userList);

      _$ajaxLoader.addClass('hide');
    };

    var fnError = function() {
      alert('Ohoo!');
      _$ajaxLoader.addClass('hide');
    };

    _$ajaxLoader.removeClass('hide');

    var reqData = {
      tokenKey: Config.DronaHQ.API_KEY,
      maxUid: _maxId,
      gId: 0,
      uLimit: 50,
      search: _$txtSearch.val()
    };

    if (_loadMore) {
      fnAjaxRequest(Config.DronaHQ.API_URL + 'users', 'GET', reqData, fnSuccess, fnError);
    }
  };

  var _bindEventListeners = function() {
    //Choose user list
    $('#btnSelectUser').off('click').on('click', function() {

      //Make sure user has provided their message
      var userMessage = _$txtMessage.val();

      if (!userMessage) {
        //Shake it off
        _$txtMessage.addClass('animated shake').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
          $(this).removeClass('animated shake');
        });
        return;
      }


      _$dvMsgBox.addClass('animated slideOutLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $(this).removeClass('animated slideOutLeft').addClass('hide');
        _$dvUsrLst.removeClass('hide').addClass('animated slideInUp').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
          $(this).removeClass('animated slideInUp');
          //Show back button
          _$lnkBack.removeClass('hide').data('from', 'ulist').data('to', 'home');
          _$lnkSend.removeClass('hide');

          //Load users
          _getUsers(true);

        });
      });
    });

    //Back button
    _$lnkBack.off('click').on('click', function(e) {
      e.preventDefault();
      //Hide back button
      _$lnkBack.addClass('hide');
      _$lnkSend.addClass('hide');
      var backFrom = _$lnkBack.data('from');
      var backTo = _$lnkBack.data('to');

      _$dvUsrLst.addClass('animated slideOutRight').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $(this).removeClass('animated slideOutRight').addClass('hide');
        _$dvMsgBox.removeClass('hide').addClass('animated slideInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
          $(this).removeClass('animated slideInDown');
        });
      });
    });

    //Search button
    _$btnSearch.off('click').on('click', function(e) {
      e.preventDefault();
      _$txtSearch.blur();

      _getUsers(true);
    });

    $('#frmSearch').on('submit', function(e) {
      e.preventDefault();
      _$txtSearch.blur();
      return false;
    });

    //Click on user list
    $('#ulUserList').off('click', '.js-userli').on('click', '.js-userli', function(e) {
      e.preventDefault();

      $(this).toggleClass('active');
    });

    //Send message
    _$lnkSend.on('click', function(e) {
      e.preventDefault();
      //Get the text message
      var yoMessage = _$txtMessage.val();
      var userMessage = _thisUser.name + ': ' + yoMessage;
      var userList = [];
      $('.js-userli.active').each(function(index, value) {
        userList.push($(value).data('userid'));
      });
      
      startPageBlock();

      var fnSuccess = function() {
        stopPageBlock();

        //Message sent
        swal({
          title: 'Nice!',
          text: 'Message has been sent',
          type: 'success'
        }, function() {
          window.location.reload(true);
        });

      };
      var fnError = function() {
        stopPageBlock();

        swal({
          title: 'Ohoo!',
          text: 'Something went wrong, and it\'s not your fault!',
          type: 'error'
        });
      };

      var notiData = {
        msg: yoMessage,      
        sender: {
          id: _thisUser.id,
          name: _thisUser.name,
          profile_img: _thisUser.profile_image
        }
      };

      /*jshint camelcase:false*/
      var reqData = {
        token_key: Config.DronaHQ.API_KEY,
        user_id: userList,
        message: userMessage,
        data: JSON.stringify(notiData)
      };

      /*jshint camelcase:true*/
      fnAjaxRequest(Config.DronaHQ.API_URL + 'v2/notifications', 'PUT', reqData, fnSuccess, fnError);
    });
  };

  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  var _fnHandleNotification = function() {
    var notiId = getParameterByName('dm_noti_id');

    if (!notiId) {
      return;
    }

    DronaHQ.notification.getNotification(notiId, function(data) {
        if (data.msg) {
          swal({
            title: data.sender.name + ' says:',
            text: data.msg,
            imageUrl: data.sender.profile_img || 'images/a0.png'
          });
        }
      },
      function(err) {
        console.log(err);
      });
  };

  return {
    init: function() {
      _getDronaHQUser().then(function(userData) {
        _thisUser = userData;
        _fnHandleNotification();
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
        _bindEventListeners();
      });
    }
  };
};

$(document).on('deviceready', function() {
  var objPigeon = new Pigeon();

  objPigeon.init();
});