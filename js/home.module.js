$(document).ready(function () {
    // $('#search_place').select2();
    /*Get all point in home*/
    $.ajax({
        url: baseApi + 'point/get-all-point',
        method: 'POST',
        dataType: 'json',
        success: function (result) {
            pointData = result.data.results;
            $('.point-list').html('');
            $.each(pointData, function (k, v) {
		if (v.point_type == 9)
		{
		  return;
		}
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
                        items: 2
                    },
                    1000: {
                        items: 4
                    }
                }
            });
            pointData.sort(function(a, b){
                if(a.point_name.charAt(0)=='Đ') return 1;
                if(a.point_name < b.point_name) return -1;
                if(a.point_name > b.point_name) return 1;
                return 0;
            });
            var html_select='<option></option>';
            $.each(pointData,function (k,v) {
                html_select+='<option data-top="'+v.long+'" data-left="'+v.lat+'">'+v.point_name+'</option>';
            });
            $('#search_place').html(html_select);
            // $('#search_place').select2();
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
                var html = '<div class="col-12 col-md-6 promotion-item" data-id="' + v.promotion_id + '">';
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
                        html += '<div class="container">';
                            html += '<div class="row margin30">';
                                html += '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">';
                                    html += '<button type="button" class="btn col-12 book-seat">Đặt chỗ</button>';
                                html += '</div>';
                                html += '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">';
                                    html += '<button type="button" class="btn col-12 point-marker">Chỉ đường</button>';
                                html += '</div>';
                            html += '</div>';
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
    $('body').on('click', '.fixed-top', function () {
        if (document.getElementsByTagName("label")[0].offsetLeft <= 0) {
            $('main > label').show();
            $('#content2').attr('style','margin-top: -50px;border: 0px;');
            document.getElementsByClassName('img-responsive')[0].scrollIntoView();
            $('#mapdhc').hide();
            $('#div_search').hide();
          $('#marker').hide();
        } else{
            $('main > label').hide();
        }
    });
    $('body').on('click','#mapdhc,.zoomImg',function () {
        // $('#marker').hide();
    });
    $('body').on('click','#tab2',function () {
        $('main > label').hide();
        $('.container').attr('style','min-width: 100%');
        $('main').attr('style','min-width: 100%');
        $('#content2').attr('style','margin-top: -100px;');
        $('#mapdhc').show();
    });
    $('body').on('click', '.promotion-item', function () {
        var promotionId = $(this).data('id');

        $.ajax({
            url: baseApi + 'promotion/get-promotion',
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                promotion_id: promotionId
            }),
            success: function (result) {
                $('#modalForm').modal('show');
                $('#modalFormLabel').text(result.data.result.promotion_name);

                html = '<div class="row img-point">';
                html += '<div class="col-12"><img src="'+result.data.result.promotion_image+'" alt=""></div>';
                html += '</div>';
                html += '<div class="row margin30 point-description">'+result.data.result.promotion_detail+'</div>';

                $('#form-body').html(html);
            },
            error: function (e) {
                alert('Có lỗi');
            }
        });
    });

    $('body').on('click', '.point-marker', function () {
        var isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function() {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };

        console.log(isMobile.any());

        urlAndroid = 'https://play.google.com/store/apps/details?id=vn.anvui.hotspringpark';
        urlIOs = 'https://itunes.apple.com/us/app/dhc-travel/id1381272202?l=vi&ls=1&mt=8';

        if(isMobile.any() !== null) {
            if((isMobile.any()[0] == 'iPhone' || isMobile.any()[0] == 'iPad' || isMobile.any()[0] == 'iPod') && urlIOs != '')
            {
                window.location.href = urlIOs;
            } else {
                window.location.href = urlAndroid;
            }
        } else {
            window.location.href = urlAndroid;
        }

    });

    $('body').on('click', '.book-seat', function () {
        window.location.href="call://+84898181777";
    });
});
