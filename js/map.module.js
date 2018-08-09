$(document).ready(function () {
    var isMobile = {
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
    var heightmap;
    if (isMobile.any() != null) heightmap = 1200; else heightmap = 1450;
    urlAndroid = 'https://play.google.com/store/apps/details?id=vn.anvui.hotspringpark';
    urlIOs = 'https://itunes.apple.com/us/app/dhc-travel/id1381272202?l=vi&ls=1&mt=8';
    var topLeftRealX = 0;
    var topLeftRealY = 0;
    var scaleX = 1;
    var scaleY = 1;
    var x = -1, y = -1;
    $('#tab2').prop('checked', true);
    $('main > label').hide();
    $('.container').attr('style', 'min-width: 100%');
    $('main').attr('style', 'min-width: 100%');
    $('#content2').attr('style', 'margin-top: -100px;');
    if (isMobile.any() != null) $('html').attr('style', 'width:10000px;height:3000px');
    $('#marker').show();
    $('#mapdhc').show();
    $('#download').show();
    $('#div_search').show();
    getOriginal1(15.971174, 108.017871, 15.968976, 108.018555, 3725, 2183 + 15, 4311, 4103 + 15);
    into_map();
    $('#tab2').click(function () {
        into_map();
    });
    $('#tab2').change(function () {
      into_map();
    });
    function into_map(){
        var tryAPIGeolocation = function () {
            jQuery.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBZKcLL5G9t6MGhYHwl7JN50LEhvDysIZ8", function (success) {
                apiGeolocationSuccess({coords: {latitude: success.location.lat, longitude: success.location.lng}});
            }).fail(function (err) {
                    alert("API Geolocation error! " + err);
                    scroll(750,690,750,500);
                });
        };
        var apiGeolocationSuccess = function (position) {
            alert(2);
            x = parseFloat(getXPixcelValue(position.coords.latitude, position.coords.longitude));
            y = parseFloat(getYPixcelValue(position.coords.latitude, position.coords.longitude));
            x = x / (9798 / $('#mapdhc')[0].width);
            y = y / (7046 / heightmap);
            if (isMobile.any() == null) {
                alert(3);
                if (x > $('#mapdhc')[0].width || x < 0 || y > heightmap || y < 0) {
                    $('#marker').css("margin-top", 850 + "px");
                    $('#marker').css("margin-left", 920 + "px");
                    $('#marker').show();
                    $('.label_instant').each(function () {
                        if ($(this).data('lat') == 4310 && $(this).data('long') == 4104) {
                            $(this).attr('style', 'display:block;');
                        }
                    });
                    $('.img_instant').each(function () {
                        if ($(this).data('lat') == 4310 && $(this).data('long') == 4104) {
                            $(this).attr('style', 'display:block;');
                        }
                    });
                    scroll(x,y,x,y);
                } else {
                    scroll(750,690,950,890);
                    $('#marker').hide();
                }
                var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
                if (width > 1000) $('#download').hide();
            }
            else {
                alert(4);
                $('html').attr('style', 'width:10000px;height:3000px');
                $('html').addClass('height-screen');
                $('#content2').addClass('color_content2');
                if (x > $('#mapdhc')[0].width || x < 0 || y > heightmap || y < 0) {
                    alert(5);
                    scroll(750,690,750,500);
                }else{
                    alert(6);
                    $('#marker').css("margin-top", y + "px");
                    $('#marker').css("margin-left", x + "px");
                    $('#marker').show();
                    $('.label_instant').hide();
                    $('.img_instant').hide();
                    scroll(x,y,x,y);
                }
            }
        };

        var browserGeolocationSuccess = function (position) {
            // alert("Browser geolocation success!" +
            //     "lat = " + position.coords.latitude + "" +
            //     "lng = " + position.coords.longitude);
        };

        var browserGeolocationFail = function (error) {
            switch (error.code) {
                case error.TIMEOUT:
                    alert("Tìm kiếm vị trí của bạn quá thời gian cho phép");
                    break;
                case error.PERMISSION_DENIED:
                    if (error.message.indexOf("Only secure origins are allowed") == 0) {
                        tryAPIGeolocation();
                    }
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Trình duyệt bạn dùng không hỗ trợ tìm vị trí hoặc chức năng đã bị tắt");
                    break;
            }
        };

        var tryGeolocation = function () {
            console.log(navigator.geolocation);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    browserGeolocationSuccess,
                    browserGeolocationFail,
                    {maximumAge: 50000, timeout: 20000, enableHighAccuracy: true});
            }
        };

        tryGeolocation();
    }
    function scroll(xAndroid,yAndroid,xIOS,yIOS){
        setTimeout($('html').animate({
            scrollTop: yAndroid,
            scrollLeft:xAndroid
        }), 100);
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('safari') > -1) {
            sTimeout = setTimeout(function () {
                $('body').animate({
                    scrollTop: yIOS,
                    scrollLeft: xIOS
                })
            }.bind(this), 2000);
            Function.prototype.bind = function (parent) {
                var f = this;
                var args = [];

                for (var a = 1; a < arguments.length; a++) {
                    args[args.length] = arguments[a];
                }

                var temp = function () {
                    return f.apply(parent, args);
                }

                return (temp);
            }
        }
    }
    $('body').on('change', '#search_place', function () {
        if (isMobile.any() != null) $('html').attr('style', 'width:10000px;height:3000px');
        x = parseFloat($('#search_place option:selected').data('left') / (9798 / 2048));
        y = parseFloat($('#search_place option:selected').data('top') / (7046 / heightmap));
        $('.img_instant').each(function () {
            $('.img_instant').hide();
        });
        $('.label_instant').each(function () {
            $('.label_instant').hide();
        });
        $('.label_instant').each(function (){
            if ($(this).data('lat') == $('#search_place option:selected').data('left') && $(this).data('long') == $('#search_place option:selected').data('top')) {
                $(this).attr('style', 'display: block');
                $(this).show();
                return false;
            }
        });
        $('.img_instant').each(function () {
            if ($(this).data('lat') == $('#search_place option:selected').data('left') && $(this).data('long') == $('#search_place option:selected').data('top')) {
                $(this).attr('style', 'display:block;');
            }
        });
        scroll(x-200,y-150,x-200,y-150);
    });
    $('body').on('touchmove', '#mapdhc', function (event) {
        if (event.originalEvent.touches[0].pageX > 1200 || event.originalEvent.touches[0].pageY > 1200) {
            $('html').attr('style', '');
        }
    });
    $('body').on('click', '#mapdhc', function (e) {
        var offset = $(this).offset();
        if (e.pageX - offset.left > 1200 || e.pageY - offset.top > 1500)
            $('html').attr('style', '');
    });
    $('body').on('click', '#download', function () {

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
    $('body').on('click', '.item-point,.img_instant', function () {
        var pointId = $(this).data('id');
        var that = this;
        $.ajax({
            url: baseApi + 'point/get-point',
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                point_id: pointId,
            }),
            success: function (result) {
                if ((document.getElementById("content2")).offsetLeft > 0 && x > 0 && y > 0 && isMobile.any() != null)
                    $('#modalForm').attr('style', 'margin-top:' + (y - 50) + 'px;margin-left:' + (x - 300) + 'px');
                else
                    $('#modalForm').attr('style', '');
                $('#modalForm').modal('show');
                $('#modalFormLabel').text(result.data.result.point_name);
                var pointImage = JSON.parse(result.data.result.point_images);
                html = '<div class="row img-point">';
                html += '<div class="col-12"><img src="' + pointImage[0] + '" alt=""></div>';
                html += '</div>';
                html += '<div class="row margin30">';
                html += '<div class="col-12">';
                html += '<div class="row">';
                html += '<h5 class="point-name col-12">' + result.data.result.point_name + '</h5>';
                html += '<span class="point-note col-12">' + result.data.result.point_note + '</span>';
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
                html += '<div class="row margin30 point-description">' + result.data.result.point_detail + '</div>';
                html += '</div>';
                html += '</div>';
                $('#form-body').html(html);
                if (isMobile.any() != null) {
                    var body = $(window);
                    // Get modal size
                    var modal = $('#modalForm');
                    var w = modal.width();
                    var h = modal.height();
                    // Get window size
                    var bw = body.width();
                    var bh = body.height();
                    console.log($(that).parent().css("marginLeft").replace('px', ''));
                    // Update the css and center the modal on screen
                    $('#modalForm').css({
                        "position": "absolute",
                        "top": ((bh - h) / 2) + "px",
                        "bottom": "0px",
                        "left": ((bw - w) / 2) + "px"
                    });
                    $('#modalForm').animate({scrollTop: 0}, 'fast');
                }
            },
            error: function (e) {
                alert('Có lỗi');
            }
        });
    });
    var list_drop_index;
    $('body').on('click', '.point_important', function () {
        x = $(this).data('x');
        y = $(this).data('y');
        var that = this;
        list_drop_index = {};
        $('.point_important').each(function () {
            $(($(this).parent()).find('.img_instant')).hide();
            $(($(this).parent()).find('.label_instant')).hide();
            if (Math.abs($(that).data('lat') - $(this).data('lat')) > 500 || Math.abs($(that).data('long') - $(this).data('long')) > 500) {
                list_drop_index[$(this).css('z-index')] = this;
                $(this).css('z-index', '0');
            }
        });
        $.each(list_drop_index, function (k, v) {
            $(v).css('z-index', k);
        });
        $(($(this).parent()).find('.img_instant')).show();
        $(($(this).parent()).find('.label_instant')).show();
        setTimeout(document.getElementById('search_place').scrollIntoView(), 1000);
    });
    $('body').on('click', '#form-footer>button', function () {
        if (isMobile.any() != null) $('html').attr('style', 'width:10000px;height:3000px');
        if (x < 0 || y < 0) {
            x = 800;
            y = 700;
        }
        scroll(x-150,y,x-150,y);
    });

})
;

