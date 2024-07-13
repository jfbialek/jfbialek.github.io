let startTime;
let elapsedTime = 0;
let count = 0;
let timerInterval;

let countdownInterval;
const defaultMinutes = 28;
const defaultSeconds = 42;

document.addEventListener('DOMContentLoaded', (event) => {
    startTimer();
    document.getElementById('startButton').addEventListener('click', startTimer);
    document.getElementById('stopButton').addEventListener('click', stopTimer);
    document.getElementById('incrementButton').addEventListener('click', incrementCounter);

    document.getElementById('countdownStartButton').addEventListener('click', startCountdown);
    document.getElementById('countdownStopButton').addEventListener('click', stopCountdown);
    document.getElementById('countdownResetButton').addEventListener('click', resetCountdown);

    resetCountdown(); // Initialize countdown display
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

function startCountdown() {
    const minutes = parseInt(document.getElementById('minutes').value, 10) || 0;
    const seconds = parseInt(document.getElementById('seconds').value, 10) || 0;
    let totalSeconds = minutes * 60 + seconds;

    if (!countdownInterval && totalSeconds > 0) {
        countdownInterval = setInterval(() => {
            if (totalSeconds <= 0) {
                clearInterval(countdownInterval);
                countdownInterval = null;
                document.getElementById('alertSound').play();
                return;
            }
            totalSeconds--;
            const displayMinutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
            const displaySeconds = String(totalSeconds % 60).padStart(2, '0');
            document.getElementById('countdownDisplay').innerText = `${displayMinutes}:${displaySeconds}`;
        }, 1000);
    }
}

function stopCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

function resetCountdown() {
    stopCountdown();
    document.getElementById('minutes').value = String(defaultMinutes).padStart(2, '0');
    document.getElementById('seconds').value = String(defaultSeconds).padStart(2, '0');
    document.getElementById('countdownDisplay').innerText = `${String(defaultMinutes).padStart(2, '0')}:${String(defaultSeconds).padStart(2, '0')}`;
}
