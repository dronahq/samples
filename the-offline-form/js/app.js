var App = function() {

    var _bindEvents = function() {

        //Submit contact form via DronaHQ.sync.upload()        
        $('#btnSave').on('click', function(e) {
            e.preventDefault();

            var isFormValid  = $('#frmNewContact').form('is valid');
            if(!isFormValid){
                return;
            }
            $(this).addClass('loading');

            //Prepare the request object
            //The object will be submitted in the request body.
            var reqObj = {
                first_name: $('#txtFName').val(),
                last_name: $('#txtLName').val(),
                designation: $('#txtDesig').val(),
                company: $('#txtCompanyName').val(),
                phone_num: $('#txtPhone').val(),
                email: $('#txtEmail').val()
            }
            
            DronaHQ.sync.upload(CONFIG.API_URL, 'POST', reqObj);

            //Optionally awake the sync service.
            //Else, the submit will happen the next time service awakes.            
            DronaHQ.sync.refresh('upload');

            //Reset the form
            alert('Contact saved sucessfully. Will be synced soon.');
            $(this).removeClass('loading');
            $('#frmNewContact').form('clear');

            return false;
        });
    };

    var _initPlugins = function() {
        $('#frmNewContact')
            .form({
                inline: true,
                fields: {
                    fname: {
                        identifier: 'first-name',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter your first name'
                        }]
                    },
                    lname: {
                        identifier: 'last-name',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter your last name'
                        }]
                    },
                    desig: {
                        identifier: 'designation',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter your designation'
                        }]
                    },
                    company: {
                        identifier: 'company-name',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter your company name'
                        }]
                    },
                    phone: {
                        identifier: 'phone-num',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter your phone number'
                        }]
                    },
                    email: {
                        identifier: 'email',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter your email'
                        }, {
                            type   : 'email',
                            prompt : 'Please enter a valid e-mail'
                        }]
                    }
                }
            });
    }

    return {
        init: function() {
            _initPlugins();
            _bindEvents();
        }
    }
};

$(document).on('deviceready', function() {
    var objApp = new App();
    objApp.init();
});