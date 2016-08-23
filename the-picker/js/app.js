var App = function() {
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
            },
            baseZ: 1040
        });
    };
    
    var stopPageBlock = function() {
        $.unblockUI();
    };

    var _onPhotoSuccess = function(imageUriToUpload){
        //Here we have the file URI of the image        
        //Upload to cloudniry using FileTransfer plugin

        startPageBlock();

        var fileName = imageUriToUpload.substr(imageUriToUpload.lastIndexOf('/') + 1);
        if (fileName.indexOf('.jpg') === -1) {
            fileName = fileName + '.jpg';
        }

        var url = encodeURI(CONFIG.CLOUDINARY.API_URL);
        var uploadOptions = {
            params: {
                upload_preset: CONFIG.CLOUDINARY.UPLOAD_PRESET
            },
            chunkedMode: true
        }

        var ft = new FileTransfer();
        ft.upload(imageUriToUpload, url, function(response) {
            stopPageBlock();
            alert('Image uploaded. Response: ' + JSON.stringify(response));
        }, function (e) {
            stopPageBlock();
            alert('Image upload failed. Reason: ' + JSON.stringify(e));
        }, uploadOptions);
    };
    
    var _onFail = function(){
        alert("Image capture failed because: " + message);
    };
    
    var _bindListeners = function() {
        //Close cd-popup
        $('.cd-popup').on('click', function(event) {
            if ($(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup')) {
                event.preventDefault();
                $(this).removeClass('is-visible');
            }
        });
        //close popup when clicking the esc keyboard button
        $(document).keyup(function(event) {
            if (event.which == '27') {
                $('.cd-popup').removeClass('is-visible');
            }
        });

        //Show cd-popup
        $('#btnChooseImg').on('click', function(e) {
            e.preventDefault();

            $('#popupImgChooser').addClass('is-visible');
        });

        //Click on Choose Camera
        $('#lnkChooseCamera').on('click', function(e){
            // Take picture using device camera
            navigator.camera.getPicture(_onPhotoSuccess, _onFail, {
                quality: 50,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                correctOrientation: true,
                saveToPhotoAlbum: false,
                allowEdit: false
            });

            $('#popupImgChooser').removeClass('is-visible');
            e.preventDefault();
        });

        $('#lnkChooseGallery').on('click', function(e) {

            navigator.camera.getPicture(_onPhotoSuccess, _onFail, {
                quality: 50,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                correctOrientation: true,
                saveToPhotoAlbum: false,
                allowEdit: false
            });

            $('#popupImgChooser').removeClass('is-visible');
            e.preventDefault();
        });
    };

    return {
        init: function() {
            _bindListeners();
        }
    }
}


//Listen for dronahq.js to get ready.
$(document).on('deviceready', function(e) {
    //Initialize the app once dronahq.js is ready.
    var objApp = new App();
    objApp.init();
});