module('SpotManager.add');

test('Test button click', function(){
    stop();
    expect(4);

    /*
    var content = $('#content');

    equals(content.length, 1);
    equals(content.html(), '');

    SpotManager.init();
    var addButton = $('#add-spot')
    equals(addButton.length, 1);
    addButton.click();
    */

    setTimeout(function(){
        alert('xxx');
        ok(content.html() != '');
        start();
    }, 100);


});

start();
