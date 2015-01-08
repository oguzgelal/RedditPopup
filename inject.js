var html = " \
<div class='popupFrame'> \
<div class='frameContainer'> \
<iframe src=''></iframe> \
</div> \
<div class='buttonContainer'> \
<div class='browseButton'>New Tab</div> \
<div class='closeButton'>Close</div> \
</div>\
</div>";

$(document).ready(function(){
	$('body').append(html);	
});

$(document).on('click', 'a.title', function(e){
	e.preventDefault();
	var url = $(this).prop('href');
	iframeOpen(url);
});

$(document).on('click', '.closeButton', function(){
	iframeClose();
});

$(document).on('click', '.browseButton', function(){
	var src = $('.popupFrame .frameContainer iframe').prop('src');
	window.open(src, '_new');
	iframeClose();
});



// Open up iframe
function iframeOpen(url){
  // Disable page scroll
  $('body').css('overflow', 'hidden');
  $('body').css('height', '100%');
  // Set iframe src and open popup
  $('.popupFrame .frameContainer iframe').prop('src', url);
  $('.popupFrame').fadeIn('fast');
}

// Close iframe
function iframeClose(){
  // Enable page scroll
  $('body').css('overflow', 'auto');
  $('body').css('height', 'auto');
  // Close popup
  $('.popupFrame').hide();
  $('.popupFrame .frameContainer iframe').prop('src', 'about:blank');
}