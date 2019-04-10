// Ensure that the full document has been downloaded, rendered, and the "DOM" has been created before you try and mess with it.
// "document ready" is a jQuery wrapper pattern that we use to ensure that this is the case

// Note that all of this DOM manipulation in the code below happens only in the browser.

// jQuery's core strength is to have fun in the browser and make things dynamic, but not permanent.

// All jQuery is, is a function (called $).
// It takes a parameter (a selector)
// It then calls one or more methods, each of which gets the element(s) that matched the selector as input



$(document).ready( () => {
  // basic syntax getter
  const test = $('li:first-child').text(); // returns the text of the targeted element ... this is a "getter"
  const getter = $('ul:first-child').html(); // returns the inner html of the targeted element ... this is a "getter"

  $('li:first').text('nicholas carignan is the best') // changes the text of the first li to ^ this is a "setter"
  $('li:first').html('<strong>nicholas the nicholas</strong>') // this is a setter

  $('ul').on('click', function() {
    // Within jquery methods, you reference the active element as $(this)
    // console.log(this);
    // console.log($(this));
    $(this).toggleClass('active');
  })

  $('ul').clone(true).attr('id', '').appendTo('main');

  //.each iterates over everything selected (like forEach)
  $('li').each(function(){
    $(this).text('gone'); // $(this) is the current li we are iterating on
  })

  $('li').each(function(){
    $(this).text( $(this).data('role') );
  })

  console.log($('ul:nth-child(2)').detach().prependTo('main'));

  console.log($('li').closest('ul'));


} );



