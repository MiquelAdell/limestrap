jQuery( document ).ready(function( $ ) {
    if($('#question11992').length){
        $('#question11992').find('tr').each(function(){
            var tr = $(this);
            tr.find(':checkbox').last().change(function() {
                var lastCheckbox = $(this);
                if($(this).prop('checked') === true) {
                    var thisTr = $(this).closest('tr');
                    thisTr.find(':checkbox').prop('checked', false);
                    lastCheckbox.prop('checked', true);
                    thisTr.find(':checkbox').each(function(){
                        change_hidden_values($(this));
                    });
                }
            });
        });
    }
});
