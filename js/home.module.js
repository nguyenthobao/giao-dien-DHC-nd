var pointData;
$(document).ready(function () {
    $('#search_place').select2();
    /*Get all point in home*/
    var that, isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    var x_before = 0, y_before = 0,
        urlAndroid = 'https://play.google.com/store/apps/details?id=vn.anvui.hotspringpark';
    urlIOs = 'https://itunes.apple.com/us/app/dhc-travel/id1381272202?l=vi&ls=1&mt=8';
    // $('#mapdhc').bind('touchmove', true);
    document.addEventListener('gesturestart', function (e) {
        if ( $(this).data("prevented") === true ) {
            $(this).data("prevented", false);
            return;
        }
        e.preventDefault();
    });
    document.addEventListener('touchmove', function (event) {
        if ( $(this).data("prevented") === true ) {
            $(this).data("prevented", false);
            return;
        }
        event = event.originalEvent || event;
        if (event.scale !== undefined && event.scale !== 1) {
            event.preventDefault();
        }
    }, false);
    document.documentElement.addEventListener('touchmove', function (event) {
        if ( $(this).data("prevented") === true ) {
            $(this).data("prevented", false);
            return;
        }
        event.preventDefault();
    }, false);
    $.ajax({
        url: baseApi + 'point/get-all-point',
        method: 'POST',
        dataType: 'json',
        success: function (result) {
            pointData = result.data.results;
            $('.point-list').html('');
            $.each(pointData, function (k, v) {
                if (v.point_type == 9) {
                    return;
                }
                html = '<div class="item-point" data-id="' + v.point_id + '">';
                var pointImage = JSON.parse(v.point_images);
                if (pointImage[0] != undefined)
                    pointImage[0] = (pointImage[0]).slice(0, 4) + 's' + (pointImage[0]).slice(4);
                html += '<img ' + (pointImage[0] != undefined ? 'src="' + pointImage[0] + '"' : '') + ' class="img-thumbnail" alt="' + v.point_name + '">';
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
            pointData.sort(function (a, b) {
                if (a.point_name < b.point_name) return -1;
                if (a.point_name > b.point_name) return 1;
                return 0;
            });
            var html_select = '';
            $.each(pointData, function (k, v) {
                html_select += '<li class="color_dropdown" data-top="' + v.long + '" data-left="' + v.lat + '" >' + v.point_name + '</li>';

            });
            $('#search_place').html(html_select);
            resetPoint();
            $('.label_instant').each(function () {
                if ($(this).data('lat') == 4310 && $(this).data('long') == 4104) {
                    $(this).attr('style', 'display:block;');
                }
            });
            $('.img_instant').each(function () {
                if ($(this).data('lat') == 4310 && $(this).data('long') == 4104) {
                    $(this).attr('style', 'display:block;');
                } else {
                    $(this).css('margin-top', '1px');
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
                var promotion_image = v.promotion_image;
                if (promotion_image != undefined && promotion_image != '')
                    promotion_image = (promotion_image).slice(0, 4) + 's' + (promotion_image).slice(4);
                var html = '<div class="col-12 col-md-6 promotion-item" data-id="' + v.promotion_id + '">';
                html += '<img src="' + promotion_image + '" title="' + v.promotion_name + '" alt="' + v.promotion_name + '">';
                html += '</div>';

                $('#list-promotion-home').append(html);
            })
        },
        error: function (e) {
            alert('Có lỗi');
        }
    });

    var img=document.getElementById('mapdhc');
    var hammer = new Hammer(img);
    hammer.get('pinch').set({ enable: true });
    hammer.on("pinch", function(e){
        $(img).css('transform','scale(' + e.scale + ')');
        $('.addCanvas').css('transform','scale(' + e.scale + ')');
         resetPoint();
    } );
    hammer.on( "pinchend", function( e ) {
        $(img).css('transform','scale(' + e.scale + ')');
        $('.addCanvas').css('transform','scale(' + e.scale + ')');
        resetPoint();
    } );
    $('body').on('click', '.fixed-top', function () {
        $('html').removeClass('height-screen');
        $('#content2').removeClass('color_content2');
        if (document.getElementsByTagName("label")[0].offsetLeft <= 0) {
            $('main > label').show();
            $('#content2').attr('style', 'margin-top: -50px;border: 0px;');
            document.getElementsByClassName('img-responsive')[0].scrollIntoView();
            $('#content2').hide();
            $('html').attr('style', '');
        } else {
            $('main > label').hide();
            $('#content2').show();
        }
    });
    $('body').on('click', '#mapdhc', function () {
        $('.img_instant').hide();
        $('.label_instant').hide();

    });
    $('body').on('click', '#tab2', function () {
        $('main > label').hide();
        $('.container').attr('style', 'min-width: 100%');
        $('main').attr('style', 'min-width: 100%');
        $('#content2').attr('style', 'margin-top: -100px;');
        $('#mapdhc').show();
        $('#download').show();
        $('#div_search').show();
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
                html += '<div class="col-12"><img src="' + result.data.result.promotion_image + '" alt=""></div>';
                html += '</div>';
                html += '<div class="row margin30 point-description">' + result.data.result.promotion_detail + '</div>';

                $('#form-body').html(html);
            },
            error: function (e) {
                alert('Có lỗi');
            }
        });
    });

    $('body').on('click', '.point-marker', function () {
        isMobile = {
            Android: function () {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function () {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function () {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };
        urlAndroid = 'https://play.google.com/store/apps/details?id=vn.anvui.hotspringpark';
        urlIOs = 'https://itunes.apple.com/us/app/dhc-travel/id1381272202?l=vi&ls=1&mt=8';

        if (isMobile.any() !== null) {
            if ((isMobile.any()[0] == 'iPhone' || isMobile.any()[0] == 'iPad' || isMobile.any()[0] == 'iPod') && urlIOs != '') {
                window.location.href = urlIOs;
            } else {
                window.location.href = urlAndroid;
            }
        } else {
            window.location.href = urlAndroid;
        }

    });

    $('body').on('click', '.book-seat', function () {
        window.location.href = "call://+84898181777";
    });

});
function resetPoint(){
    var scale=$('#mapdhc').css('transform')!='none'?parseFloat(($('#mapdhc').css('transform')).substring(7,14)):1;
if(scale<2 && scale>0.5) {
    $('.div_marker').each(function () {
        $(this).remove();
    });
    var html_marker = '';
    var marginLeftParent = ($('#mapdhc').width() - $('#mapdhc').width() * scale) / 2;
    var marginTopParent = ($('#mapdhc').height() - ($('#mapdhc').height()+250) * scale) / 2;
    $.each(pointData, function (k, v) {
        var pointImage = JSON.parse(v.point_images);
        if (pointImage[0] != undefined)
            pointImage[0] = (pointImage[0]).slice(0, 4) + 's' + (pointImage[0]).slice(4);
        var url = '';
        x = parseFloat(v.lat / parseFloat(9798 / ($('#mapdhc').width() * scale))) + marginLeftParent;
        y = parseFloat(v.long / parseFloat(7046 / ($('#mapdhc').height() * scale))) + marginTopParent;
        if (v.point_type == 3) url = '/images/play_marker.png';
        else if (v.point_type == 4) url = '/images/food_marker.png';
        else url = '/images/blank_marker.png';
        html_marker += '<div class="div_marker" data-id="' + v.point_id + '" data-lat="' + v.lat + '" data-long="' + v.long + '" style="z-index:' + parseInt(100 / (k + 1.1)) + ';margin-top:' + y + 'px; margin-left: ' + (x - 75) + 'px;    position: absolute; ">' +
            '<img data-lat="' + v.lat + '" data-long="' + v.long + '" src="' + url + '" data-x="' + x + '" data-y="' + y + '"  style="z-index:9;max-width: 20000px; width: 18px;margin-left: 75px; height: 25px" class="point_important img-fluid map" alt="">' +
            '<br><label data-id="' + v.point_id + '" id="label_' + x + '" class="label_instant" data-lat="' + v.lat + '" data-long="' + v.long + '">' + v.point_name + '</label><br>';
        if (v.point_images != '[]') html_marker += '<img data-id="' + v.point_id + '" id="img_' + x + '"  ' + (pointImage[0] != undefined ? 'src="' + pointImage[0] + '"' : '') + ' class="img_instant img-fluid map" alt="" data-lat="' + v.lat + '" data-long="' + v.long + '">';
        html_marker += '</div>';
    });
    $('#content2 .content .row').append(html_marker);
    $('.img_instant').hide();
    $('.label_instant').hide();
}
}