var addInput = function() {
  var $li = $('#lookup_values_edit ul li').filter(':last');
  $li.after('<li><input type="text" name="lookup[values]" /></li>');
};

$(function() {
  $('a.add_new').click(addInput);

  $('a.remove').click(function() {
    $(this).parent().remove();
  });
});
