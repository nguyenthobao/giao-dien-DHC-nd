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
    urlAndroid = 'https://play.google.com/store/apps/details?id=vn.anvui.hotspringpark';
    urlIOs = 'https://itunes.apple.com/us/app/dhc-travel/id1381272202?l=vi&ls=1&mt=8';
    var topLeftRealX = 0;
    var topLeftRealY = 0;
    var scaleX = 1;
    var scaleY = 1;
    var x = -1, y = -1;
    $('#div_search').show();
    getOriginal1(15.971174, 108.017871, 15.968976, 108.018555, 3725, 2183 + 15, 4311, 4103 + 15);
    $('#tab2').change(function () {
        var apiGeolocationSuccess = function (position) {
            // alert("API geolocation success!" +
            //     "lat = " + position.coords.latitude + "lng = " + position.coords.longitude);
            // var x= parseFloat( getXPixcelValue(position.coords.latitude,position.coords.longitude));
            // var y= parseFloat( getYPixcelValue(position.coords.latitude,position.coords.longitude));
            if (isMobile.any() == null) {
                x = parseFloat(getXPixcelValue(position.coords.latitude, position.coords.longitude) / (9798 / $('#mapdhc')[0].width));
                y = parseFloat(getYPixcelValue(position.coords.latitude, position.coords.longitude) / (7046 / $('#mapdhc')[0].height));
                if (x > $('#mapdhc')[0].width || x < 0 || y > $('#mapdhc')[0].height || y < 0) {
                    $('#marker').hide();
                } else {
                    $('#marker').css("margin-top", (y - 15) + "px");
                    $('#marker').css("margin-left", x + "px");
                    $('#marker').show();
                    document.getElementById('marker').scrollIntoView();
                }
                $('#download').hide();
            } else {
                $('#mapdhc').css('height', (($('#mapdhc').css('width')).substring(0, 4) / 1.39036) + 'px');
                $('#download').css('margin-top', ($('#mapdhc').css('height') + 5) + 'px');
                console.log(($('#mapdhc').css('width')).substring(0, 4) + '..' + ($('#mapdhc').css('width')).substring(0, 4) / ($('#mapdhc').css('height')).substring(0, 4));
                x = parseFloat(getXPixcelValue(position.coords.latitude, position.coords.longitude) / (9798 / ($('#mapdhc').css('width')).substring(0, 4)));
                y = parseFloat(getXPixcelValue(position.coords.latitude, position.coords.longitude) / (7046 / ($('#mapdhc').css('height')).substring(0, 4)));

                if (x > ($('#mapdhc').css('width')).substring(0, 4) || x < 0 || y > ($('#mapdhc').css('height')).substring(0, 4) || y < 0) {
                    $('#marker').hide();
                } else {
                    y -= 160;
                    x -= 15;
                    $('#marker').css("margin-top", y + "px");
                    $('#marker').css("margin-left", x + "px");
                    $('#marker').show();
                    document.getElementById('marker').scrollIntoView();
                }
            }
        };

        var tryAPIGeolocation = function () {
            jQuery.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBZKcLL5G9t6MGhYHwl7JN50LEhvDysIZ8", function (success) {
                apiGeolocationSuccess({coords: {latitude: success.location.lat, longitude: success.location.lng}});
            })
                .fail(function (err) {
                    $('#marker').hide();
                    alert("API Geolocation error! " + err);
                    console.log(err);
                });
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
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    browserGeolocationSuccess,
                    browserGeolocationFail,
                    {maximumAge: 50000, timeout: 20000, enableHighAccuracy: true});
            }
        };

        tryGeolocation();

    });
    $('body').on('change', '#search_place', function () {

        console.log($('#search_place option:selected').data('left'), $('#search_place option:selected').data('top'));
        console.log(($('#mapdhc').css('width')).substring(0, 4), ($('#mapdhc').css('height')).substring(0, 4));
        x = parseFloat($('#search_place option:selected').data('left') / (9798 / 2032));
        y = parseFloat($('#search_place option:selected').data('top') / (7046 / 1462));
        console.log(x, y);
        if (isMobile.any() != null) {
            y -= 160;
            x += 10;
        }
        $('#marker').show();
        $('#marker').css("margin-top", (y) + "px");
        $('#marker').css("margin-left", (x) + "px");
        document.getElementById('marker').scrollIntoView();
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
});

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