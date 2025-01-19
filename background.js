chrome.alarms.onAlarm.addListener((alarm) => {
    console.log('Alarm triggered:', alarm);
    if (alarm.name) {
        const [_, task, time] = alarm.name.split('-');
        const reminderTime = new Date(parseInt(time));

        // Show notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'logo128.png',
            title: 'Tidy Task Reminder',
            message: `Reminder: ${task} at ${reminderTime.toLocaleString()}`
        }, function(notificationId) {
            console.log('Notification created:', notificationId);
        });
    }
});

document.getElementById('reminder-btn').addEventListener('click', function() {
    const reminderTime = document.getElementById('reminder-time').value;
    const taskInput = document.getElementById('task-input').value;

    if (!reminderTime || !taskInput) {
        alert('Please enter both reminder time and task.');
        return;
    }

    const reminderDate = new Date(reminderTime);
    const currentTime = new Date();

    if (reminderDate <= currentTime) {
        alert('Please set a future time for the reminder.');
        return;
    }

    const timeDifference = reminderDate - currentTime;
    const alarmName = `reminder-${taskInput}-${reminderDate.getTime()}`;

    chrome.alarms.create(alarmName, { when: reminderDate.getTime() }, () => {
        console.log(`Alarm created: ${alarmName} at ${reminderDate}`);
    });

    alert('Reminder set successfully!');

    addTaskToDOM(taskInput, reminderDate);
});

function addTaskToDOM(task, time) {
    const tasksContainer = document.querySelector('.tasks-container');
    const taskElement = document.createElement('div');
    taskElement.classList.add('task-item');

    taskElement.innerHTML = `
        <p><strong>Task:</strong> ${task}</p>
        <p><strong>Reminder Time:</strong> ${formatDateTime(time)}</p>
        <button class="button is-danger remove-btn">Remove</button>
    `;

    const removeButton = taskElement.querySelector('.remove-btn');
    removeButton.addEventListener('click', function () {
        taskElement.remove();
    });

    tasksContainer.appendChild(taskElement);
}

function formatDateTime(date) {
    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
    });
}

chrome.alarms.onAlarm.addListener((alarm) => {
    console.log('Alarm triggered:', alarm);
    if (alarm.name) {
        const [_, task, time] = alarm.name.split('-');
        const reminderTime = new Date(parseInt(time));

        console.log(`Task: ${task}, Reminder Time: ${reminderTime}`);

        // Show notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'logo128.png',
            title: 'Tidy Task Reminder',
            message: `Reminder: ${task} at ${reminderTime.toLocaleString()}`
        }, function(notificationId) {
            console.log('Notification created:', notificationId);
        });
    }
});
