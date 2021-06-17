
const app = Vue.createApp({
    data() {
      return {
        items: []
      }
    },
    mounted() {
        console.log("App mounted.");
    }
});
const vm = app.mount('#list-parent');

let data;
let videos;

$(function() {
    $.when(
        $.getJSON('assets/data_20210617_174024.json', function(e) {
            data = e;
            videos = data['videos'];
    
            console.log("JSON loaded successfully. size=" + videos.length);
        })
    ).done(buildList);
});

// Return the random value in [0, max)
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function resetVM() {
    for (let i = 0; i < videos.length; i++) vm.items.pop();
}

function shuffleList(arr) {
    for (let i = arr.length; 1 < i; i--) {
        k = getRandomInt(i);
        [arr[k], arr[i - 1]] = [arr[i - 1], arr[k]];
    }

    return arr;
}

function buildList() {
    const sf = shuffleList(videos);

    for (let i = 0; i < videos.length; i++) {
        const v = sf[i];
        // エスケープ修正
        const a = v.snippet.title.replace(/&amp;/g, '&');
        const b = v.snippet.channelTitle;
        const c = v.snippet.thumbnails.medium.url;
        const l = "https://www.youtube.com/watch?v=" + v.id.videoId;
        const d = v.snippet.publishedAt.substring(0, 10);

        vm.items.push({ title: a, name: b, img: c, link: l, date: d });
    }
}

$(function() {
    const reb = document.getElementById("rebuild");
    reb.addEventListener('click', buildListByKeywords, false);
})

function buildListByKeywords() {
    const FORM = document.forms.search;
    const KEYWORDS = FORM.keywords.value;

    if (KEYWORDS.length == 0) return;

    const KEYWORD = KEYWORDS.split(' ');

    resetVM();

    const sf = shuffleList(videos);

    for (let i = 0; i < videos.length; i++) {
        let flag = false;

        const v = sf[i];
        // エスケープ修正
        const a = v.snippet.title.replace(/&amp;/g, '&');
        const b = v.snippet.channelTitle;
        const c = v.snippet.thumbnails.medium.url;
        const l = "https://www.youtube.com/watch?v=" + v.id.videoId;
        const d = v.snippet.publishedAt.substring(0, 10);

        for (let j = 0; j < KEYWORD.length; j++) {
            flag = flag || (a.includes(KEYWORD[j]));
            flag = flag || (b.includes(KEYWORD[j]));
        }

        if (flag) vm.items.push({ title: a, name: b, img: c, link: l, date: d });
    }
}