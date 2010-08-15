var Voting = { 
    init: function () {
        $('.vote-up').live('click', 'up', Voting.vote);
        $('.vote-down').live('click', 'down', Voting.vote);
    },
    vote: function (e) {
        var link = $(this);
        var votesContainer = link.parents('.votes');
        var score = votesContainer.find('strong');
        var votes = votesContainer.find('span');

        $.ajax({
            url: link.attr('href'),
            type: 'POST',
            data: {'vote': e.data},
            dataType: 'json',
            success: function(data){
                score.text(data.score);
                votes.text(data.votes + ' votes');
            }
        });          

        return false;
    }
};
