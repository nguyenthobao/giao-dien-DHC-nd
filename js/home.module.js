$(document).ready(function () {
    /*Get all point in home*/
    $.ajax({
        url: baseApi + 'point/get-all-point',
        method: 'POST',
        dataType: 'json',
        success: function (result) {
            pointData = result.data.results;
            $('.point-list').html('');
            $.each(pointData, function (k, v) {
                html = '<div class="item-point" data-id="' + v.point_id + '">';
                var pointImage = JSON.parse(v.point_images);
                html += '<img src="' + pointImage[0] + '" class="img-thumbnail" alt="' + v.point_name + '">';
                html += '<h5 class="point-title">' + v.point_name + '</h5>';
                html += '</div>';
                $('.point-list').append(html);
            });

            $(".point-list").owlCarousel({
                loop: false,
                margin: 10,
                nav: true,
                dots: false,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 4
                    },
                    1000: {
                        items: 4
                    }
                }
            });
        },
        error: function (e) {
            alert('Có lỗi');
        }
    });

    /*Get promotion limit 2*/
    $.ajax({
        url: baseApi + 'promotion/get-all-promotion',
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            limit: 2,
        }),
        success: function (result) {
            var promotionData = result.data.results;
            $('#list-promotion-home').html('');
            $.each(promotionData, function (k, v) {
                var html = '<div class="col-12 col-md-6 promotion-item">';
                    html += '<img src="' + v.promotion_image + '" title="' + v.promotion_name + '" alt="' + v.promotion_name + '">';
                    html += '</div>';

                $('#list-promotion-home').append(html);
            })
        },
        error: function (e) {
            alert('Có lỗi');
        }
    });

    $('body').on('click', '.item-point', function () {
        var pointId = $(this).data('id');

        $.ajax({
            url: baseApi + 'point/get-point',
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                point_id: pointId,
            }),
            success: function (result) {
                $('#modalForm').modal('show');
                console.log(result);
                $('#modalFormLabel').text(result.data.result.point_name);
                var pointImage = JSON.parse(result.data.result.point_images);
                html = '<div class="row img-point">';
                    html += '<div class="col-12"><img src="'+pointImage[0]+'" alt=""></div>';
                html += '</div>';
                html += '<div class="row margin30">';
                    html += '<div class="col-12">';
                        html += '<div class="row">';
                            html += '<h5 class="point-name col-12">'+result.data.result.point_name+'</h5>';
                            html += '<span class="point-note col-12">'+result.data.result.point_note+'</span>';
                        html += '</div>';
                        html += '<div class="row margin30">';
                            html += '<button type="button" class="btn col-5 book-seat">Đặt chỗ</button>';
                            html += '<button type="button" class="btn col-5 point-marker">Chỉ đường</button>';
                        html += '</div><hr>';
                        html += '<div class="row margin30 point-description">'+result.data.result.point_detail+'</div>';
                    html += '</div>';
                html += '</div>';
                $('#form-body').html(html);
            },
            error: function (e) {
                alert('Có lỗi');
            }
        });
    });
});