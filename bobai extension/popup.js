// all consolde logs are for debugging purposes

// checks html is loaded first
document.addEventListener('DOMContentLoaded', function() {
    //initializes popup elements
    //of restricted tabs
    const restrictedTabsBtn = document.getElementById('restricted-tabs-btn');
    const restrictedTabsMenu = document.getElementById('restricted-tabs-menu');
    const restrictedTabsList = document.getElementById('restricted-tabs-list');
    const addTabBtn = document.getElementById('add-tab-btn');
    const tabNameInput = document.getElementById('tab-name');
    const tabUrlInput = document.getElementById('tab-url');
// of normal popup
    const taskReminderButton = document.getElementById('task-reminder');
    const calculatorButton = document.getElementById('calculator');
    const pomodoroTimerButton = document.getElementById('pomodoro-timer');
    const lockInOnRadio = document.getElementById('lock-in-on');
    const lockInOffRadio = document.getElementById('lock-in-off');
// reveals restricted tabs menu
    restrictedTabsBtn.onclick = () => {
        restrictedTabsMenu.classList.toggle('hidden');
        loadRestrictedTabs();
    };
// add restricted tab function
    addTabBtn.onclick = () => {
        const tabName = tabNameInput.value.trim();
        const tabUrl = tabUrlInput.value.trim();
        if (tabName && tabUrl) {
            chrome.storage.local.get('restrictedTabs', (result) => {
                const restrictedTabs = result.restrictedTabs || [];
                restrictedTabs.push({ name: tabName, url: tabUrl });
                chrome.storage.local.set({ restrictedTabs }, () => {
                    loadRestrictedTabs();
                    tabNameInput.value = '';
                    tabUrlInput.value = '';
                });
            });
        }
    };
// load restricted tabs function
    function loadRestrictedTabs() {
        chrome.storage.local.get('restrictedTabs', (result) => {
            const restrictedTabs = result.restrictedTabs || [];
            restrictedTabsList.innerHTML = '';
            restrictedTabs.forEach((tab, index) => {
                const li = document.createElement('li');
                li.textContent = `${tab.name} - ${tab.url}  `;
                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'Remove';
                removeBtn.classList.add('button', 'is-small', 'is-danger');
                removeBtn.onclick = () => {
                    removeRestrictedTab(index);
                };
                li.appendChild(removeBtn);
                restrictedTabsList.appendChild(li);
            });
        });
    }
// remove restricted tab function
    function removeRestrictedTab(index) {
        chrome.storage.local.get('restrictedTabs', (result) => {
            const restrictedTabs = result.restrictedTabs || [];
            restrictedTabs.splice(index, 1);
            chrome.storage.local.set({ restrictedTabs }, () => {
                loadRestrictedTabs();
            });
        });
    }
// redirects to task reminder page
    taskReminderButton.onclick = () => {
        console.log('Task Reminder button clicked');
        window.location.href = 'task-reminder.html'; 
    };
// redirects to calculator page
    calculatorButton.onclick = () => {
        console.log('Calculator button clicked');
        window.location.href = 'calculator.html'; 
    };
// redirects to pomodoro timer page
    pomodoroTimerButton.onclick = () => {
        console.log('Pomodoro Timer button clicked');
        window.location.href = 'pomodoro-timer.html'; 
    };
// checks lock in mode on
    lockInOnRadio.onclick = () => {
        console.log('Lock-in Mode turned on');
        chrome.runtime.sendMessage({ action: "lockInMode", state: "on" });
    };
// checks lock in mode off
    lockInOffRadio.onclick = () => {
        console.log('Lock-in Mode turned off');
        chrome.runtime.sendMessage({ action: "lockInMode", state: "off" });
    };

    // Retrieve the state of lock-in mode when the popup is loaded
    chrome.storage.local.get('lockInMode', (result) => {
        if (result.lockInMode === 'on') {
            lockInOnRadio.checked = true;
        } else {
            lockInOffRadio.checked = true;
        }
    });
});