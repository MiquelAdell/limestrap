jQuery( document ).ready(function( $ ) {
    var changing_tr = false;
    if($('#question11992').length){
        $('#question11992').find('tr').each(function(){
            var $tr = $(this);

            $tr.find(':checkbox').change(function() {
                if(!changing_tr){
                    changing_tr = true;
                    var $checkbox = $(this);
                    var $td = $checkbox.closest('td');

                    if($td.index()==$td.siblings().length){
                        //the last checkbox
                        if($(this).prop('checked') === true) {
                            $tr.find(':checkbox').prop('checked', false);
                            $checkbox.prop('checked', true);
                            $tr.find(':checkbox').each(function(){
                                change_hidden_values($(this));
                            });
                        }
                    } else {
                        //not the last checkbox
                        if($(this).prop('checked') === true) {
                            $tr.find(':checkbox').last().prop('checked', false);
                            change_hidden_values($tr.find(':checkbox').last());
                        }
                    }
                    changing_tr = false;
                }
            });

        });
    }
});
