// Counter functionality
let count = 0;
let startTime = Date.now();
let worker = null;

function updateCounter() {
    count++;
    document.getElementById('counterButton').textContent = count;
    updateAveragePerHour();
}

function updateAveragePerHour() {
    const elapsedHours = (Date.now() - startTime) / 3600000;
    const averagePerHour = count / elapsedHours;
    document.getElementById('averagePerHour').textContent = averagePerHour.toFixed(2);
}

function updateTimeElapsed() {
    const elapsed = Date.now() - startTime;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    document.getElementById('timeElapsed').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

document.getElementById('counterButton').addEventListener('click', updateCounter);

// Countdown functionality
let countdownInterval = null;
let endTime = null;

function startCountdown() {
    const minutes = parseInt(document.getElementById('minutesInput').value);
    const seconds = parseInt(document.getElementById('secondsInput').value);
    const duration = minutes * 60 + seconds;
    endTime = Date.now() + duration * 1000;

    if (worker) {
        worker.postMessage({ action: 'startCountdown', endTime });
    } else {
        countdownInterval = setInterval(updateCountdown, 1000);
    }
}

function stopCountdown() {
    if (worker) {
        worker.postMessage({ action: 'stopCountdown' });
    } else {
        clearInterval(countdownInterval);
    }
}

function updateCountdown() {
    const remaining = Math.max(0, endTime - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    document.getElementById('remainingTime').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (remaining === 0) {
        stopCountdown();
        document.getElementById('alarmSound').play();
    }
}

document.getElementById('startButton').addEventListener('click', startCountdown);
document.getElementById('stopButton').addEventListener('click', stopCountdown);

// Web Worker for background tasks
if (window.Worker) {
    worker = new Worker('worker.js');
    worker.onmessage = function(e) {
        if (e.data.action === 'updateTimeElapsed') {
            document.getElementById('timeElapsed').textContent = e.data.time;
        } else if (e.data.action === 'updateCountdown') {
            document.getElementById('remainingTime').textContent = e.data.time;
            if (e.data.finished) {
                document.getElementById('alarmSound').play();
            }
        }
    };
    worker.postMessage({ action: 'start', startTime });
} else {
    setInterval(updateTimeElapsed, 1000);
}