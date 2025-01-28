// all consolde logs are for debugging purposes


//checks if html is loaded
document.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOM fully loaded and parsed");
//timer elements and button initialization
    let timerDisplay = document.getElementById('timer-display');
    let progressBar = document.getElementById('progress-bar');
    let startBtn = document.getElementById('start-btn');
    let pauseBtn = document.getElementById('pause-btn');
    let resetBtn = document.getElementById('reset-btn');
    const backBtn = document.getElementById('back-btn');
// timer parameters
    let totalTime = 25 * 60; // 25 minutes in seconds
    let timeLeft = totalTime;
    let intervalId;
//updates the timer display
    function updateDisplay(timeLeft) {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Update progress bar
        let progress = ((totalTime - timeLeft) / totalTime) * 100;
        progressBar.value = progress;
    }
// button start function
    function startTimer() {
        console.log('Start button clicked');
        chrome.runtime.sendMessage({ action: "startTimer" });
    }
// button pause function
    function pauseTimer() {
        console.log('Pause button clicked');
        chrome.runtime.sendMessage({ action: "pauseTimer" });
    }
// button reset function
    function resetTimer() {
        console.log('Reset button clicked');
        chrome.runtime.sendMessage({ action: "resetTimer" });
    }
// button back to popup function
    function back() {
        console.log("Back button clicked");
        window.location.href = "popup.html"; // go back to the popup page
    }
// button click detection
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    backBtn.addEventListener('click', back);

    // retrieve the timer state when the popup is loaded
    chrome.runtime.sendMessage({ action: "getTimerState" }, (response) => {
        console.log('Received timer state:', response);
        timeLeft = response.timeLeft;
        totalTime = response.totalTime || totalTime; // Use the stored totalTime if available
        updateDisplay(timeLeft);
        if (response.isRunning) {
            // Clear any existing intervals
            if (intervalId) {
                clearInterval(intervalId);
            }
            // Update the display every second if the timer is running
            intervalId = setInterval(() => {
                chrome.storage.local.get('timeLeft', (result) => {
                    console.log('Updating display with time left:', result.timeLeft);
                    updateDisplay(result.timeLeft);
                });
            }, 1000);
        }
    });
});
