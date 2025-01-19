chrome.action.onClicked.addListener(tab => {
    chrome.scripting.executeScript({
        targer : {tabId : tab.id},
        func: () => {
            alert('You"ve completed your assignment!')
        }

    })

}

)