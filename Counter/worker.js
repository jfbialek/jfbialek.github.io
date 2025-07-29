let intervalId = null;
let countdownIntervalId = null;
let endTime = null;

self.onmessage = function(e) {
    if (e.data.action === 'start') {
        const startTime = e.data.startTime;
        intervalId = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const hours = Math.floor(elapsed / 3600000);
            const minutes = Math.floor((elapsed % 3600000) / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            self.postMessage({
                action: 'updateTimeElapsed',
                time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            });
        }, 1000);
    } else if (e.data.action === 'startCountdown') {
        endTime = e.data.endTime;
        countdownIntervalId = setInterval(() => {
            const remaining = Math.max(0, endTime - Date.now());
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            self.postMessage({
                action: 'updateCountdown',
                time: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
                finished: remaining === 0
            });
            if (remaining === 0) {
                clearInterval(countdownIntervalId);
            }
        }, 1000);
    } else if (e.data.action === 'stopCountdown') {
        clearInterval(countdownIntervalId);
    }
};