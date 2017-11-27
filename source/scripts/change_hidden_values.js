function change_hidden_values($checkbox){
    var id = $checkbox.prop('id');
    var slug = id.split('_');
    slug.shift();
    slug = slug.join("_");
    if($checkbox.prop('checked') === true) {
        $('#answer'+slug).val(1);
        $('#java'+slug).val(1);
    } else {
        $('#answer'+slug).val(null);
        $('#java'+slug).val(null);
    }
}