function getOriginal1(lat1, lng1, lat2, lng2, x1, y1, x2, y2) {
    var realX1 = getX1Value(lat1, lng1);
    var realX2 = getX1Value(lat2, lng2);
    var realY1 = getY1Value(lat1, lng1);
    var realY2 = getY1Value(lat2, lng2);
    topLeftRealX = realX1 - x1 * (realX2 - realX1) / (x2 - x1);
    topLeftRealY = realY1 - y1 * (realY2 - realY1) / (y2 - y1);
    var deltaX = realX2 - realX1;
    var deltaY = realY2 - realY1;
    scaleX = deltaX / (x2 - x1);
    scaleY = deltaY / (y2 - y1);
}

function getXPixcelValue(lat, lng) {
    var l1 = topLeftRealX;//-79815182.874506816,-80785543.091131881
    var xValue = getX1Value(lat, lng);
    return (xValue - l1) / scaleX;
}

function getYPixcelValue(lat, lng) {
    var l1 = topLeftRealY;
    var yValue = getY1Value(lat, lng);
    return (yValue - l1) / scaleY;
}

function getX1Value(late, lng) {
    var TILE_SIZE = 268435471;
    return TILE_SIZE * (0.5 + lng / 360);
}

function getY1Value(late, lng) {
    var siny = Math.sin(late * Math.PI / 180);
    var TILE_SIZE = 268435471;
    siny = (siny > -0.999999) ? siny : -0.999999;
    siny = (siny < 0.999999) ? siny : 0.999999;
    return TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI));
}