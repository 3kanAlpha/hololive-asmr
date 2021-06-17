
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
        $.getJSON('assets/data_20210617_123937.json', function(e) {
            data = e;
            videos = data['videos'];
    
            console.log("JSON loaded successfully. size=" + videos.length);
        })
    ).done(buildList);
});

function buildList() {
    for (let i = 0; i < videos.length; i++) {
        const v = videos[i];
        const a = v.snippet.title;
        const b = v.snippet.channelTitle;
        const c = v.snippet.thumbnails.medium.url;
        const l = "https://www.youtube.com/watch?v=" + v.id.videoId;
        const d = v.snippet.publishedAt.substring(0, 10);

        vm.items.push({ title: a, name: b, img: c, link: l, date: d });
    }
}
