const taskReminderButton = document.getElementById('task-reminder');
const calculatorButton = document.getElementById('calculator');
const pomodoroTimerButton = document.getElementById('pomodoro-timer');
const featureButton = document.getElementById('feature');

taskReminderButton.onclick = () => {
    console.log('Task Reminder button clicked');
    window.location.href = 'task-reminder.html'; // Change to the desired URL
};

calculatorButton.onclick = () => {
    console.log('Calculator button clicked');
    window.location.href = 'calculator.html'; // Change to the desired URL
};

pomodoroTimerButton.onclick = () => {
    console.log('Pomodoro Timer button clicked');
    window.location.href = 'pomodoro-timer.html'; // Change to the desired URL
};

featureButton.onclick = () => {
    console.log('Feature button clicked');
    window.location.href = 'feature.html'; // Change to the desired URL
};

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
    }).catch(function(error) {
        console.log('Service Worker registration failed:', error);
    });
}