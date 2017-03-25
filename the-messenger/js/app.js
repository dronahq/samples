/* global $, alert,Handlebars, swal, Q, DronaHQ */
/* exported startDivBlock, stopDivBlock*/

'use strict';

//function: dronahq.download(get)
//call eg: fnOfflineRequestDronaHQ('getuser', 'userinfo.json', 'get', {})
//function: dronahq.upload(post)
//call eg: fnOfflineRequestDronaHQ('updateuser', '', 'POST', { "user_name": "Mr. Zing"});
//call eg: fnOfflineRequestDronaHQ('updateuser', '', 'POST', { "user_name": "Mr. Zing"}, 'file://profile_img.png');
function fnOfflineRequestDronaHQ(remURL, saveURL, dronaHQReqMethod, dronaHQReqData, reqImgURI) {

  var domainUrl = Config.API_URL;

  if (reqImgURI) {
    domainUrl = Config.FILE_HANDLER_URL;
  }

  remURL = domainUrl + remURL;
  //saveURL = cordova.file.dataDirectory + saveURL;
  saveURL = cordova.file.applicationStorageDirectory + 'files/CDZing/Downloads/' + saveURL;

  //get route data from offline data
  if (dronaHQReqMethod.toLowerCase() == 'get') {

    //DronaHQ.sync.download(remURL, saveURL);

  } else if (dronaHQReqMethod.toLowerCase() == 'post' || dronaHQReqMethod.toLowerCase() == 'put') {
    DronaHQ.sync.upload(remURL, dronaHQReqMethod, dronaHQReqData, reqImgURI);
  }
}
;

var allMsg = [];

var fnAjaxRequest = function (ajaxURL, ajaxReqMethod, ajaxReqData, onSucess, onError) {
  $.ajax({
    type: ajaxReqMethod,
    url: ajaxURL,
    data: ajaxReqData,
    success: onSucess,
    error: onError
  });
};

