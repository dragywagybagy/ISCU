chrome.alarms.onAlarm.addListener(alarm => {
    console.log('Alarm triggered:', alarm);
    const [_, task, time] = alarm.name.split('-');
    const reminderTime = new Date(parseInt(time));

    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'logo128.png',
        title: 'Tidy Task Reminder',
        message: `Reminder: ${task} at ${reminderTime.toLocaleString()}`
    }, function(notificationId) {
        console.log('Notification created:', notificationId);
    });
});