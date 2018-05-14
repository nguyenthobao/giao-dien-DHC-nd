$(document).ready(function () {
    $('#tab4').change(function () {
        /*Get all news*/
        getListNews();
    });

    $('body').on('click', '.news-item', function () {
        var newsId = $(this).data('id');

        $.ajax({
            url: baseApi + 'news/get-news',
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                news_id: newsId
            }),
            success: function (result) {
                $('#modalForm').modal('show');
                $('#modalFormLabel').text(result.data.result.news_name);

                html = '<div class="row margin20">';
                html += '<div class="col-12 news-description">'+result.data.result.news_description+'</div>';
                html += '</div>';
                html += '<hr>';
                html += '<div class="col-12 news-content">'+result.data.result.news_content+'</div>';

                $('#form-body').html(html);
            },
            error: function (e) {
                alert('Có lỗi');
            }
        });
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
                var html = '<div class="col-12 col-lg-6 col-md-6 news-item" data-id="'+v.news_id+'">';
                html += '<div class="col-5 img-news" data-id="'+v.news_id+'">';
                html += '<img src="' + v.news_image + '" alt="'+ v.news_name +'">';
                html += '</div>';
                html += '<div class="col-7 news-content">';
                html += '<h6 class="news-title">'+ v.news_name +'</h6>';
                html += '<p class="news-note">'+ v.news_note +'</p>';
                html += '<div class="news-description">'+ v.news_description +'</div>';
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