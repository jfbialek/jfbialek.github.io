window.onload = function () {
    // Keep your input focus
    const inputField = document.getElementById("input");
    if (inputField) inputField.focus();

    // Look for the NEW ID
    const comboImg = document.getElementById('radio-combo');

    if (comboImg) {
        console.log("Found the radio icon, attaching listener...");
        comboImg.addEventListener('click', function(event) {
            const rect = this.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const size = this.clientWidth; 

            if (x + y < size) {
                handleRadioClick('WBER', 'https://radio.monroe.edu/wber.mp3');
            } else {
                handleRadioClick('FM4', 'https://orf-live.ors-shoutcast.at/fm4-q2a');
            }
        });
    } else {
        // This will print in the Safari console if there is still an ID mismatch
        console.error("Could not find element with ID 'radio-combo'. Check your HTML!");
    }
};

function search(x) {
    var elem = document.getElementById('input');
    var url;
    switch (x) {
        case 0:
            url = elem.value ? "https://duckduckgo.com/?q=" + elem.value : "https://duckduckgo.com/";
            break;
        case 1:
            url = elem.value ? "https://google.com/search?q=" + elem.value : "https://google.com/";
            break;
        case 2:
            url = elem.value ? "https://en.wikipedia.org/wiki/Special:Search?search=" + elem.value : "https://en.wikipedia.org/wiki/Main_Page";
            break;
        case 3:
            url = elem.value ? "https://maps.google.com/?q=" + elem.value : "https://maps.google.com";
            break;
        case 4:
            url = elem.value ? "https://translate.google.com/?q=" + elem.value : "https://translate.google.com/";
            break;
        case 5:
            url = elem.value ? "https://youtube.com/search?q=" + elem.value : "https://www.youtube.com/feed/subscriptions";
            break;
        case 6:
            url = elem.value ? "https://varioustimes.ashbrookedu.com" + elem.value : "https://varioustimes.ashbrookedu.com";
            break;
        case 7:
            url = elem.value ? "https://en.wiktionary.org/wiki/Special:Search?search=" + elem.value : "https://en.wiktionary.org/wiki/Wiktionary:Main_Page";
            break;
        case 8:
            url = elem.value ? "https://gocharting.com/terminal/chart/kp2J9Bmam" : "https://gocharting.com/terminal/chart/kp2J9Bmam";
            break;
        case 9:
            url = elem.value ? "https://app.thestorygraph.com/browse?search_term=" + elem.value : "https://app.thestorygraph.com/";
            break;
        case 10:
            url = elem.value ? "https://www.flightradar24.com/" + elem.value : "https://www.flightradar24.com/";
            break;
        case 11:
            url = "https://chatgpt.com/";
            break;
        case 12:
            url = "https://gemini.google.com/app";
            break;
        case 13:
            url = "https://libbyapp.com/";
            break;
        case 14:
            url = "https://www.windy.com/";
            break;
        case 15:
            url = "https://radio.garden";
            break;
        case 16:
            url = elem.value ? "https://www.geocaching.com/play/results/?st=" + elem.value : "https://www.geocaching.com";
            break;
        case 17:
            url = "https://www.nytimes.com/games/wordle/index.html";
            break;
        case 18:
            url = "https://www.wsj.com/";
            break;
        case 20:
            url = elem.value ? "https://www.economist.com" + elem.value : "https://www.economist.com";
            break;
    }
    window.open(url, '_self');
}

document.addEventListener('keydown', (event) => {
    if (event.key === "Enter" || event.code === "Enter") {
        search(1);
    } else if (event.key === "Tab" || event.code === "Tab") {
        search(2);
    } else if (event.key === "\\" || event.code === "Backslash") {
        search(0);
    }
});

function handleRadioClick(stationName, audioUrl) {
    console.log(`Clicked ${stationName} - playing stream`);

    let audioElement = document.getElementById('wber-audio');
    let container = document.getElementById('wber-audio-container');

    if (!audioElement) {
        container = document.createElement('div');
        container.id = 'wber-audio-container';
        // Your exact styling from before
        container.style.cssText = "position:fixed; top:620px; left:50%; transform:translateX(-50%); display:flex; justify-content:center; align-items:center; background-color:#f0f0f0; padding:20px; border-radius:10px; box-shadow:0 0 10px rgba(0, 0, 0, 0.1); width:320px;";

        audioElement = document.createElement('audio');
        audioElement.id = 'wber-audio';
        audioElement.controls = true;
        audioElement.autoplay = true;
        audioElement.style.width = '100%';

        container.appendChild(audioElement);
        document.body.appendChild(container);
    }

    // This part is key: it swaps the source if you click the other half of the icon
    if (audioElement.src !== audioUrl) {
        audioElement.src = audioUrl;
        audioElement.volume = 0.10; // Back to your 10% preference
        audioElement.play().catch(error => console.log('Playback error:', error));
    }
}
