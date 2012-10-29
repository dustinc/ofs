
// TODO: Ability to remove existing formatting - Regex check.


// Markdown tags

var tags = {
  header1: {start:'## ', end:''},
  header2: {start:'### ', end:''},
  header3: {start:'#### ', end:''},
  header4: {start:'##### ', end:''},
  italic: {start:'*', end:'*'},
  bold: {start:'**', end:'**'},
  link: {start:'[', end:'](1)'},
  image: {start:'![', end:'](1)'},
};


// Parse markdown and update preview

var mdToHTML = function(markdown) {
  $.get('/markdown',
    { markdown: markdown },
    function(data) {
      $('.md-editor-preview').html(data);
    }, 'html'
  );
};


$(function() {


  var $textarea = $('.md-editor-textarea');

  // Panel button click

  $('.md-editor-panel span').click(function() {

    var alltext = $textarea.val(),
        depressed,
        format = $(this).attr('data-md'),
        mdtext = alltext, mdtag = tags[format],
        range = { start: $textarea[0].selectionStart, end: $textarea[0].selectionEnd },
        $this = $('.md-editor-panel span[data-md='+format+']'),
        cursor_point = (range.end + mdtag.start.length),
        place_mdtags = true;;


    // Determine button depression (poor, sad button).

    if($this.hasClass('depressed')) {
      $this.removeClass('depressed');
      depressed = false;
    } else {
      $this.addClass('depressed');
      depressed = true;
    }


    if(depressed) {

      // If Link or Image promp for location
      // TODO: Image upload / Gallery select

      if(~$.inArray(format, ['link', 'image'])) {

        // Check for highlighted text

        if(range.start != range.end) {

          mdtag.end = mdtag.end.replace('1', prompt('Please enter location of ' + format));

        } else {

          place_mdtags = false;

          // Do not place tags.
          alert('Please select text first');

        }

      }


      // Place markdown tags
      if(place_mdtags) {
        mdtext = alltext.substring(0, range.start)
          + mdtag.start
          + alltext.substring(range.start, range.end)
          + mdtag.end
          + alltext.substring(range.end);
      }

    } else {

      // Put cursor outside tags
      cursor_point = cursor_point + ( (!depressed) ? mdtag.end.length : 0 );

    }


    // Place mdtext and focus cursor point

    $textarea.val(mdtext).focus(cursor_point, function(e) {
      e.target.selectionStart = e.target.selectionEnd = e.target.selectedStart = cursor_point;
    })
    .trigger('focus');


    // Parse mdtext and update preview
    mdToHTML(mdtext);

  });


  // Key commands

  $textarea.keydown(function(e) {

    // Store value on keydown to check diff on keyup
    this.previous_value = $(this).val();

    // TODO: Check textarea as target for all but 'save'

    if(e.ctrlKey && ~$.inArray(e.keyCode, [83, 73, 66])) {
      console.log('preventing default for ' + e);
      e.preventDefault();
    }

  }).keyup(function(e) {

    // Update live preview if changes were made

    if(this.previous_value != $(this).val()) {
      mdToHTML($(this).val());
    }


    if(e.ctrlKey) {

      switch(e.keyCode) {

        // s
        case 83:
          $('form').submit();
          e.preventDefault();
          return;
        // i
        case 73:
          $('.md-editor-panel span[data-md=italic]').trigger('click');
          e.preventDefault();
          return;
        // b
        case 66:
          $('.md-editor-panel span[data-md=bold]').trigger('click');
          e.preventDefault();
          return;

      }

    }

    return;
  });

});