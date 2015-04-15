chrome.browserAction.onClicked.addListener(function(activeTab) {
    var newURL = "http://www.reddit.com";
    chrome.tabs.create({ url: newURL });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.newTab && request.newTab.length > 0) {
		chrome.tabs.create({url: request.newTab, active: request.makeActiveTab});
	}
});