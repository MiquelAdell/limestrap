function change_hidden_values($checkbox_or_radio){
    var id = $checkbox_or_radio.prop('id');
    var slug = id.split("_");
    slug = slug.shift();
    slug = slug.join("_");
    if($checkbox_or_radio.prop('checked') === true) {
        $('#answer'+slug).value(1);
        $('#java'+slug).value(1);
    } else {
        $('#answer'+slug).value(0);
        $('#java'+slug).value(0);
    }
}
