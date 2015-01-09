chrome.browserAction.onClicked.addListener(function(activeTab) {
    var newURL = "http://www.reddit.com";
    chrome.tabs.create({ url: newURL });
});