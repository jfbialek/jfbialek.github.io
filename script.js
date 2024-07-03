window.onload = function () {
    document.getElementById("input").focus();

    const wberImg = document.getElementById('wber.png');
    wberImg.addEventListener('click', handleWberClick);

    const nytImg = document.getElementById('nyt.png');
    nytImg.addEventListener('click', handleNytClick);
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
            url = elem.value ? "https://www.google.com/search?q=" + elem.value + "&tbm=nws&source=lnt&tbs=qdr:d" : "https://www.inoreader.com/all_articles";
            break;
        case 7:
            url = elem.value ? "https://en.wiktionary.org/wiki/Special:Search?search=" + elem.value : "https://en.wiktionary.org/wiki/Wiktionary:Main_Page";
            break;
        case 8:
            url = elem.value ? "https://thepiratebay0.org/s/?page=0&orderby=0&q=" + elem.value : "https://thepiratebay0.org/";
            break;
        case 9:
            url = elem.value ? "https://www.goodreads.com/search?q=" + elem.value : "https://www.goodreads.com/";
            break;
        case 10:
            url = elem.value ? "https://www.flightradar24.com/" + elem.value : "https://www.flightradar24.com/";
            break;
        case 11:
            url = elem.value ? "https://www.nytimes.com/crosswords/archive" + elem.value : "https://www.nytimes.com/crosswords/archive";
            break;
        case 12:
            url = elem.value ? "https://en.wikipedia.org/wiki/" + elem.value + "#Climate" : "https://www.wunderground.com/wundermap";
            break;
        case 13:
            url = "https://libbyapp.com/";
            break;
        case 15:
            url = elem.value ? "https://www.reddit.com/search/?q=" + elem.value : "https://reddit.com";
            break;
        case 16:
            url = elem.value ? "https://www.geocaching.com/play/results/?st=" + elem.value : "https://www.geocaching.com";
            break;
        case 17:
            url = "https://www.nytimes.com/games/wordle/index.html";
            break;
        case 18:
            url = "https://www.facebook.com/";
            break;
        case 20:
            url = elem.value ? "https://wordswithfriends.com/" + elem.value : "https://wordswithfriends.com/";
            break;
    }
    window.open(url, '_self');
}

document.addEventListener('keydown', (event) => {
    if (event.key === "Enter" || event.code === "Enter") {
        search(1);
    } else if (event.key === "Tab" || event.code === "Tab") {
        search(2);
    }
});

function handleWberClick(event) {
    console.log("Clicked WBER icon - opening audio stream in a popup");

    // URL of the audio stream
    const audioUrl = 'https://radio.monroe.edu/wber.mp3';

    // Options for the popup window
    const popupWidth = 400;
    const popupHeight = 200;
    const left = (window.screen.width - popupWidth) / 2;
    const top = (window.screen.height - popupHeight) / 2;
    const popupOptions = `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`;

    // Open the popup window with the audio stream
    const audioPopup = window.open(audioUrl, 'WBER Audio Stream', popupOptions);

    // Check if popup was blocked
    if (!audioPopup || audioPopup.closed || typeof audioPopup.closed === 'undefined') {
        alert('Popup blocked! Please allow popups for this site to listen to WBER.');
    }
}

function handleNytClick(event) {
    const nytImg = event.currentTarget;
    const rect = nytImg.getBoundingClientRect();
    const clickY = event.clientY - rect.top;
    const clickLocation = clickY >= rect.height / 2 ? 'bottom' : 'top';

    let url;
    if (clickLocation === 'top') {
        console.log("Clicked top half - Go to WSJ Homepage");
        url = "https://www.wsj.com/";
    } else {
        console.log("Clicked bottom half - Go to NYT Front Page");
        const currentDate = new Date();
        const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
        const currentDay = String(currentDate.getDate()).padStart(2, '0');
        const currentYear = currentDate.getFullYear();
        url = "https://static01.nyt.com/images/" + currentYear + "/" + currentMonth + "/" + currentDay + "/nytfrontpage/scan.pdf";
    }
    window.open(url, '_self');
}
