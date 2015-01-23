var popupFrame = document.createElement("div");
popupFrame.id = "popupFrame";

var frameContainer = document.createElement("div");
frameContainer.id = "frameContainer";
popupFrame.appendChild(frameContainer);

var loadingSRC = chrome.extension.getURL("loading.html");
var iframe = document.createElement("iframe");
iframe.src = loadingSRC;
frameContainer.appendChild(iframe);

var buttonContainer = document.createElement("div");
buttonContainer.id = "buttonContainer";
popupFrame.appendChild(buttonContainer);

var browseButton = document.createElement("div");
browseButton.id = "browseButton";
browseButton.innerHTML = "New Tab";
buttonContainer.appendChild(browseButton);

var closeButton = document.createElement("div");
closeButton.id = "closeButton";
closeButton.innerHTML = "Close";
buttonContainer.appendChild(closeButton);

var body = document.getElementsByTagName("body")[0];
body.appendChild(popupFrame);

var links = document.querySelectorAll("a.title");
for(var i = 0; i < links.length; i++) {
	links[i].addEventListener("click", function(e) {
		e.preventDefault();
		var url = this.href;
		if(e.ctrlKey || e.metaKey){
			window.open(url, '_new');
		} else {
			iframeOpen(url);
		}
		return false;
	})
}

closeButton.addEventListener("mouseup", function(){
	iframeClose();
});

browseButton.addEventListener("mouseup", function(){
	window.open(iframe.src, '_new');
	iframeClose();
});

document.addEventListener("keyup", function(e) {
  if (e.keyCode == 27) {
  	iframeClose();
  }
});

document.querySelector("#popupFrame:not(#frameContainer)").addEventListener("mouseup", function(){
  iframeClose();
});



// Open up iframe
function iframeOpen(url){
  if (!allowedUrl(url)){
     window.open(url, '_new');
  } else {
    // Disable page scroll
    body.style.overflow = "hidden";
    body.style.height = "100%";
    // Set iframe src and open popup
    iframe.src = url;
    popupFrame.className = "fadeIn";
  }
}

// Close iframe
function iframeClose(){
  // Enable page scroll
  body.style.overflow = "auto";
  body.style.height = "100%";
  // Close popup
  popupFrame.className = "";
  iframe.src = loadingSRC;
}

// iFrames do not work on X-Frame-Options SAMEORIGIN sites
function allowedUrl(url){
  var notallowed = [
  "youtube.com",
  "youtu.be",
  "chrome.google.com/webstore",
  "twitter.com"
  ];
  for(var i = 0; i < notallowed.length; i++){
    var match = url.match(new RegExp(notallowed[i], 'gi'));
    if (match && match.length > 0){
      return false;
    }
  }
  return true;
}



