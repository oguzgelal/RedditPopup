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

var openButton = document.createElement("div");
openButton.id = "openButton";
openButton.innerHTML = "Open";
buttonContainer.appendChild(openButton);

var browseButton = document.createElement("div");
browseButton.id = "browseButton";
browseButton.innerHTML = "New Tab";
buttonContainer.appendChild(browseButton);

var closeButton = document.createElement("div");
closeButton.id = "closeButton";
closeButton.innerHTML = "Close";
buttonContainer.appendChild(closeButton);

var body = document.body;
body.appendChild(popupFrame);

var links = document.querySelectorAll("a.title");
for(var i = 0; i < links.length; i++) {
	links[i].addEventListener("click", function(e) {
		e.preventDefault();
		var url = this.href.replace(/http.?:\/\//, "//");
		if(e.ctrlKey || e.metaKey){
			window.open(url, '_new');
		} else {
			iframeOpen(url, this.innerHTML);
		}
		return false;
	})
}

openButton.addEventListener("mouseup", function(){
	document.location.href = contentFrame.src;
});

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

if(document.location.hash.indexOf("page=") >= 0) {
	var url = document.location.hash.replace("#page=", "");
	iframeOpen(url, "");
}

var checked = false, hasClosed, contentFrameBody, failedToLoad;
contentFrame.addEventListener("load", function() {
	contentFrame.style.display = "block";
	clearTimeout(failedToLoad);
	if(!checked) {
		checkForBack();
	}
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
    history.pushState({state: 1}, title, "#page=" + url);
    checked = false;
    failedToLoad = setTimeout(function() {
      contentFrameBody = contentFrame.contentWindow.document.querySelector("body");
      if(contentFrameBody && contentFrameBody.children.length == 0) {
        window.open(url.replace("//", "http://"), '_new');
        checked = true;
        iframeClose();
      }
    }, 5000);
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
  history.pushState({state: 1}, document.title, document.location.href.substring(0, document.location.href.indexOf("#page=")));
  clearInterval(hasClosed);
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
	checked = true;
	hasClosed = setInterval(function() {
		contentFrameBody = contentFrame.contentWindow.document.querySelector("body");
		if(popupFrame.className == "fadeIn" && (document.location.hash.indexOf("#page=") == -1 || document.location.hash.replace("#page=", "") != contentFrame.src.replace(/http.?:\/\//, "//") || (contentFrameBody && contentFrameBody.children.length == 0))) {
			iframeClose();
		}
	}, 100);
}