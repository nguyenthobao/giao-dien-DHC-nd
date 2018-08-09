$(document).ready(function () {
    $('#tab3').change(function () {
        /*Get all promotion*/
        getListPromotion()
    });
});

function getListPromotion() {
    $.ajax({
        url: baseApi + 'promotion/get-all-promotion',
        method: 'POST',
        dataType: 'json',
        success: function (result) {
            var promotionData = result.data.results;
            $('#list-promotion').html('');
            $.each(promotionData, function (k, v) {
                var promotion_image = JSON.parse(v.promotion_image);
                if(promotion_image[0]!=undefined)
                    promotion_image[0]=(promotion_image[0]).slice(0,4)+'s'+ (promotion_image[0]).slice(4);
                var html = '<div class="col-12 col-md-6 promotion-item" data-id="' + v.promotion_id + '">';
                html += '<img src="' + promotion_image[0] + '" title="' + v.promotion_name + '" alt="' + v.promotion_name + '">';
                html += '</div>';

                $('#list-promotion').append(html);
            })
        },
        error: function (e) {
            alert('Có lỗi');
        }
    });
}