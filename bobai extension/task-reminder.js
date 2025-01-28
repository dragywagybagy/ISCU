// all consolde logs are for debugging purposes

// checks html is loaded first
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");
// initializes task reminder elements
    const timeInput = document.querySelector("#reminder-time");
    const taskInput = document.querySelector("#task-input");
    const reminderBtn = document.querySelector("#reminder-btn");
    const backBtn = document.querySelector("#back-btn");
    const tasksContainer = document.querySelector(".tasks-container");

    renderTasks();
// set reminder date and name
    reminderBtn.addEventListener("click", async () => {
        const reminderTime = timeInput.value;
        const task = taskInput.value;
// ensures both task and reminder time are entered
        if (!reminderTime || !task) {
            alert("Please enter both a reminder time and a task.");
            return;
        }

        const reminderDate = new Date(reminderTime);
        const currentTime = new Date();
// ensures reminder time is in the future
        if (reminderDate <= currentTime) {
            alert('Please set a future time for the reminder.');
            return;
        }
// sets task and time
        const taskObject = {
            taskId: `task-${Date.now()}`,
            task,
            time: reminderDate.getTime()
        };
//saves task to storage
        saveTask(taskObject);
    });

    backBtn.addEventListener("click", () => {
        window.location.href = "popup.html"; // go back to the popup oage
    });
});
//saves task to storage

function saveTask(taskObject) {
    chrome.storage.sync.get("tasks", function (data) {
        const tasks = data.tasks || [];
        const newTasks = [...tasks, taskObject];
// initializes chrome alarm
        chrome.storage.sync.set({ tasks: newTasks }, function () {
            document.getElementById('reminder-time').value = "";
            document.getElementById('task-input').value = "";
            renderTasks();
            setAlarm(taskObject);
        });
    });
}
// initializes chrome alarm

function setAlarm(taskObject) {
    const alarmName = `reminder-${taskObject.task}-${taskObject.time}`;
    chrome.alarms.create(alarmName, { when: taskObject.time }, () => {
        console.log(`Alarm created: ${alarmName} at ${new Date(taskObject.time)}`);
    });
}
// removce task button function
function removeTask(id) {
    chrome.storage.sync.get("tasks", function (data) {
        const tasks = data.tasks || [];
        const updatedTasks = tasks.filter((task) => task.taskId !== id);

        chrome.storage.sync.set({ tasks: updatedTasks }, function () {
            renderTasks();
        });
    });
}
// show task list
function renderTasks() {
    console.log("Rendering tasks...");
    chrome.storage.sync.get("tasks", function (data) {
        const tasks = data.tasks || [];
        const tasksContainer = document.querySelector('.tasks-container');
        tasksContainer.innerHTML = '';
        // task list html
        if (tasks.length > 0) {
            tasks.forEach(taskObject => {
                const taskElement = document.createElement('div');
                taskElement.classList.add('task-item');

                taskElement.innerHTML = `
                    <p><strong>Task:</strong> ${taskObject.task}</p>
                    <p><strong>Reminder Time:</strong> ${formatDateTime(new Date(taskObject.time))}</p>
                    <button class="button is-danger remove-btn">Remove</button>
                `;

                const removeButton = taskElement.querySelector('.remove-btn');
                removeButton.addEventListener('click', function () {
                    removeTask(taskObject.taskId);
                });

                tasksContainer.appendChild(taskElement);
            });
            //show if there are tasks
            tasksContainer.style.display = 'block'; 
        } else {
            // hide if none
            tasksContainer.style.display = 'none'; 
        }
    });
}
// reminder date formatting
function formatDateTime(date) {
    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
    });
}

// Initial render of tasks
renderTasks();
// create task alarm
chrome.alarms.onAlarm.addListener((alarm) => {
    console.log('Alarm triggered:', alarm);
    if (alarm.name) {
        const [_, task, time] = alarm.name.split('-');
        const reminderTime = new Date(parseInt(time));

        console.log(`Task: ${task}, Reminder Time: ${reminderTime}`);

        // Show notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'logo.png', 
            title: 'Bobai Reminder',
            message: `Reminder: ${task} at ${reminderTime.toLocaleString()}`
        }, function(notificationId) {
            console.log('Notification created:', notificationId);
        });
    }
});
