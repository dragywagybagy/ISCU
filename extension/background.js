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

chrome.alarms.onAlarm.addListener(alarm => {
    const [_, task, time] = alarm.name.split('-');
    const reminderTime = new Date(parseInt(time));

    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'logo128.png',
        title: 'Tidy Task Reminder',
        message: `Reminder: ${task} at ${reminderTime.toLocaleString()}`
    });
});