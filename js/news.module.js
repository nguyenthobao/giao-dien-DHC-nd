$(document).ready(function () {
    $('#tab4').change(function () {
        /*Get all news*/
        getListNews();
    });
});

function getListNews() {
    $.ajax({
        url: baseApi + 'news/get-all-news',
        method: 'POST',
        dataType: 'json',
        success: function (result) {
            var newsData = result.data.results;
            $('#list-news').html('');
            $.each(newsData, function (k, v) {
                var html = '<div class="col-12 col-lg-6 col-md-6 news-item">';
                html += '<div class="col-5 img-news">';
                html += '<a href="#"><img src="' + v.news_image + '" class="img-news" alt="'+ v.news_name +'"></a>';
                html += '</div>';
                html += '<div class="col-7 news-content">';
                html += '<a href="#">';
                html += '<h6 class="news-title">'+ v.news_name +'</h6>';
                html += '<p class="news-note">'+ v.news_note +'</p>';
                html += '<div class="news-description">'+ v.news_description +'</div>';
                html += '</a>';
                html += '</div>';
                html += '</div>';

                $('#list-news').append(html);
            })
        },
        error: function (e) {
            alert('Có lỗi');
        }
    });
}