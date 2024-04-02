window.onload = function() {
    document.getElementById("input").focus();
  };

function search(x) {
    var elem = document.getElementById('input');
    var url;
    switch (x) {
        case 0:
            if (elem.value == "")
                url = "https://duckduckgo.com/"
            else
                url = "https://duckduckgo.com/?q=" + (elem.value);
            break;

        case 1:
            if (elem.value == "")
                url = "https://google.com/"
            else
                url = "https://google.com/search?q=" + (elem.value);
            break;

        case 2:
            if (elem.value == "")
                url = "https://en.wikipedia.org/wiki/Main_Page"
            else
                url = "https://en.wikipedia.org/wiki/Special:Search?search=" + (elem.value);
            break;

        case 3:
            if (elem.value == "")
                url = "https://maps.google.com"
            else
                url = "https://maps.google.com/?q=" + (elem.value);
            break;

        case 4:
            if (elem.value == "")
                url = "https://translate.google.com/"
            else
                url = "https://translate.google.com/?q=" + (elem.value);
            break;

        case 5:
            if (elem.value == "")
                url = "https://www.youtube.com/feed/subscriptions"
            else
                url = "https://youtube.com/search?q=" + (elem.value);
            break;

        case 6:
            if (elem.value == "")
                url = "https://www.inoreader.com/all_articles"
            else
                url = "https://www.google.com/search?q=" + (elem.value) + "&tbm=nws&source=lnt&tbs=qdr:d";
            break;

        case 7:
            if (elem.value == "")
                url = "https://en.wiktionary.org/wiki/Wiktionary:Main_Page"
            else
                url = "https://en.wiktionary.org/wiki/Special:Search?search=" + (elem.value);
            break;

        case 8:
            if (elem.value == "")
                url = "https://thepiratebay0.org/"
            else
                url = "https://thepiratebay0.org/s/?page=0&orderby=0&q=" + (elem.value);
            break;

        case 9:
            if (elem.value == "")
                url = "https://www.goodreads.com/"
            else
                url = "https://www.goodreads.com/search?q=" + (elem.value);
            break;

        case 10:
            if (elem.value == "")
                url = "https://www.flightradar24.com/"
            else
                url = "https://www.flightradar24.com/" + (elem.value);
            break;

        case 11:
            if (elem.value == "")
                url = "https://www.nytimes.com/crosswords/archive"
            else
                url = "https://www.nytimes.com/crosswords/archive" + (elem.value);
            break;

        case 12:
            if (elem.value == "")
                url = "https://www.wunderground.com/wundermap"
            else
                url = "https://en.wikipedia.org/wiki/" + (elem.value) + "#Climate";
            break;

        case 13:
            if (elem.value == "")
                url = "https://www.cambly.com/en/tutor/schedule?calendar=schedule"
            else
                url = "https://www.cambly.com/en/tutor/schedule?calendar=schedule"
            break;

        case 14:
            const currentDate = new Date();
            const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
            const currentDay = String(currentDate.getDate()).padStart(2, '0');
            const currentYear = currentDate.getFullYear();
            if (elem.value == "")
                url="https://static01.nyt.com/images/" + currentYear + "/" + currentMonth + "/" + currentDay + "/nytfrontpage/scan.pdf"
            else
                url = "https://www.nytimes.com/search?query=" + (elem.value);
            break;

        case 15:
            if (elem.value == "")
                url = "https://reddit.com"
            else
                url = "https://www.reddit.com/search/?q=" + (elem.value);
            break;

        case 16:
            if (elem.value == "")
                url = "https://www.geocaching.com"
            else
                url = "https://www.geocaching.com/play/results/?st=" + (elem.value);
            break;

        case 17:
            if (elem.value == "")
                url = "https://www.nytimes.com/games/wordle/index.html"
            else
                url = "https://www.nytimes.com/games/wordle/index.html" + (elem.value);
            break;

        case 18:
            if (elem.value == "")
                url = "https://www.facebook.com/"
            else
                url = "https://www.facebook.com/" //+ (elem.value);
            break;

        case 19:
            if (elem.value == "")
            url = "https://wber.org/"
        else
            url = "https://wber.org/" + (elem.value);
        break;

        case 20:
            if (elem.value == "")
            url = "https://wordswithfriends.com/"
        else
            url = "https://wordswithfriends.com/" + (elem.value);
        break;
    }
    window.open(url, '_self');
}

document.addEventListener('keydown', (event) => {
    var name = event.key;
    var code = event.code;
    if(name=="Enter" || code=="Enter")
    search(1);
    else if(name=="Tab" || code=="Tab")
    search(2);
    else return(1);
})