var popupFrame = document.createElement("div");
popupFrame.id = "popupFrame";

var frameContainer = document.createElement("div");
frameContainer.id = "frameContainer";
popupFrame.appendChild(frameContainer);

var loadingFrame = document.createElement("iframe");
loadingFrame.id = "loadingFrame";
loadingFrame.src = chrome.extension.getURL("loading.html");
frameContainer.appendChild(loadingFrame);

var contentFrame = document.createElement("iframe");
contentFrame.id = "contentFrame";
frameContainer.appendChild(contentFrame);

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
			iframeOpen(url, this.innerHTML);
		}
		return false;
	})
}

closeButton.addEventListener("mouseup", function(){
	iframeClose();
});

browseButton.addEventListener("mouseup", function(){
	window.open(contentFrame.src, '_new');
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

var checked = false;
contentFrame.addEventListener("load", function() {
	contentFrame.style.display = "block";
	if(!checked) {
		checkForBack();
	}
});

contentFrame.addEventListener("unload", function() {
	iframeClose();
});

// Open up iframe
function iframeOpen(url, title){
  if (!allowedUrl(url)){
     window.open(url, '_new');
  } else {
    // Disable page scroll
    body.style.overflow = "hidden";
    body.style.height = "100%";
    // Set iframe src and open popup
    contentFrame.style.display = "none";
    contentFrame.src = url;
    popupFrame.className = "fadeIn";
    history.pushState({state: 1}, title, "?page=" + url);
    checked = false;
  }
}

// Close iframe
function iframeClose(){
  // Enable page scroll
  body.style.overflow = "auto";
  body.style.height = "100%";
  // Close popup
  popupFrame.className = "";
  contentFrame.src = "";
  history.pushState({state: 1}, document.title, location.href.substring(0, location.href.indexOf("?page=")));
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

function checkForBack() {
	var body;
	checked = true;
	var interval = setInterval(function() {
		body = contentFrame.contentWindow.document.querySelector("body");
		if(popupFrame.className == "fadeIn" && (location.search.indexOf("?page=") == -1 || (location.search.replace("?page=", "") + location.hash) != contentFrame.src || (body && body.children.length == 0))) {
			iframeClose();
			clearInterval(interval);
		}
	}, 100);
}