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

scanLinks(body);

openButton.addEventListener("mouseup", function(){
	clearInterval(hasClosed);
	window.open(contentFrame.src.replace("https://", "http://"), "_self");
});

closeButton.addEventListener("mouseup", function(){
	iframeClose();
});

browseButton.addEventListener("mouseup", function(){
	chrome.runtime.sendMessage({newTab: contentFrame.src});
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
	if(this.src.indexOf(location.hostname) >= 0 && this.contentDocument.location.hostname == location.hostname) {
		scanLinks(contentFrame.contentDocument);
	}
});

function scanLinks(container) {
	var links = container.querySelectorAll("a.title, a.thumbnail, .md a, a.author, .deepthread a, .pagename a, a.reddit-link-title, a.subreddit, a.comments, .domain a");
	for(var i = 0; i < links.length; i++) {
		links[i].addEventListener("click", function(e) {
			e.preventDefault();
			if(e.ctrlKey || e.metaKey){
				chrome.runtime.sendMessage({newTab: this.href});
			} else {
				iframeOpen(this.href, this.innerHTML);
			}
			return false;
		})
	}
}

// Open up iframe
function iframeOpen(url, title){
  if (!allowedUrl(url)){
     chrome.runtime.sendMessage({newTab: url});
  } else {
    // Disable page scroll
    body.style.overflow = "hidden";
    body.style.height = "100%";
    // Set iframe src and open popup
    contentFrame.style.display = "none";
    contentFrame.src = url.replace(/http.?:\/\//, "//");
    popupFrame.className = "fadeIn";
    history.pushState({state: 1}, title, "#page=" + url.replace(/http.?:\/\//, "//"));
    checked = false;
    failedToLoad = setTimeout(function() {
      contentFrameBody = contentFrame.contentWindow.document.querySelector("body");
      if(contentFrameBody && contentFrameBody.children.length == 0) {
        chrome.runtime.sendMessage({newTab: url});
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
		if(document.location.hash.indexOf("#page=") == -1 || document.location.hash.replace("#page=", "") != contentFrame.src.replace(/http.?:\/\//, "//") || (contentFrameBody && contentFrameBody.children.length == 0)) {
			iframeClose();
		}
	}, 100);
}