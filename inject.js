var html = " \
<div class='popupFrame'> \
<div class='frameContainer'> \
<iframe src='http://oguzgelal.com/redditpopup/loading.html'></iframe> \
</div> \
<div class='buttonContainer'> \
<div class='browseButton'>New Tab</div> \
<div class='closeButton'>Close</div> \
</div>\
</div>";

$(document).ready(function(){
	$('body').append(html);	
  $('.popupFrame .frameContainer iframe').prop('src', 'http://oguzgelal.com/redditpopup/loading.html');
});

$(document).on('click', 'a.title', function(e){
	e.preventDefault();
	var url = $(this).prop('href');
  if (e.ctrlKey || e.metaKey){ window.open(url, '_new'); }
  else { iframeOpen(url); }

});

$(document).on('click', '.closeButton', function(){
	iframeClose();
});

$(document).on('click', '.browseButton', function(){
	var src = $('.popupFrame .frameContainer iframe').prop('src');
	window.open(src, '_new');
	iframeClose();
});

$(document).keyup(function(e) {
  if (e.keyCode == 27) {
  	iframeClose();
  }
});

$(document).on('click', '.popupFrame:not(.frameContainer)', function(){
  iframeClose();
});



// Open up iframe
function iframeOpen(url){
  if (!allowedUrl(url)){ window.open(url, '_new'); }
  else {
    $('.popupFrame .frameContainer iframe').prop('src', 'http://oguzgelal.com/redditpopup/loading.html');
    // Disable page scroll
    $('body').css('overflow', 'hidden');
    $('body').css('height', '100%');
    // Set iframe src and open popup
    $('.popupFrame .frameContainer iframe').prop('src', url);
    $('.popupFrame').fadeIn('fast');  
  }
}

// Close iframe
function iframeClose(){
  // Enable page scroll
  $('body').css('overflow', 'auto');
  $('body').css('height', 'auto');
  // Close popup
  $('.popupFrame').hide();
  $('.popupFrame .frameContainer iframe').prop('src', 'http://oguzgelal.com/redditpopup/loading.html');
}

function allowedUrl(url){
  var allowed = true;
  var notallowed = [
  "youtube.com",
  "youtu.be",
  "chrome.google.com/webstore",
  "twitter.com"
  ];
  for(var i = 0; i < notallowed.length; i++){
    var match = url.match(new RegExp(notallowed[i], 'gi'));
    if (match && match.length > 0){
      allowed = false;
    }
  }
  return allowed;
}



