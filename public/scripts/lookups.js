var addRow = function() {
  var $li = $('#lookup_values_edit ul li').filter(':last');
  $li.after('<li><input type="text" name="lookup[values]" /><a href="#" class="expand button-box">expand</a> <a href="#" class="remove button-box">remove</a></li>');
  return false;
};

var expandRow = function() {
  var inpt = '<input type="text" name="lookup[values]" />';
  $(this).before(inpt);
  return cleanRow($(this).closest('li'));
};

var cleanRow = function($row) {
  var ri = $row.index();
  $row.find('input').each(function(i) {

    if(i == 0) {
      $(this).attr('name', 'lookup[values]['+ri+'][name]');
    } else {
      $(this).attr('name', 'lookup[values]['+ri+'][values][]');
    }

  })
};


$(function() {
  $('div#lookup_values_edit').on('click', 'a.add_new', addRow);

  $('div#lookup_values_edit').on('click', 'a.expand', expandRow);

  $('div#lookup_values_edit').on('click', 'a.remove', function() {
    $(this).parent().remove();
    return false;
  });
});