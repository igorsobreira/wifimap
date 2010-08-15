var Message = {
    success: function (message) {
        $.gritter.add({title: 'Success', text: message, image: '/media/images/success.png'});
    },
    error: function (message) {
        $.gritter.add({title: 'Error', text: message, image: '/media/images/error.png'});
    }
};
