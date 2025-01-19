chrome.action.onclicked.addlistener(tab => {
    chrome.scripting.executescript({
        targer : {tabID : tab.ID},
        func: () => {
            alert('You"ve completed your assignment!')
        }

    })

}

)