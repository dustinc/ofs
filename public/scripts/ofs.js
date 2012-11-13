

// flash message timeout

var flashTimeout = function() {
  if($('#messages').length == 0) return false;
  setTimeout(function() {
    $('#messages').slideUp('slow');
  }, 3000);
};


$(function() {

// init flash timeout
flashTimeout();


/*
 * generic stuffs
 */

$('body').on('click', 'a.delete', function() {
  return confirm('Are you sure you want to permanently delete?');
});



/*
 * semi-generic form functions
 */


// clear example values on focus

$('#top-login-form input').focus(function() {
  if($(this).val() == 'username' || $(this).val() == 'password') $(this).val('');
}).blur(function() {
  if($(this).val() == '') $(this).val($(this).attr('name'));
});


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


/*
 * Sign up form validation
 */

$('#signupform').submit(function() {
  var $form = $(this),
      error = false;

  // remove existing error messages
  $form.find('span.error').remove();

  $form.find('.notempty').each(function() {
    if($(this).val() == '') {
      $(this).after('<span class="error">Please Enter '+$(this).prev('label').text()+'</span>');
      error = true;
    }
  });


  if($form.find('#pw').val() != '') {
    if($form.find('#pw').val() != $form.find('#cpw').val()) {
      $form.find('#cpw').after('<span class="error">Password Does Not Match</span>');
      error = true;
    }
  } else {
    $form.find('#pw').after('<span class="error">Please Enter Password</span>');
    error = true;
  }

  if(error) return false;
});


/*
 * Article Comments
 */

// Toggle comment reply form display
$('#comments').on('click', '.comment-reply', function() {
  $(this).closest('.comment-form').find('form').slideToggle();
  return false;
});

});