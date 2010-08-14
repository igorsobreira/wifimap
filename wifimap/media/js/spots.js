var SpotManager = { 
    init: function () {
        
        $('#add-spot').unbind('click').click(function(){
            SpotManager.showForm();
            return false;
        });
        $('#submit-spot').unbind('click').click(function() {
            SpotManager.submitForm();
            return false;
        });
    },
    showForm: function () {
        $.ajax({
            url: '/spots/add/',
            method: 'GET',
            dataType: 'html',
            success: function(response){
                $('#content').html(response);
            }
        });
    },
    submitForm: function () {
        $('#add-spot-form').ajaxSubmit({
            success: function(response) { SpotManager.formSubmitted(response) }
        });
    },
    formSubmitted: function(response) {
        $('#content').html(response);
    }
};