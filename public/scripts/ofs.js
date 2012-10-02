$(function() {


/*
 * semi-generic form functions
 */

// add new item
$('.item_list').on('click', '.add_item', function() {

  var $item_list = $(this).closest('.item_list');
      $last_item = $item_list.find('.item').filter(':last'),
      $item = $last_item.clone();

  // loop form fields
  $item.find('input, select').each(function() {

    var name_attr = $(this).attr('name'),
        ind = parseInt(name_attr.match(/\d+/)) + 1;


    // update name attr
    $(this).attr('name', name_attr.replace(/\d+/, ind));


    // clear values
    if($(this).attr('value')) {
      $(this).removeAttr('value');
    } else if($(this).attr('selected')) {
      $(this).removeAttr('selected');
    }

  });

  // place item
  $last_item.after($item);

});


// remove item (soft)
$('.item_list').on('click', '.remove_item', function() {
  $(this).closest('.item').remove();
});


});