var startPageBlock = function () {
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

var startDivBlock = function ($e) {
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

var stopDivBlock = function ($e) {
  $e.unblock();
};

var stopPageBlock = function () {
  $.unblockUI();
};

var Msg = function () {
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

  var _getDronaHQUser = function () {
    var deferred = Q.defer();

    DronaHQ.user.getProfile(function (data) {
      deferred.resolve(data);
    },
      function (err) {
        deferred.reject(err);
      });

    return deferred.promise;
  };

  var _getUsers = function (fromStart) {


    if (fromStart) {
      _maxId = 0;
      $('#ulUserList').empty();
    }

    var fnSuccess = function (data) {
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

    var fnError = function () {
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

  var _getUser = function (uid, nonce) {
    var deferred = Q.defer();
    var fnSuccess = function (data) {
      if (data && data.length === 0) {

      }

      var userData = {
        tokenkey: Config.DronaHQ.API_KEY,
        nonce: nonce
      };

      var userTemplate = $('#tmpl-user').html();
      var template = Handlebars.compile(userTemplate);
      var userList = template(userData);

      $('#ulUserList').append(userList);

      _$ajaxLoader.addClass('hide');

      deferred.resolve(data);
    };

    var fnError = function () {
      deferred.reject();
    };

    var reqData = {
      tokenkey: Config.DronaHQ.API_KEY,
      nonce: nonce
    };


    fnAjaxRequest(Config.DronaHQ.API_URL + 'users/' + uid, 'GET', reqData, fnSuccess, fnError);

    return deferred.promise;
  }

  var _getPendingCount = function () {
    var deferred = Q.defer();

    DronaHQ.sync.getPendingUploadCount(function (count) {
      if (count && count > 0) {
        $('#dvShowPendCount').text('Pending count : ' + count);
        defered.resolve();
      }
    }, function (e) {
      deferred.reject();
    });

    return deferred.promise;
  }

  var _bindEventListeners = function () {
    //Choose user list
    $('#btnSelectUser').off('click').on('click', function () {

      //Make sure user has provided their message
      var userMessage = _$txtMessage.val();

      if (!userMessage) {
        //Shake it off
        _$txtMessage.addClass('animated shake').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
          $(this).removeClass('animated shake');
        });
        return;
      }


      _$dvMsgBox.addClass('animated slideOutLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $(this).removeClass('animated slideOutLeft').addClass('hide');
        _$dvUsrLst.removeClass('hide').addClass('animated slideInUp').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
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
    _$lnkBack.off('click').on('click', function (e) {
      e.preventDefault();

      //hide send
      _$lnkSend.addClass('hide');
      var backFrom = _$lnkBack.data('from');
      var backTo = _$lnkBack.data('to');
      if (backTo == 'home') {
        _$lnkBack.data('from', 'ulist').data('to', 'exit');
        _$dvUsrLst.addClass('animated slideOutRight').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
          $(this).removeClass('animated slideOutRight').addClass('hide');
          $(this).removeClass('animated slideOutRight');

          _$dvMsgBox.removeClass('hide').addClass('animated slideInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass('animated slideInDown');
          });
        });
      }
      else {
        DronaHQ.app.exitApp();
      }

    });

    //Search button
    _$btnSearch.off('click').on('click', function (e) {
      e.preventDefault();
      _$txtSearch.blur();

      _getUsers(true);
    });

    $('#frmSearch').on('submit', function (e) {
      e.preventDefault();
      _$txtSearch.blur();
      return false;
    });

    //Click on user list
    $('#ulUserList').off('click', '.js-userli').on('click', '.js-userli', function (e) {
      e.preventDefault();

      $(this).toggleClass('active');
    });

    //Send message
    _$lnkSend.on('click', function (e) {
      e.preventDefault();
      //Get the text message
      var yoMessage = _$txtMessage.val();
      var userMessage = _thisUser.name + ': ' + yoMessage;
      var userList = [];
      $('.js-userli.active').each(function (index, value) {
        userList.push($(value).data('userid'));
      });

      //startPageBlock();

      var fnSuccess = function () {
        //stopPageBlock();

        //Message sent
        swal({
          title: 'Nice!',
          text: 'Message has been sent',
          type: 'success'
        }, function () {
          window.location.reload(true);
        });

      };
      var fnError = function () {
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

      var reqData = {
        token_key: Config.DronaHQ.API_KEY,
        user_id: userList,
        message: userMessage,
        data: JSON.stringify(notiData)
      };

      //Ajax
      fnAjaxRequest(Config.DronaHQ.API_URL + 'v2/notifications', 'PUT', reqData, fnSuccess, fnError);

      // DronaHQ : offline
      fnOfflineRequestDronaHQ(Config.DronaHQ.API_URL + 'v2/notifications', '', 'PUT', JSON.stringify(reqData));
    });

    $('#btnSync').off('click').on('click', function () {
      DronaHQ.sync.refresh('upload');
    });
  };

  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  var _fnHandleNotification = function () {
    var notiId = getParameterByName('dm_noti_id');

    if (!notiId) {
      return;
    }

    DronaHQ.notification.getNotification(notiId, function (data) {

      $('#dvMsgContainer').append('<div class="m-t col-sm-2" id="dvMsgSender">' + data.sender.name + ' says:' + '</div><div class="m-t col-sm-8" id="dvMsgText">' + data.msg + '</div>')

      var msgItem = {}

      msgItem.name = data.sender.name;
      msgItem.msg = data.msg;

      allMsg.push(msgItem);

      DronaHQ.KVStore.setItem('offline-msg', JSON.stringify(allMsg), function () {
        //success callback
      }, function () {
        //fail callback
      });

      if (data.msg) {
        swal({
          title: data.sender.name + ' says:',
          text: data.msg,
          imageUrl: data.sender.profile_img || 'images/a0.png'
        });
      }
    },
      function (err) {
        console.log(err);
      });
  };

  var _fnGetOfflineMsg = function () {

    var deferred = Q.defer();

    DronaHQ.KVStore.getItem('offline-msg', function (data) {
      //success callback
      var value = data.value;

      var msgArr = JSON.parse(value);

      allMsg = msgArr;

      msgArr.each(function (o) {
        $('#dvMsgContainer').append('<div class="m-t col-sm-2" id="dvMsgSender">' + o.name + ' says:' + '</div><div class="m-t col-sm-8" id="dvMsgText">' + o.msg + '</div>')
      });

      deferred.resolve(value);
    }, function () {
      //fail callback
      deferred.reject();
    });

    return deferred.promise;
  }


  return {
    init: function () {
      _getDronaHQUser().then(function (userData) {
        _getUser(userData.uid, userData.nonce).then(function (data) {
          _getPendingCount().then(function () {
            $('#dvShowPendCountContainer').removeClass('hide');
          });
          _thisUser = userData;
          _fnGetOfflineMsg().then(function (data) {
            _fnHandleNotification();
            _bindEventListeners();
          })

        }, function (reason) {
          swal('error', 'Authentication fail');
        });
      });
    }
  };
};

$(document).on('deviceready', function () {

  var objMsg = new Msg();
  objMsg.init();
});