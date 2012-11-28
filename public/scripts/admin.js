
$(function() {

  // toggle item values
  $('.toggle').click(function() {
    $('div.' + $(this).attr('id')).toggle();
    return false;
  });

  // lookups quick edit
  $('div#admin-sub-content').on('click', '.quick-edit span', function() {
    var $li = $(this).parent();
    $li.find('span.value').hide();
    $li.find('span.element').show();
    return false;
  });

  $('div#admin-sub-content').on('click', 'span.tools a', function() {
    var act = $(this).attr('class'),
        $li = $(this).closest('li.quick-edit'),
        $div,
        l_values = [],
        l_name;

    switch(act) {

      case 'remove':
      case 'save':

        $div = $li.closest('div');
        l_name = $div.find('input[type=hidden]').val();

        if(act == 'remove') {
          $li.remove();
        }

        $div.find('li').each(function() {
          l_values.push($(this).find('input').val());
        });

        $.post('/lookup/'+l_name+'/update',
          {'lookup': {'name': l_name, 'values': l_values}}
        ).success(function() {
          // add saved ui
          if(act != 'remove') {
            $li.find('span.value').html($li.find('span.element input').val());
            $li.find('span.element').hide();
            $li.find('span.value').show();
          }
        }).error(function() {
          // add error ui
        });

        break;

      case 'cancel':
        $li.find('span.element').hide();
        $li.find('span.value').show();
        break;

      case 'cancel-remove':
        $li.remove();
        break;
    }
    return false;
  });

  $('div#admin-sub-content').on('click', 'a.add', function() {
    var $ul = $(this).closest('ul.lookups'),
        $last_li = $ul.find('li').filter(':last');

    $.get('/admin/quick_edit_li',
      {lookup_value: ''}
    ).success(function(html) {
      $last_li.after(html);
      $ul.find('li.quick-edit').filter(':last').find('span.value').hide();
      $ul.find('li.quick-edit').filter(':last').find('span.element').show();
    });
    return false;
  });

  $('div#admin-sub-content').on('click', 'a.remove', function() {
    $(this).parent().remove();
    return false;
  });

  $('input#article-title').change(function() {
    var slug = $(this).val().replace(/(;|\||,|!|@|#|\$|\(|\)|<|>|\/|\"|\'|`|\\\|~|\{|\}|\[|\]|=|\+|\?|&|\*|\^)*/gi, '')
          .replace(/\s+/g, '-').toLowerCase();
    $('input#article-slug').val('/'+slug);
  });

});