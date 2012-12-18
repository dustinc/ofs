

// Profile Form

$('.reviewer').change(function() {
  if($(this).is(':checked')) {
    $('#' + $(this).attr('id') + '-total').parent().show();
  } else {
    $('#' + $(this).attr('id') + '-total').val('').parent().hide();
  }
});

var loadSuggestions = function loadSuggestions(name) {

  // Check for cached suggestions
  if(loadSuggestions.cache[name] != undefined) {
    return loadSuggestions.cache[name];
  }

  var suggestions;
  $.ajax({
    url: '/admin/lookup/load?name='+name,
    type: 'get',
    async: false,
    dataType: 'json',
    success: function(data) {
      loadSuggestions.cache[name] = data.values;
      suggestions = data;
    }
  });
  return suggestions;
};
loadSuggestions.cache = {};


$(function() {

  // Eligible Areas autocomplete - delegated
  $('form#profile-form').on('focus', 'input.suggest-eligible-area', function() {
    $('input.suggest-eligible-area').autocomplete({
      source: loadSuggestions('Eligible Areas')
    });
  });

  // Courses autocomplete - delegated
  $('form#profile-form').on('focus', 'input.suggest-course-taught', function() {
    $('input.suggest-course-taught').autocomplete({
      source: loadSuggestions('Courses ')
    });
  });

  $('#edit-profile-img').click(function() {
    $('#profile-img-form').slideToggle();
  });


});