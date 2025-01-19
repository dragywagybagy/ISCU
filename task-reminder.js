document.addEventListener("DOMContentLoaded", function () {
    const timeInput = document.querySelector("#reminder-time");
    const taskInput = document.querySelector("#task-input");
    const reminderBtn = document.querySelector("#reminder-btn");
    const tasksContainer = document.querySelector(".tasks-container");

    renderTasks();

    reminderBtn.addEventListener("click", async () => {
        const reminderTime = timeInput.value;
        const task = taskInput.value;

        if (!reminderTime || !task) {
            alert("Please enter both a reminder time and a task.");
            return;
        }

        const reminderDate = new Date(reminderTime);
        const currentTime = new Date();

        if (reminderDate <= currentTime) {
            alert('Please set a future time for the reminder.');
            return;
        }

        const taskObject = {
            taskId: `task-${Date.now()}`,
            task,
            time: reminderDate.getTime()
        };

        saveTask(taskObject);
    });
});

function saveTask(taskObject) {
    chrome.storage.sync.get("tasks", function (data) {
        const tasks = data.tasks || [];
        const newTasks = [...tasks, taskObject];

        chrome.storage.sync.set({ tasks: newTasks }, function () {
            // Clear the input fields
            document.getElementById('reminder-time').value = "";
            document.getElementById('task-input').value = "";
            renderTasks(); // Ensure tasks appear right away
            setAlarm(taskObject);
        });
    });
}

function setAlarm(taskObject) {
    const alarmName = `reminder-${taskObject.task}-${taskObject.time}`;
    chrome.alarms.create(alarmName, { when: taskObject.time }, () => {
        console.log(`Alarm created: ${alarmName} at ${new Date(taskObject.time)}`);
    });
}

function removeTask(id) {
    chrome.storage.sync.get("tasks", function (data) {
        const tasks = data.tasks || [];
        const updatedTasks = tasks.filter((task) => task.taskId !== id);

        chrome.storage.sync.set({ tasks: updatedTasks }, function () {
            renderTasks();
        });
    });
}

function renderTasks() {
    chrome.storage.sync.get("tasks", function (data) {
        const tasks = data.tasks || [];
        const tasksContainer = document.querySelector('.tasks-container');
        tasksContainer.innerHTML = '';

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
            tasksContainer.style.display = 'block'; // Show the container when there are tasks
        } else {
            tasksContainer.style.display = 'none'; // Hide the container when no tasks
        }
    });
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

// Initial render of tasks
renderTasks();

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
