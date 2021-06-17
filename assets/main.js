
let data;
let videos;

$(function() {
    $.getJSON('assets/data_20210617_123937.json', function(e) {
        data = e;
        videos = data['videos']

        console.log("JSON loaded successfully. size=" + videos.length)
    });
});