
const app = Vue.createApp({
    data() {
      return {
        items: [],
        init: false
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
    ).done(buildListByKeywords);
});

// Return a random value in [0, max)
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

function getNameById(channelId) {
    const chs = data['channels'];

    for (let i = 0; i < chs.length; i++) {
        const ch = chs[i];
        if (ch.channelId == channelId) return ch.name;
    }

    return "Unknown";
}

function fixTitle(s) {
    return s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

$(function() {
    const reb = document.getElementById("rebuild");
    reb.addEventListener('click', buildListByKeywords, false);
})

function buildListByKeywords() {
    const FORM = document.forms.search;
    const KEYWORDS = FORM.keywords.value;
    const hasKeywords = (KEYWORDS.length > 0);

    if (!hasKeywords && vm.init) return;

    const KEYWORD = KEYWORDS.split(' ');

    resetVM();

    const sf = shuffleList(videos);

    for (let i = 0; i < videos.length; i++) {
        let canPush = !hasKeywords;

        const v = sf[i];
        // エスケープ修正
        const a = fixTitle(v.snippet.title);
        const b = v.snippet.channelTitle;
        const n = getNameById(v.snippet.channelId);
        const c = v.snippet.thumbnails.medium.url;
        const l = "https://www.youtube.com/watch?v=" + v.id.videoId;
        const d = v.snippet.publishedAt.substring(0, 10);

        // OR検索
        for (let j = 0; j < KEYWORD.length; j++) {
            canPush = canPush || ((a + "@" + b + "@" + n).includes(KEYWORD[j]));
        }

        if (canPush) vm.items.push({ title: a, name: n, img: c, link: l, date: d });
    }

    if (!vm.init) vm.init = true;
}