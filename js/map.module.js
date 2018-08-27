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

var point_flag = null;
var enable_flag = false;
var topLeftRealX = 0;
var topLeftRealY = 0;
var scaleX = 1;
var scaleY = 1;
var x = -1, y = -1, lat = -1, long = -1;
var that = null,
    urlAndroid = 'https://play.google.com/store/apps/details?id=vn.anvui.hotspringpark';
urlIOs = 'https://itunes.apple.com/us/app/dhc-travel/id1381272202?l=vi&ls=1&mt=8';
$(document).ready(function () {
    // var elem = document.getElementById('mapdhc');
    // var zm = new Zoom(elem, {
    //     rotate: true
    // });
    alert('Click " + " hoặc " - " để phóng to hoặc thu nhỏ bản đồ' );
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
    $('#icon_flag').hide();
    $('#disable_flag').hide();
    getOriginal1(15.971174, 108.017871, 15.968976, 108.018555, 3725, 2183 + 15, 4311, 4103 + 15);
    into_map();
    $('#tab2').click(function () {
        into_map();
    });
    $('#tab2').change(function () {
        into_map();
    });
    $('body').on('click', '#search_place>li', function () {
        $('#choose').val($(this).text());
        var li = this;
        if (isMobile.any() != null) $('html').attr('style', 'width:10000px;height:3000px');
        x = parseFloat($(this).data('left') / (9798 / $('#mapdhc').width()));
        y = parseFloat($(this).data('top') / (7046 / $('#mapdhc').height()));
        $('.img_instant').each(function () {
            $('.img_instant').hide();
        });
        $('.label_instant').each(function () {
            $('.label_instant').hide();
        });
        $('.label_instant').each(function () {
            if ($(this).data('lat') == $(li).data('left') && $(li).data('long') == $(this).data('top')) {
                $(this).attr('style', 'display: block');
                $(this).show();
                return false;
            }
        });
        $('.img_instant').each(function () {
            if ($(this).data('lat') == $(li).data('left') && $(this).data('long') == $(li).data('top')) {
                $(this).attr('style', 'display:block;');
            }
        });
        scroll(x - 200, y - 150, x - 200, y - 150);
    });
    $('body').on('touchmove', '#mapdhc', function (event) {
        if (event.originalEvent.touches[0].pageX > 1200 || event.originalEvent.touches[0].pageY > 1200) {
            $('html').attr('style', '');
        }
    });
    var scale=1;
    $('body').on('click', '#increase_scale', function () {
        if (scale < 1.5) {
            scale+=0.1;
            // alert($('#mapdhc')[0].getBoundingClientRect().width+','+$('.addCanvas')[0].getBoundingClientRect().width);
            // $('#mapdhc').css('transform', 'scale(' +(scale-0.1)+ ')');
            $('.addCanvas').css('transform', 'scale(' + (scale) + ')');
            $('#mapdhc').css('width','100%');
            $('#mapdhc').css('height','100%');
            // resetPoint();
        }
    });
    $('body').on('click', '#sub_scale', function () {
        if (scale >0.7) {
            // resetPoint();
            scale-=0.1;
            $('.addCanvas').css('transform', 'scale(' + (scale) + ')');
            $('#mapdhc').css('width','100%');
            $('#mapdhc').css('height','100%');
        }

    });
    $('body').on('click', '#mapdhc', function (e) {
        var offset = $(this).offset();
        if (e.pageX - offset.left > 1200 || e.pageY - offset.top > 1500)
            $('html').attr('style', '');
        if (enable_flag) {
            var leftFlag = e.pageX;
            var topFlag = e.pageY - 160;
            $('#icon_flag').css('margin-top', topFlag + 'px');
            $('#icon_flag').css('margin-left', leftFlag + 'px');
            $('#icon_flag').show();
            $('#disable_flag').show();
            leftFlag = (leftFlag * 9798) / $('#mapdhc').width();
            topFlag = (topFlag * 7046) / $('#mapdhc').height();
            point_flag = [leftFlag, topFlag];
        }
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
                if (pointImage[0] != undefined)
                    pointImage[0] = (pointImage[0]).slice(0, 4) + 's' + (pointImage[0]).slice(4);
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
                    // Update the css and center the modal on screen
                    $('#modalForm').css({
                        "position": "absolute",
                        "top": ((bh - h) / 2) + "px",
                        "bottom": "0px",
                        "left": ((bw - w) / 2) + "px"
                    });
                    $('#modalForm').animate({scrollTop: 0}, 'fast');
                }
                $('#modalForm div.col-lg-6').each(function () {
                    $(this).hide();
                });
            },
            error: function (e) {
                alert('Có lỗi');
            }
        });
    });
    $('body').on('click', '.point_important', function () {
        x = $(this).data('x');
        y = $(this).data('y');
        var beginPoint;
        if (that == null) {
            $('.div_marker').each(function (k, v) {
                if ($(v).data('lat') == 4310 && $(v).data('long') == 4104) {
                    that = v;
                    return false;
                }
            });
        }
        if (point_flag != null) beginPoint = point_flag;
        else if (lat > 9798 || lat < 0 || long > 7048 || long < 0)
            beginPoint = [$(that).data('lat'), $(that).data('long')];
        else beginPoint = [lat, long];
        generate_way(findPath(beginPoint, [$($(this).parent()).data('lat'), $($(this).parent()).data('long')]));
        $('.img_instant').hide();
        $('.label_instant').hide();
        $(($(this).parent()).find('.img_instant')).show();
        $(($(this).parent()).find('.label_instant')).show();

        $('.point_important').each(function () {
            $(this).removeClass('flag');
        });
        $(this).addClass('flag');
    });
    $('body').on('click', '#form-footer>button', function () {
        if (isMobile.any() != null) $('html').attr('style', 'width:10000px;height:3000px');
        if (x < 0 || y < 0) {
            x = 800;
            y = 700;
        }
        scroll(x - 150, y, x - 150, y);
    });
    var check_display_canvas=0;
    $('body').on('click', 'canvas,#mapdhc', function () {
        if(check_display_canvas==0){
            $('.img_instant').hide();
            $('.label_instant').hide();
            check_display_canvas==1;
        }else{
            if (document.getElementById('can')) (document.getElementById('can')).remove();
            check_display_canvas==0
        }
    });
    $('#choose').on('keyup', function () {
        $('li').each(function () {
            var text = (document.getElementById('choose')).value.toUpperCase();
            if (($(this).text()).toUpperCase().indexOf(text) <= -1)
                $(this).hide();
            else $(this).show();
        });
    });
    $('body').on('click', '#flag', function () {
        enable_flag = true;
        $('#icon_flag').show();
        alert('Click bản đồ chọn vị trí ghim !');
    });
    $('body').on('click', '#disable_flag', function () {
        if ($(this).data('flag')) {
            enable_flag = false;
            $(this).data('flag', 0);
            $(this).text('BỎ GHIM VỊ TRÍ');
        } else {
            enable_flag = true;
            point_flag = null;
            $(this).data('flag', 1);
            $(this).text('GHIM VỊ TRÍ');
            $('#icon_flag').hide();
            (document.getElementById('can')).remove();
        }
    });

    function resetPoint(){
        var u,v;
        $('.div_marker').each(function(){
            u = parseFloat($(this).data('lat')/ parseFloat(9798 / $('#mapdhc')[0].getBoundingClientRect().width));
            v = parseFloat($(this).data('long')/ parseFloat(7046 / $('#mapdhc')[0].getBoundingClientRect().height));
            $(this).css('margin-top',u+'px');
            $(this).css('margin-left',v+'px');
        });
    }
    function into_map() {
        if (isMobile.any() == null) {
            $('#marker').css("margin-top", 850 + "px");
            $('#marker').css("margin-left", 920 + "px");
        }
        scroll(600, 690, 950, 890);
        var browserGeolocationSuccess = function (position) {
            x = parseFloat(getXPixcelValue(position.coords.latitude, position.coords.longitude));
            y = parseFloat(getYPixcelValue(position.coords.latitude, position.coords.longitude));
            x = x / (9798 / $('#mapdhc').width());
            y = y / (7046 / $('#mapdhc').height());
            lat = parseFloat(x / $('#mapdhc').width()) * 9798;
            long = parseFloat(y / $('#mapdhc').height()) * 7046;
            if (isMobile.any() == null) {
                if (x > $('#mapdhc').width() || x < 0 || y > $('#mapdhc').height() || y < 0) {
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
                    scroll(x, y, x, y);
                } else {
                    scroll(750, 690, 950, 890);
                    $('#marker').hide();
                }
                var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
                if (width > 1000) $('#download').hide();
            }
            else {
                $('html').attr('style', 'width:10000px;height:3000px');
                $('html').addClass('height-screen');
                $('#content2').addClass('color_content2');
                if (x > $('#mapdhc').width() || x < 0 || y > $('#mapdhc').height() || y < 0) {
                    scroll(750, 690, 750, 500);
                } else {
                    $('#marker').css("margin-top", y + "px");
                    $('#marker').css("margin-left", x + "px");
                    $('#marker').show();
                    $('.label_instant').hide();
                    $('.img_instant').hide();
                    scroll(x, y, x, y);
                }
            }
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
                navigator.geolocation.watchPosition(
                    browserGeolocationSuccess,
                    browserGeolocationFail,
                    {maximumAge: 50000, timeout: 20000, enableHighAccuracy: true});
            }
        };
        tryGeolocation();
        if (lat > 0 && long > 0)
            setInterval(function () {
                tryGeolocation();
            }, 20000);

    }

    function scroll(xAndroid, yAndroid, xIOS, yIOS) {
        setTimeout($('html').animate({
            scrollTop: yAndroid,
            scrollLeft: xAndroid
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

});


var listMainPoint1 = [[4353, 3616], [4383, 3574], [4421, 3520], [4643, 3480], [4776, 3446], [5088, 3336], [5166, 3387], [5253, 3416],
    [5290, 3457], [5310, 3512], [5329, 3565], [5361, 3600], [5398, 3613], [5458, 3607], [5605, 3516], [5637, 3493], [5659, 3477],
    [5669, 3435], [5642, 3323], [5653, 3295], [5670, 3282], [5814, 3329], [5828, 3368], [5852, 3398], [5892, 3422], [6028, 3474],
    [6094, 3517], [6149, 3586], [6107, 3728], [6069, 3817], [6062, 3854], [5989, 3991], [5936, 4031], [5893, 4037], [5854, 4061],
    [5776, 4085], [5721, 4124], [5704, 4152], [5694, 4199], [5693, 4255], [5680, 4387], [5666, 4535], [5701, 4585], [5837, 4650], [5878, 4686],
    [5915, 4766], [5916, 4826], [5877, 4929], [5822, 5046], [5369, 5040], [5315, 5012], [5273, 4976], [5254, 4955], [5179, 4754], [5169, 4662],
    [5105, 4364], [5096, 4342], [5062, 4314], [4916, 4278], [4746, 4231], [4623, 4281], [4577, 4262], [4481, 3948], [4449, 3778], [4353, 3616]];
var listMainPoint2 = [[4353, 3616], [4270, 3599], [4241, 3596], [4221, 3532], [4186, 3515], [4148, 3525], [4138, 3571], [4144, 3649],
    [4128, 3708], [4062, 3756], [3987, 3762], [3920, 3727], [3823, 3554], [3804, 3489], [3808, 3433], [3842, 3371], [3872, 3305], [3806, 3294],
    [3650, 3332], [3496, 3417], [3397, 3537], [3374, 3586], [3347, 3678], [3245, 3857], [3223, 3904], [3255, 3933], [3298, 3981], [3330, 4031],
    [3382, 4155], [3407, 4197], [3447, 4255], [3466, 4309]];
var list_path1 = [[3872, 3305], [3899, 3225], [3925, 3131], [3942, 3086], [3973, 3035], [4002, 2988], [4041, 2892], [4056, 2850],
    [4038, 2819], [3821, 2729], [3772, 2731], [3668, 2802], [3630, 2816], [3523, 2815], [3472, 2740], [3464, 2715], [3471, 2694],
    [3577, 2588], [3539, 2336], [3679, 2333], [3805, 2333], [3819, 2361], [3871, 2387], [3917, 2428]];
var list_path2 = [[3523, 2815], [3353, 3007], [3271, 3063], [3234, 3069], [3187, 3055], [2998, 2839]];
var list_path3 = [[4273, 4017], [4295, 3987], [4325, 3946], [4342, 3930], [4356, 3901], [4367, 3856], [4372, 3838], [4379, 3768], [4381, 3680], [4353, 3616]];
var list_path4 = [[5396, 3221], [5390, 3233], [5354, 3266], [5319, 3283], [5304, 3291], [5285, 3304], [5268, 3324], [5255, 3334], [5225, 3353], [5166, 3387]];
var list_path5 = [[4574, 3932], [4517, 3934], [4486, 3943], [4463, 3950], [4436, 3958], [4401, 3971], [4378, 3977], [4355, 3986], [4341, 3995], [4327, 4013], [4306, 4019], [4284, 4020]];
var list_path6 = [[3144, 3330], [3090, 3349], [3048, 3377], [3090, 3486], [3102, 3491], [3168, 3481], [3239, 3481], [3257, 3490], [3272, 3517], [3315, 3617], [3347, 3678]];
var list_path7 = [[6304, 2821], [6288, 2823], [6258, 2829], [6223, 2850], [6187, 2872], [6149, 2882], [6011, 2863], [5948, 2861], [5865, 2874], [5850, 2879],
    [5834, 2891], [5821, 2917], [5814, 2941], [5774, 3023], [5767, 3050], [5776, 3081], [5802, 3126], [5811, 3177], [5797, 3289]];
var list_path8 = [[5146, 3423], [5109, 3465], [5054, 3499], [5007, 3519], [4953, 3538], [4866, 3567], [4827, 3587], [4806, 3607], [4780, 3637], [4745, 3678],
    [4734, 3705], [4724, 3738], [4722, 3775], [4730, 3854], [4750, 3941], [4759, 3997], [4774, 4054], [4789, 4123], [4815, 4127], [4848, 4128], [4860, 4144], [4868, 4154], [4827, 4206]];
var list_path9 = [[3870, 3724], [3834, 3694], [3758, 3679], [3690, 3662], [3632, 3647], [3570, 3628], [3497, 3625], [3472, 3663], [3469, 3718], [3476, 3753],
    [3487, 3784], [3480, 3835], [3476, 3870], [3473, 3928], [3478, 3982], [3500, 4025], [3524, 4036], [3560, 4054], [3590, 4087], [3624, 4125], [3648, 4158],
    [3663, 4190], [3667, 4248], [3666, 4282], [3625, 4320], [3596, 4347], [3545, 4351], [3511, 4336], [3494, 4309], [3471, 4306], [3443, 4271], [3423, 4235], [3397, 4198]];
var list_path10 = [[4791, 3620], [4749, 3630], [4502, 3608], [4454, 3621], [4423, 3539]];
var list_path11 = [[4515, 3486], [4499, 3453], [4491, 3438], [4455, 3391], [4422, 3368]];
var list_path12 = [[4422, 3368], [4339, 3400], [4220, 3445], [4176, 3467], [4158, 3486], [4148, 3517]];
var list_path13 = [[4422, 3368], [4423, 3331], [4424, 3302], [4433, 3265], [4465, 3192], [4520, 3111], [4553, 3051], [4569, 2965], [4583, 2884], [4581, 2787],
    [4562, 2735], [4512, 2704], [4395, 2735], [4319, 2775], [4216, 2811], [4126, 2835], [4060, 2837]];
var isFirst = true, isFirst1 = true, isFirst2 = true, isFirst3 = true;


function distance(beginPoint, endPoint) {
    var rs = (endPoint[0] - beginPoint[0]) * (endPoint[0] - beginPoint[0]) + (endPoint[1] - beginPoint[1]) * (endPoint[1] - beginPoint[1]);
    return rs;
}

function checkSpecialPath1(beginPoint, endPoint) {
    console.log(" checkSpecialPath1", isFirst1);
    if (!isFirst1) return [['POINTTYPE', 2]];
    var currentBeginPoint = findNearestPoint(beginPoint, list_path8);
    var currentEndPoint = findNearestPoint(endPoint, list_path8);
    var distance1 = distance(currentBeginPoint, beginPoint);
    var distance2 = distance(currentEndPoint, endPoint);
    var circle = 17000;
    var path1 = [];
    if (distance1 < circle && distance2 < circle) {
        isFirst1 = false;
        var arrpoint = findPath1(currentBeginPoint, currentEndPoint, list_path8);
        path1 = [];
        path1.push(['POINTTYPE', 1]);
        path1.push(['LIST_POINT', arrpoint]);
        return path1;
    }
    if ((distance2 < circle && beginPoint[0] > 4906) || (distance1 < circle && endPoint[0] > 4906)) {
        var tmpCurrentBeginPoint = (distance1 < circle) ? currentBeginPoint : currentEndPoint;
        var tmpCurrentEndPoint = (distance1 < circle) ? endPoint : beginPoint;
        var arrPoint = [];
        isFirst1 = false;
        var endTmpPoint = (tmpCurrentEndPoint[1] < 4150) ? list_path8[0] : list_path8[list_path8.length - 1];
        $.each(findPath1(tmpCurrentBeginPoint, endTmpPoint, list_path8), function (k, v) {
            arrPoint.push(v);
        });
        $.each(findPath(endTmpPoint, tmpCurrentEndPoint), function (k, v) {
            arrPoint.push(v);
        });
        if (currentEndPoint[0] != endPoint[0] || currentEndPoint[1] != endPoint[1]) {
            var rtArrPoint = [];
            for (var i = arrPoint.length - 1; i > -1; i--) {
                rtArrPoint.push(arrPoint[i]);
            }
            path1 = [];
            path1.push(['POINTTYPE', 1]);
            path1.push(['LIST_POINT', rtArrPoint]);
            return path1;

        }
        path1 = [];
        path1.push(['POINTTYPE', 1]);
        path1.push(['LIST_POINT', arrPoint]);
        return path1;
    }
    if ((distance2 < circle && beginPoint[0] < 4906) || (distance1 < circle && endPoint[0] < 4906)) {
        var tmpCurrentBeginPoint = (distance1 < circle) ? currentBeginPoint : currentEndPoint;
        var tmpCurrentEndPoint = (distance1 < circle) ? endPoint : beginPoint;
        var arrPoint = [];
        var endTmpPoint = list_path8[8];
        $.each(findPath1(tmpCurrentBeginPoint, endTmpPoint, list_path8), function (k, v) {
            arrPoint.push(v);
        });
        $.each(list_path10, function (k, v) {
            arrPoint.push(v);
        });
        $.each(findPath(list_path10[list_path10.length - 1], tmpCurrentEndPoint), function (k, v) {
            arrPoint.push(v);
        });
        if (JSON.stringify(currentEndPoint) == JSON.stringify(endPoint)) {
            var rtArrPoint = [];
            for (var i = arrPoint.length - 1; i > -1; i--) {
                rtArrPoint.push(arrPoint[i]);
            }
            path1 = [];
            path1.push(['POINTTYPE', 1]);
            path1.push(['LIST_POINT', rtArrPoint]);
            return path1;

        }
        path1 = [];
        path1.push(['POINTTYPE', 1]);
        path1.push(['LIST_POINT', arrPoint]);
        isFirst1 = false;
        return path1;
    }
    path1 = [];
    path1.push(['POINTTYPE', 2]);
    isFirst1 = false;
    return path1;
}

function checkSpecialPath2(beginPoint, endPoint) {
    console.log(" checkSpecialPath2", isFirst2);
    if (!isFirst2) return [['POINTTYPE', 2]];
    var path2;
    var currentBeginPoint = findNearestPoint(beginPoint, list_path9);
    var currentEndPoint = findNearestPoint(endPoint, list_path9);
    var distance1 = distance(currentBeginPoint, beginPoint);
    var distance2 = distance(currentEndPoint, endPoint);
    if (distance1 < 15000 && distance2 < 15000) {
        var arrpoint = findPath1(currentBeginPoint, currentEndPoint, list_path9);
        path2 = [];
        path2.push(['POINTTYPE', 1]);
        path2.push(['LIST_POINT', arrpoint]);
        isFirst2 = false;
        return path2;
    }
    if ((distance2 < 15000 && beginPoint[0] > 4045) || (distance1 < 15000 && endPoint[0] > 4045)) {
        var tmpCurrentBeginPoint = (distance1 < 15000) ? currentBeginPoint : currentEndPoint;
        var tmpCurrentEndPoint = (distance2 < 15000) ? beginPoint : endPoint;
        var arrPoint = [];
        isFirst2 = false;
        $.each(findPath1(tmpCurrentBeginPoint, list_path9[0], list_path9), function (k, v) {
            arrPoint.push(v);
        });
        $.each(findPath(list_path9[0], tmpCurrentEndPoint), function (k, v) {
            arrPoint.push(v);
        });
        if (JSON.stringify(currentBeginPoint) == JSON.stringify(tmpCurrentBeginPoint)) {
            var rtArrPoint = [];
            for (var i = arrPoint.length - 1; i > -1; i--) {
                rtArrPoint.push(arrPoint[i]);
            }
            path2 = [];
            path2.push(['POINTTYPE', 1]);
            path2.push(['LIST_POINT', rtArrPoint]);
            isFirst2 = false;
            return path2;
        }
        path2 = [];
        path2.push(['POINTTYPE', 1]);
        path2.push(['LIST_POINT', arrPoint]);
        isFirst2 = false;
        return path2;
    }
    path2 = [];
    path2.push(['POINTTYPE', 2]);
    isFirst2 = false;
    return path2;
}

function checkSpecialPath3(beginPoint, endPoint) {
    console.log(" checkSpecialPath3", isFirst3);
    if (!isFirst3) return [['POINTTYPE', 2]];
    var path3;
    if ((beginPoint[0] < 3772 && beginPoint[1] < 3076) || (endPoint[0] < 3772 && endPoint[1] < 3076)) {
        var tmpBeginPoint = (beginPoint[0] < 3772 && beginPoint[0] < 3076) ? endPoint : beginPoint;
        var tmpEndPoint = (JSON.stringify(beginPoint) != JSON.stringify(tmpBeginPoint)) ? beginPoint : endPoint;
        var arrPoint = [];
        isFirst3 = false;
        $.each(findPath(tmpBeginPoint, list_path11[0]), function (k, v) {
            arrPoint.push(v);
        });
        $.each(list_path11, function (k, v) {
            arrPoint.push(v);
        });
        $.each(list_path13, function (k, v) {
            arrPoint.push(v);
        });
        $.each(findPath(list_path13[list_path13.length - 1], tmpEndPoint), function (k, v) {
            arrPoint.push(v);
        });
        if (JSON.stringify(tmpBeginPoint) == JSON.stringify(beginPoint)) {
            var rtArrPoint = [];
            $.each(arrPoint, function (k, v) {
                rtArrPoint.push(v);
            });
            path3 = [];
            path3.push(['POINTTYPE', 1]);
            path3.push(['LIST_POINT', rtArrPoint]);
            isFirst3 = false;
            return path3;

        }
        path3 = [];
        path3.push(['POINTTYPE', 1]);
        path3.push(['LIST_POINT', arrPoint]);
        isFirst3 = false;
        return path3;
    }
    path3 = [];
    path3.push(['POINTTYPE', 2]);
    isFirst2 = false;
    return path3;
}

function checkSpecialPoint(point) {
    var arrCenterSpecialPoint = [[5049, 4876], [5127, 3693], [3188, 3423], [5333, 5119], [4972, 3736], [5121, 3696], [4411, 4214], [5064, 4151],
        [5530, 4447], [4073, 4034], [5707, 4710], [3618, 4219], [3379, 4327]];
    var arrGateSpecialPoint = [[5004, 4749], [5081, 3593], [3144, 3330], [4258, 4051], [4769, 3712], [5122, 3477], [4243, 4046], [5027, 4299],
        [5668, 4454], [3979, 3838], [5811, 4663], [3883, 3712], [3883, 3712]];

//        CGPoint.init(x: 3979, y: 3838), CGPoint.init(x: 5811, y: 4663)


    for (var i = 0; i < arrCenterSpecialPoint.length; i++) {
        var distanc = distance(point, arrCenterSpecialPoint[i]);
        if (distanc < 16000) return arrGateSpecialPoint[i];
    }
    return point;
}

function findNearestPoint(point, listPoint) {
    var distanc = 810000000;
    var currentPoint = null;
    $.each(listPoint, function (k, tmpPoint) {
        var tempDistance = distance(point, tmpPoint);
        if (tempDistance < distanc) {
            distanc = tempDistance;
            currentPoint = tmpPoint;
        }
    });
    return currentPoint;
}

function getIndexArray(point, list) {
    var index = -1;
    $.each(list, function (k, v) {
        if (point[0] == v[0] && point[1] == v[1]) {
            index = k;
            return false;
        }
    });
    return index;
}

function findPath1(beginPoint, endPoint, listPoint) {
    console.log('findPath1', beginPoint, endPoint, listPoint.length);
    var arrPoint = [];
    var indexStart = getIndexArray(beginPoint, listPoint);
    var indexEnd = getIndexArray(endPoint, listPoint);
    var lng = Math.abs(indexEnd - indexStart);
    var sign = (indexEnd > indexStart) ? 1 : -1;
    var tmpIndexStart = (indexStart < indexEnd) ? indexStart : indexEnd;
    var tmpIndexEnd = (indexStart > indexEnd) ? indexStart : indexEnd;
    console.log(indexStart, indexEnd, lng, sign);
    if (JSON.stringify(listPoint[0]) == JSON.stringify(listPoint[listPoint.length - 1]) &&
        lng > (listPoint.length - lng)) {

        if (listPoint.length >= 65 && tmpIndexEnd >= 52 && tmpIndexStart >= 5 && tmpIndexStart < 24) {
            var indexTmpStart = 6;
            var indexTmpEnd = 58;

            var tmpArrPoint = [];
            var gain = (tmpIndexStart < indexTmpStart) ? 1 : -1;
            for (var i = tmpIndexStart; i != indexTmpStart; i += gain) {
                tmpArrPoint.push(listPoint[i]);
            }
            for (var i = 0; i < list_path8.length; i++) {
                tmpArrPoint.push(list_path8[i]);
            }
            gain = (indexTmpEnd > tmpIndexEnd) ? -1 : 1;
            for (var i = indexTmpEnd; i != tmpIndexEnd; i += gain) {
                tmpArrPoint.push(listPoint[i]);
            }
            if (indexTmpStart != indexStart) {
                for (var i = tmpArrPoint.length - 1; i > -1; i--) {
                    arrPoint.push(tmpArrPoint[i]);
                }
            } else {
                arrPoint = tmpArrPoint;
            }
        } else {
            var gain = (indexStart > listPoint.length - indexStart) ? 1 : -1;
            var max = (indexStart > listPoint.length - indexStart) ? listPoint.length : 0;
            if (gain == 1) {
                for (var i = indexStart; i < max; i++) {
                    arrPoint.push(listPoint[i]);
                }
            } else {
                for (var i = indexStart; i > max; i--) {
                    arrPoint.push(listPoint[i]);
                }
            }
            gain = (indexEnd > listPoint.length - indexEnd) ? -1 : 1;
            if (gain == 1) {
                for (var i = 0; i <= indexEnd; i++) {
                    arrPoint.push(listPoint[i]);
                }
            } else {
                for (var i = listPoint.length - 1; i >= indexEnd; i--) {
                    arrPoint.push(listPoint[i]);
                }
            }
        }


    } else {
        for (var i = 0; i < lng + 1; i++) {
            arrPoint.push(listPoint[indexStart + sign * i]);
        }
    }

    return arrPoint;
}

function findPath(beginPoint, endPoint) {
    console.log('findPath', beginPoint, endPoint);
    var arrPoint = [];
    if ((endPoint[0] == 4531 && endPoint[1] == 3941) && beginPoint[0] > 4713) {
        return findPath(beginPoint, [4723, 3924]);
    }
    var tmpPoint1 = checkSpecialPoint(beginPoint);
    var tmpPoint2 = checkSpecialPoint(endPoint);
    console.log('tmpPoint1', tmpPoint1);
    console.log('tmpPoint2', tmpPoint2);
    if (tmpPoint1[0] != beginPoint[0] || tmpPoint1[1] != beginPoint[1] || tmpPoint2[0] != endPoint[0] || tmpPoint2[1] != endPoint[1]) {
        return findPath(tmpPoint1, tmpPoint2);
    }
    var dicData1 = checkSpecialPath1(beginPoint, endPoint);
    var type1 = dicData1[0][1];
    console.log('type1', type1);
    if (type1 == 1) {
        return dicData1[1][1];
    }
    var dicData2 = checkSpecialPath2(beginPoint, endPoint);
    var type2 = dicData2[0][1];
    console.log('type2', type2);
    if (type2 == 1) {
        return dicData2[1][1];
    }
    var dicData3 = checkSpecialPath3(beginPoint, endPoint);
    var type3 = dicData3[0][1];
    console.log('type3', type3);
    if (type3 == 1) {
        console.log('type3 return', dicData3);
        return dicData3[1][1];
    }
    var dicData = checkSmallPath(beginPoint, endPoint);
    var type = dicData[0][1];
    console.log('type', type);
    if (type == 1) {
        return dicData[1][1];
    }
    var arrPath = [];
    arrPath.push(listMainPoint1);
    arrPath.push(listMainPoint2);
    arrPath.push(list_path1);
    arrPath.push(list_path2);
    arrPath.push(list_path3);
    arrPath.push(list_path4);

    var beginIndex = 0;
    var endIndex = 0;

    var distanc = 20000000;
    var currentBeginPoint = null;
    var i = 0;
    $.each(arrPath, function (k, listPoint) {
        var tmpPoint = findNearestPoint(beginPoint, listPoint);

        if (distance(beginPoint, tmpPoint) < distanc) {
            distanc = distance(beginPoint, tmpPoint);
            currentBeginPoint = tmpPoint;
            beginIndex = i;
        }
        i += 1;
    });
    var currentEndPoint = null;
    distanc = 20000000;
    i = 0;
    $.each(arrPath, function (k, listPoint) {
        var tempPoint = findNearestPoint(endPoint, listPoint);
        if (distance(endPoint, tempPoint) < distanc) {
            distanc = distance(endPoint, tempPoint);
            currentEndPoint = tempPoint;
            endIndex = i;
        }
        i += 1;
    });

    var arrRePoint = [];
    arrRePoint.push(listMainPoint1[0]);
    arrRePoint.push(listMainPoint2[0]);
    arrRePoint.push(list_path1[0]);
    arrRePoint.push(list_path2[0]);
    console.log('ở đây', currentBeginPoint, currentEndPoint, beginIndex, endIndex);
    if (endIndex == beginIndex) {
        var tmpArPoint = findPath1(currentBeginPoint, currentEndPoint, arrPath[endIndex]);
        $.each(tmpArPoint, function (k, v) {
            arrPoint.push(v);
        });
        console.log('endIndex == beginIndex', tmpArPoint, arrPoint);
        return arrPoint;
    }
    var point1 = beginPoint;
    var point2 = endPoint;
    if (beginIndex < endIndex) {
        point1 = endPoint;
        point2 = beginPoint;
        beginIndex = beginIndex + endIndex;
        endIndex = beginIndex - endIndex;
        beginIndex = beginIndex - endIndex;
        var tempPoint = currentBeginPoint;
        currentBeginPoint = currentEndPoint;
        currentEndPoint = tempPoint;
    }

    if (endIndex > 3) {
        $.each(findPath1(currentBeginPoint, arrPath[beginIndex][arrPath[beginIndex].length - 1], arrPath[beginIndex]), function (k, v) {
            arrPoint.push(v);
        });
        $.each(findPath(arrPath[beginIndex][arrPath[beginIndex].length - 1], arrPath[endIndex][arrPath[endIndex].length - 1]), function (k, v) {
            arrPoint.push(v);
        });
        $.each(findPath1(arrPath[endIndex][arrPath[endIndex].length - 1], currentEndPoint, arrPath[endIndex]), function (k, v) {
            arrPoint.push(v);
        });

        if (JSON.stringify(point1) != JSON.stringify(beginPoint)) {
            var rtArrPoint = [];
            for (var j = arrPoint.length - 1; j > -1; j--) {
                rtArrPoint.push(arrPoint[j]);
            }
            return rtArrPoint;
        }

        return arrPoint;

    }
    if (beginIndex > 3) {

        $.each(findPath1(currentBeginPoint, arrPath[beginIndex][arrPath[beginIndex].length - 1], arrPath[beginIndex]), function (k, v) {
            arrPoint.push(v);
        });
        $.each(findPath(arrPath[beginIndex][arrPath[beginIndex].length - 1], currentEndPoint), function (k, v) {
            arrPoint.push(v);
        });
        if (JSON.stringify(point1) != JSON.stringify(beginPoint)) {
            var rtArrPoint = [];
            for (var j = arrPoint.length - 1; j > -1; j--) {
                rtArrPoint.push(arrPoint[j]);
            }
            console.log('beginIndex>3', rtArrPoint);
            return rtArrPoint;
        }
        console.log('beginIndex>3', arrPoint);
        return arrPoint;
    }
    for (var j = beginIndex + 1; j > endIndex; j--) {
        $.each(findPath1((j == beginIndex + 1) ? currentBeginPoint : arrRePoint[j], (j == endIndex + 1) ? currentEndPoint : arrRePoint[j - 1], arrPath[j - 1]), function (k, v) {
            arrPoint.push(v);
        });
    }
    if (JSON.stringify(point1) != JSON.stringify(beginPoint)) {
        var rtArrPoint = [];

        for (var j = arrPoint.length - 1; j > -1; j--) {
            rtArrPoint.push(arrPoint[j]);
        }
        console.log('rtArrPoint', rtArrPoint);
        return rtArrPoint;
    }
    return arrPoint;
}

function checkSmallPath(beginPoint, endPoint) {
    console.log('schecksmallpath', beginPoint, endPoint);
    if (!isFirst) return [['POINTTYPE', 2]];
    isFirst = false;
    var arrPath = [];
    arrPath.push(list_path5);
    arrPath.push(list_path6);
    arrPath.push(list_path7);
    var beginIndex = 0;
    var endIndex = 0;
    var arrPoint = [];
    var distance1 = 20000000;
    var currentBeginPoint = null;
    var i = 0;
    $.each(arrPath, function (k, listPoint) {
        var tmpPoint = findNearestPoint(beginPoint, listPoint);
        var mDistance = distance(beginPoint, tmpPoint);
        if (mDistance < distance1) {
            distance1 = mDistance;
            currentBeginPoint = tmpPoint;
            beginIndex = i;
        }
        i += 1;
    });
    var currentEndPoint = null;
    var distance2 = 20000000;
    i = 0;
    $.each(arrPath, function (k, listPoint) {
        var tmpPoint = findNearestPoint(endPoint, listPoint);
        var mDistance = distance(endPoint, tmpPoint);
        if (mDistance < distance2) {
            distance2 = mDistance;
            currentEndPoint = tmpPoint;
            endIndex = i;
        }
        i += 1;
    });
    console.log('distant', distance1, distance2, beginIndex, endIndex);
    var CIRCLE = 3000;
    if (currentBeginPoint != null &&
        currentBeginPoint[0] == arrPath[beginIndex][arrPath[beginIndex].length - 1][0] &&
        currentBeginPoint[1] == arrPath[beginIndex][arrPath[beginIndex].length - 1][1] &&
        currentEndPoint != null &&
        currentEndPoint[0] == arrPath[endIndex][arrPath[endIndex].length - 1][0] &&
        currentEndPoint[1] == arrPath[endIndex][arrPath[endIndex].length - 1][1]) {

        return [['POINTTYPE', 2]];
    }
    if (distance1 < CIRCLE && distance2 < CIRCLE && beginIndex == endIndex) {
        var arrpoint = findPath(currentBeginPoint, currentEndPoint, arrPath[beginIndex]);
        var smallpath = [];
        smallpath.push(['POINTTYPE', 1]);
        smallpath.push(['LIST_POINT', arrpoint]);
        return smallpath;
    }
    if (distance1 < CIRCLE && distance2 < CIRCLE) {
        $.each(findPath1(currentBeginPoint, arrPath[beginIndex][arrPath[beginIndex].length - 1], arrPath[beginIndex]), function (k, v) {
            arrPoint.push(v);
        });
        $.each(findPath(arrPath[beginIndex][arrPath[beginIndex].length - 1], arrPath[endIndex][arrPath[endIndex].length - 1]), function (k, v) {
            arrPoint.push(v);
        });
        $.each(findPath1(arrPath[endIndex][arrPath[endIndex].length - 1], currentEndPoint, arrPath[endIndex]), function (k, v) {
            arrPoint.push(v);
        });
        var smallpath = [];
        smallpath.push(['POINTTYPE', 1]);
        smallpath.push(['LIST_POINT', arrpoint]);
        return smallpath;
    }
    if (distance1 < CIRCLE) {
        $.each(findPath1(currentBeginPoint, arrPath[beginIndex][arrPath[beginIndex].length - 1], arrPath[beginIndex]), function (k, v) {
            arrPoint.push(v);
        });
        $.each(findPath(arrPath[beginIndex][arrPath[beginIndex].length - 1], endPoint), function (k, v) {
            arrPoint.push(v);
        });
        var smallpath = [];
        smallpath.push(['POINTTYPE', 1]);
        smallpath.push(['LIST_POINT', arrpoint]);
        return smallpath;
    }
    if (distance2 < CIRCLE) {
        $.each(findPath(beginPoint, arrPath[endIndex][arrPath[endIndex].length - 1]), function (k, v) {
            arrPoint.push(v);
        });
        $.each(findPath1(arrPath[endIndex][arrPath[endIndex].length - 1], currentEndPoint, arrPath[endIndex]), function (k, v) {
            arrPoint.push(v);
        });
        var smallpath = [];
        smallpath.push(['POINTTYPE', 1]);
        smallpath.push(['LIST_POINT', arrPoint]);
        return smallpath;
    }
    var smallpath = [];
    smallpath.push(['POINTTYPE', 2]);
    return smallpath;
}

function generate_way(listP) {
    isFirst = true, isFirst1 = true, isFirst2 = true, isFirst3 = true;
    var html = '', top, left;
    var top_before = 100, left_before = 100, width = 0, height = 0, minW = 0, maxH = 0, maxW = 0, minH = 0, scaleX,
        scaleY;
    $.each(listP, function (k, v) {
        left = parseFloat(v[0] / parseFloat(9798 / $('#mapdhc').width()));
        top = parseFloat(v[1] / parseFloat(7046 / $('#mapdhc').height()));
        if (top > maxH || maxH == 0) maxH = top;
        if (left < minW || minW == 0) minW = left;
        if (top < minH || minH == 0) minH = top;
        if (left > maxW) maxW = left;
        top_before = top;
        left_before = left;
    });
    width = maxW - minW;
    height = maxH - minH;
    if (document.getElementById('can'))
        (document.getElementById('can')).remove();
    var marginTop = (minH + 3);
    var marginLeft = (minW);
    html += '<canvas id="can" data-width="' + width + '" data-height="' + height + '" class="node_way playable-canvas" ' +
        ' style="margin-top:' + marginTop + 'px; margin-left:' + marginLeft + 'px;width:' + width + 'px;height: ' + height + 'px"></canvas>';
    $('.addCanvas').append(html);
    var ctx = (document.getElementById('can')).getContext('2d');
    ctx.beginPath();
    ctx.setLineDash([5, 2]);
    scaleX = parseFloat(ctx.canvas.width / width);
    scaleY = parseFloat(ctx.canvas.height / height);
    top_before = 100, left_before = 100;
    var start_draw = 0;
    $.each(listP, function (k, v) {
        left = parseFloat(v[0] / parseFloat(9798 / $('#mapdhc').width()));
        top = parseFloat(v[1] / parseFloat(7046 / $('#mapdhc').height()));
        ctx.lineTo(Math.abs(left - minW) * scaleX, Math.abs(top - minH) * scaleY);
        // ctx.arc(Math.abs(left - minW) * scaleX, Math.abs(top - minH) * scaleY, 2, 0, 2 * Math.PI, false);
    });
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ff3b31';
    ctx.stroke();

}

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
