
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
        $.getJSON('assets/data-20210619-192508.json', function(e) {
            data = e;
            videos = data['videos'];
    
            console.log("JSON loaded successfully. size=" + videos.length);
        })
    ).done(buildListByKeywords);
});

// [0, max)の整数値をとる一様乱数
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Appのdataの初期化
function resetVM() {
    while(vm.items.length > 0) vm.items.pop();
}

// Arrayをシャッフルする
function shuffleList(arr) {
    for (let i = arr.length; 1 < i; i--) {
        k = getRandomInt(i);
        [arr[k], arr[i - 1]] = [arr[i - 1], arr[k]];
    }

    return arr;
}

// channelIdから配信者名を逆引きする
function getNameById(channelId) {
    const chs = data['channels'];

    for (let i = 0; i < chs.length; i++) {
        const ch = chs[i];
        if (ch.channelId == channelId) return ch.name;
    }

    return "Unknown";
}

// エスケープされた文字の修正
function fixTitle(s) {
    return s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

$(function() {
    const reb = document.getElementById("rebuild");
    reb.addEventListener('click', buildListByKeywords, false);
})

let currentList;
// const VIDEOS_PER_PAGE = 30;

function buildListByKeywords() {
    const FORM = document.forms.search;
    const KEYWORDS = FORM.keywords.value;

    const arr = getFilteredList(KEYWORDS);
    currentList = shuffleList(arr);
    console.log(currentList.length + " videos loaded.");

    buildList(currentList);

    if (!vm.init) vm.init = true;
}

// 与えられたリストを表示させる
function buildList(toBuild) {
    resetVM();

    for (let i = 0; i < toBuild.length; i++) {
        const video = toBuild[i];
        const a = fixTitle(video.snippet.title);
        const n = getNameById(video.snippet.channelId);
        const c = video.snippet.thumbnails.medium.url;
        const l = "https://www.youtube.com/watch?v=" + video.id.videoId;
        const d = video.snippet.publishedAt.substring(0, 10);

        vm.items.push({ title: a, name: n, img: c, link: l, date: d });
    }
}

// OR検索する
function getFilteredList(filters) {
    const hasKeywords = (filters.length > 0);

    if (!hasKeywords) return videos;

    const KEYWORD = filters.split(' ');

    let ret = [];

    for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        const a = fixTitle(video.snippet.title);
        const b = video.snippet.channelTitle;
        const n = getNameById(video.snippet.channelId);

        let canPush = false;

        // OR検索
        for (let j = 0; j < KEYWORD.length; j++) {
            canPush = canPush || ((a + "@" + b + "@" + n).includes(KEYWORD[j]));
        }

        if (canPush) ret.push(video);
    }

    return ret;
}

// 現在表示されている動画からランダムに1つ選択
function getRandomVideoURL() {
    const i = getRandomInt(currentList.length);
    window.open("https://www.youtube.com/watch?v=" + currentList[i].id.videoId, '_blank');
}