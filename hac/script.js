let startTime;
let elapsedTime = 0;
let count = 0;
let timerInterval;

document.addEventListener('DOMContentLoaded', (event) => {
    startTimer();
    document.getElementById('startButton').addEventListener('click', startTimer);
    document.getElementById('stopButton').addEventListener('click', stopTimer);
    document.getElementById('incrementButton').addEventListener('click', incrementCounter);
});

function startTimer() {
    if (!timerInterval) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTime, 1000);
    }
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTime() {
    elapsedTime = Date.now() - startTime;
    const elapsed = new Date(elapsedTime);
    const hours = String(elapsed.getUTCHours()).padStart(2, '0');
    const minutes = String(elapsed.getUTCMinutes()).padStart(2, '0');
    const seconds = String(elapsed.getUTCSeconds()).padStart(2, '0');
    document.getElementById('elapsedTime').innerText = `${hours}:${minutes}:${seconds}`;
}

function incrementCounter() {
    count++;
    document.getElementById('count').innerText = count;
    updateAverage();
}

function updateAverage() {
    const elapsedHours = elapsedTime / (1000 * 60 * 60);
    const average = elapsedHours ? Math.round(count / elapsedHours) : 0;
    document.getElementById('average').innerText = average;
}
