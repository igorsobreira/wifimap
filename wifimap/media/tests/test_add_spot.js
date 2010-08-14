module('SpotManager.add');

asyncTest('Add button shows form', function(){
    expect(2);

    var content = $('#content');
    var addButton = $('#add-spot');

    equals(content.html(), '', 'Content div should be empty')

    SpotManager.init();

    addButton.click();

    setTimeout(function(){
        equals(content.find('form').length, 1, 'The form should be loaded.');
        start();
    }, 200);

});
