// all consolde logs are for debugging purposes

//checks for task reminders
chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name) {
        const taskId = alarm.name;
        chrome.storage.sync.get("tasks", function (data) {
            const tasks = data.tasks || [];
            const pendingTask = tasks.find((task) => task.taskId === taskId);
            console.log(pendingTask);
        });
    }
});
//sends task notification when times up
chrome.alarms.onAlarm.addListener(alarm => {
    const [_, task, time] = alarm.name.split('-');
    const reminderTime = new Date(parseInt(time));

    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'logo.png',
        title: 'Bobai Reminder',
        message: `Reminder: ${task} at ${reminderTime.toLocaleString()}`
    });
});
//checks if lock in mode is activated
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "lockInMode" && message.state === "on") {
        chrome.storage.local.set({ lockInMode: 'on' });
        closeRestrictedTabs();
    } else if (message.action === "lockInMode" && message.state === "off") {
        chrome.storage.local.set({ lockInMode: 'off' });
    }
});
//closes restricted tabs when lock in mode is on
function closeRestrictedTabs() {
    chrome.storage.local.get('restrictedTabs', (result) => {
        const restrictedTabs = result.restrictedTabs || [];
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {
                const restrictedTab = restrictedTabs.find(rt => tab.url.includes(rt.url));
                if (restrictedTab) {
                    chrome.tabs.remove(tab.id, () => {
                        sendLockInNotification(restrictedTab.name);
                    });
                }
            });
        });
    });
}
//checks if a tab is restricted
function isRestrictedTab(url, restrictedTabs) {
    return restrictedTabs.some(tab => url.includes(tab.url));
}
//sends notification when a restricted tab is closed
function sendLockInNotification(tabName) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'logo.png',
        title: 'Lock-In Mode',
        message: `Closed a restricted tab: ${tabName}`
    });
}
//checks if lock in mode is on to close restricted tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    chrome.storage.local.get(['lockInMode', 'restrictedTabs'], (result) => {
        if (result.lockInMode === 'on') {
            const restrictedTab = result.restrictedTabs.find(rt => tab.url.includes(rt.url));
            if (restrictedTab) {
                chrome.tabs.remove(tabId, () => {
                    sendLockInNotification(restrictedTab.name);
                });
            }
        }
    });
});
//sends notification when a restricted tab is closed

chrome.tabs.onCreated.addListener((tab) => {
    chrome.storage.local.get(['lockInMode', 'restrictedTabs'], (result) => {
        if (result.lockInMode === 'on') {
            const restrictedTab = result.restrictedTabs.find(rt => tab.url.includes(rt.url));
            if (restrictedTab) {
                chrome.tabs.remove(tab.id, () => {
                    sendLockInNotification(restrictedTab.name);
                });
            }
        }
    });
});
//pomodoro timer parameters
let timer;
let isRunning = false;
let timeLeft = 25 * 60; // 25 minutes in seconds
//sends notification if timeer is up
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startTimer") {
        if (!isRunning) {
            isRunning = true;
            timer = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    chrome.storage.local.set({ timeLeft });
                } else {
                    clearInterval(timer);
                    isRunning = false;
                    chrome.storage.local.set({ isRunning: false });
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: 'logo.png',
                        title: 'Pomodoro Timer',
                        message: 'Time is up!'
                    });
                }
            }, 1000);
            chrome.storage.local.set({ isRunning: true });
        }
    } else if (message.action === "pauseTimer") { //pauses timer
        if (isRunning) {
            clearInterval(timer);
            isRunning = false;
            chrome.storage.local.set({ isRunning: false });
        }
    } else if (message.action === "resetTimer") { //resets timer
        clearInterval(timer);
        isRunning = false;
        timeLeft = 25 * 60; // Reset to 25 minutes
        chrome.storage.local.set({ timeLeft, isRunning: false });
    } else if (message.action === "getTimerState") { //gets timer state
        sendResponse({ timeLeft, isRunning });
    }
});