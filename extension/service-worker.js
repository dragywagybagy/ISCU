chrome.action.onClicked.addListener(tab => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: () => {
            alert('You\'ve completed your assignment!');
        }
    });
});