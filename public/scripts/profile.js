

// Profile Form

$('.reviewer').change(function() {
  if($(this).is(':checked')) {
    $('#' + $(this).attr('id') + '-total').parent().show();
  } else {
    $('#' + $(this).attr('id') + '-total').val('').parent().hide();
  }
});