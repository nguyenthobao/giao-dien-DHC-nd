$(document).ready(function () {
    $('#tab2').change(function () {
        wheelzoom(document.querySelector('img.map', {initialZoom: 2}));
    });
});