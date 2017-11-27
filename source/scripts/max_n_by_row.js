jQuery( document ).ready(function( $ ) {
    if($('#question11992').length){
        $('#question11992').find(':checkbox').change(function() {
            if($(this).prop('checked') === true) {
                var tr = $(this).closest('tr');
                if(tr.find(':checked').length > 2){
                    alert("No es poden seleccioar més de 2 respostes per fila en aquesta pregunta");
                    $(this).prop('checked', false);
                    change_hidden_values($(this));
                }
            }
        });
    }
    if($('#question12065').length){
        $('#question12065').find(':checkbox').change(function() {
            if($(this).prop('checked') === true) {
                var tr = $(this).closest('tr');
                if(tr.find(':checked').length > 3){
                    alert("No es poden seleccioar més de 3 respostes per fila en aquesta pregunta");
                    $(this).prop('checked', false);
                    change_hidden_values($(this));
                }
            }
        });
    }
});
