$(document).ready(function () {
    // $('#search_place').select2();
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
    var x_before = 0, y_before = 0;
    var heightmap;
    if (isMobile.any() != null) heightmap = 1200; else heightmap = 1450;

    urlAndroid = 'https://play.google.com/store/apps/details?id=vn.anvui.hotspringpark';
    urlIOs = 'https://itunes.apple.com/us/app/dhc-travel/id1381272202?l=vi&ls=1&mt=8';
    // $('*').bind('touchmove', false);
    document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    });
    document.addEventListener('touchmove', function (event) {
        event = event.originalEvent || event;
        if (event.scale !== undefined && event.scale !== 1) {
            event.preventDefault();
        }
    }, false);
    document.documentElement.addEventListener('touchmove', function (event) {
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
                console.log(v.point_images,pointImage,pointImage[0]);
                // if(pointImage!='[]')
                // pointImage=(pointImage).splice(0,4)+'s'+ (pointImage).splice(4);
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
            pointData.sort(function (a, b) {
                if (a.point_name < b.point_name) return -1;
                if (a.point_name > b.point_name) return 1;
                return 0;
            });
            var html_select = '<option>Chọn địa điểm</option>', html_marker = '';
            $.each(pointData, function (k, v) {
                var pointImage = JSON.parse(v.point_images);
                // if(pointImage!='[]')
                // pointImage=(pointImage).splice(0,4)+'s'+ (pointImage).splice(4);
                var url = '';
                x = parseFloat(v.lat / parseFloat(9798 / 2048));
                y = parseFloat(v.long / parseFloat(7046 / heightmap));
                if (isMobile.any() != null) {
                    console.log(x, y);
                }
                if (v.point_type == 3) url = '/images/play_marker.png';
                else if (v.point_type == 4) url = '/images/food_marker.png';
                else url = '/images/blank_marker.png';
                if (v.point_id == 28) console.log(v);
                html_select += '<option data-top="' + v.long + '" data-left="' + v.lat + '" >' + v.point_name + '</option>';

                html_marker += '<div class="div_marker" data-id="' + v.point_id + '" data-lat="' + v.lat + '" data-long="' + v.long + '" style="z-index:' + parseInt(100 / (k + 1.1)) + ';margin-top:' + y + 'px; margin-left: ' + (x - 75) + 'px;    position: absolute; ">' +
                    '<img src="' + url + '" data-x="' + x + '" data-y="' + y + '"  style="z-index:9;max-width: 20000px; width: 18px;margin-left: 75px; height: 25px" class="point_important img-fluid map" alt="">' +
                    '<br><label data-id="' + v.point_id + '" id="label_' + x + '" class="label_instant" data-lat="' + v.lat + '" data-long="' + v.long + '">' + v.point_name + '</label><br>';
                if (v.point_images != '[]') html_marker += '<img data-id="' + v.point_id + '" id="img_' + x + '" src="' + pointImage[0] + '" class="img_instant img-fluid map" alt="" data-lat="' + v.lat + '" data-long="' + v.long + '">';
                html_marker += '</div>';
            });
            $('#search_place').html(html_select);
            $('#content2 .content .row').append(html_marker);
            $('.img_instant').hide();
            $('.label_instant').hide();
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

            generate_way();
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

        console.log(isMobile.any());

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

    var list_node1 = [[4353, 3616], [4383, 3574], [4421, 3520], [4643, 3480], [4776, 3446], [5088, 3336], [5166, 3387], [5253, 3416],
        [5290, 3457], [5310, 3512], [5329, 3565], [5361, 3600], [5398, 3613], [5458, 3607], [5605, 3516], [5637, 3493], [5659, 3477],
        [5669, 3435], [5642, 3323], [5653, 3295], [5670, 3282], [5814, 3329], [5828, 3368], [5852, 3398], [5892, 3422], [6028, 3474],
        [6094, 3517], [6149, 3586], [6107, 3728], [6069, 3817], [6062, 3854], [5989, 3991], [5936, 4031], [5893, 4037], [5854, 4061],
        [5776, 4085], [5721, 4124], [5704, 4152], [5694, 4199], [5693, 4255], [5680, 4387], [5666, 4535], [5701, 4585], [5837, 4650], [5878, 4686],
        [5915, 4766], [5916, 4826], [5877, 4929], [5822, 5046], [5369, 5040], [5315, 5012], [5273, 4976], [5254, 4955], [5179, 4754], [5169, 4662],
        [5105, 4364], [5096, 4342], [5062, 4314], [4916, 4278], [4746, 4231], [4623, 4281], [4577, 4262], [4481, 3948], [4449, 3778], [4353, 3616]];
    var list_node2 = [[4353, 3616], [4270, 3599], [4241, 3596], [4221, 3532], [4186, 3515], [4148, 3525], [4138, 3571], [4144, 3649],
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

    function checkSpecialPath1(beginPoint, endPoint) {
        if (!isFirst1) return ['POINTTYPE', 2];
        var currentBeginPoint = findNearestPoint(beginPoint, list_path8);
        var currentEndPoint = findNearestPoint(endPoint, list_path8);
        var distance1 = distance(currentBeginPoint, beginPoint);
        var distance2 = distance(currentEndPoint, endPoint);
        var circle = 17000;
        var path1 = [];
        if (distance1 < circle && distance2 < circle) {
            isFirst1 = false;
            var arrpoint = findPath(currentBeginPoint, currentEndPoint, list_path8);
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
            var list_findPath = findPath(tmpCurrentBeginPoint, endTmpPoint, list_path8);
            $.each(list_findPath, function (k, v) {
                arrPoint.push(v);
            });
            var list_findPath = findPath(endTmpPoint, tmpCurrentEndPoint);
            $.each(list_findPath, function (k, v) {
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
        if ((distance2 < circle && beginPoint[0] < 4906) ||
            (distance1 < circle && endPoint[0] < 4906)) {
            var tmpCurrentBeginPoint = (distance1 < circle) ? currentBeginPoint : currentEndPoint;
            var tmpCurrentEndPoint = (distance1 < circle) ? endPoint : beginPoint;
            var arrPoint = [];


            var endTmpPoint = list_path8[8];
            $.each(findPath(tmpCurrentBeginPoint, endTmpPoint, listPath8), function (k, v) {
                arrPoint.push(v);
            });
            $.each(listPath10, function (k, v) {
                arrPoint.push(v);
            });
            $.each(findPath(listPath10[listPath10.length - 1], tmpCurrentEndPoint), function (k, v) {
                arrPoint.push(v);
            });
            if (pointEqual(currentEndPoint, endPoint)) {
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
        if (!isFirst2) return ['POINTTYPE', 2];
        var path2;
        var currentBeginPoint = findNearestPoint(beginPoint, list_path9);
        var currentEndPoint = findNearestPoint(endPoint, list_path9);
        var distance1 = distance(currentBeginPoint, beginPoint);
        var distance2 = distance(currentEndPoint, endPoint);
        if (distance1 < 15000 && distance2 < 15000) {
            var arrpoint = findPath(currentBeginPoint, currentEndPoint, list_path9);
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
            $.each(findPath(tmpCurrentBeginPoint, list_path9[0], list_path9), function (k, v) {
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
        if (!isFirst3) return ['POINTTYPE', 2];
        var path3;
        if ((beginPoint[0] < 3772 && beginPoint[1] < 3076) || (endPoint[0] < 3772 && endPoint[1] < 3076)) {
            var tmpBeginPoint = (beginPoint[0] < 3772 && beginPoint[0] < 3076) ? endPoint : beginPoint;
            var tmpEndPoint = (JSON.stringify(beginPoint) != JSON.stringify(tmpBeginPoint)) ? beginPoint : endPoint;
            var arrPoint = [];
            isFirst3 = false;
            $.each(findPath(tmpBeginPoint, listPath11[0]), function (k, v) {
                arrPoint.push(v);
            });
            $.each(list_path11, function (k, v) {
                arrPoint.push(v);
            });
            $.each(list_path13, function (k, v) {
                arrPoint.push(v);
            });
            $.each(findPath(listPath13[listPath13.length - 1], tmpEndPoint), function (k, v) {
                arrPoint.push(v);
            });
            if (JSON.stringify(tmpBeginPoint) == JSON.stringify(beginPoint)) {
                var rtArrPoint = [];
                for (var i = arrPoint.length - 1; i > -1; i--) {
                    rtArrPoint.push(arrPoint[i]);
                }
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
            var distance = distance(point, arrCenterSpecialPoint[i]);
            if (distance < 16000) return arrGateSpecialPoint[i];
        }
        return point;
    }

    function findNearestPoint(point, listPoint) {
        var distance = 810000000;
        var currentPoint = null;
        $.each(listPoint, function (k, tmpPoint) {
            var tempDistance = distance(point, tmpPoint);
            if (tempDistance < distance) {
                distance = tempDistance;
                currentPoint = tmpPoint;
            }
        });
        return currentPoint;
    }

    function findPath(beginPoint, endPoint, listPoint) {
        var arrPoint = [];
        var indexStart = listPoint.indexOf(beginPoint);
        var indexEnd = listPoint.indexOf(endPoint);
        var lng = Math.abs(indexEnd - indexStart);
        var sign = (indexEnd > indexStart) ? 1 : -1;
        var tmpIndexStart = (indexStart < indexEnd) ? indexStart : indexEnd;
        var tmpIndexEnd = (indexStart > indexEnd) ? indexStart : indexEnd;
        if (listPoint[0][0] == listPoint[listPoint.length - 1][0] &&
            listPoint[0][1] == listPoint[listPoint.length - 1][1] &&
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
        var arrPoint = [];
        if ((endPoint[0] == 4531 && endPoint[1] == 3941) && beginPoint[0] > 4713) {
            return findPath(beginPoint, [4723, 3924]);
        }
        var tmpPoint1 = checkSpecialPoint(beginPoint);
        var tmpPoint2 = checkSpecialPoint(endPoint);
        if (tmpPoint1[0] != beginPoint[0] || tmpPoint1[1] != beginPoint[1] || tmpPoint2[0] != endPoint[0] || tmpPoint2[1] != endPoint[1]) {
            return findPath(tmpPoint1, tmpPoint2);
        }
        var dicData1 = checkSpecialPath1(beginPoint, endPoint);
        var type1 = dicData1['POINTTYPE'];
        if (type1 == 1) {
            return dicData1['LIST_POINT'];
        }
        var dicData2 = checkSpecialPath2(beginPoint, endPoint);
        var type2 = dicData2['POINTTYPE'];
        if (type2 == 1) {
            return dicData2['LIST_POINT'];
        }
        var dicData3 = checkSpecialPath3(beginPoint, endPoint);
        var type3 = dicData3['POINTTYPE'];
        if (type3 == 1) {
            return dicData3['LIST_POINT'];
        }
        var dicData = checkSmallPath(beginPoint, endPoint);
        var type = dicData['POINTTYPE'];
        if (type == 1) {
            return dicData['LIST_POINT'];
        }
        var arrPath = [];
        arrPath.push(listMainPoint1);
        arrPath.push(listMainPoint2);
        arrPath.push(listPath1);
        arrPath.push(listPath2);
        arrPath.push(listPath3);
        arrPath.push(listPath4);

        var beginIndex = 0;
        var endIndex = 0;

        var distance = 20000000;
        var currentBeginPoint = null;
        var i = 0;

        $.each(arrPath, function (k, listPoint) {
            var tmpPoint = findNearestPoint(beginPoint, listPoint);
            if (distance(beginPoint, tmpPoint) < distance) {
                distance = distance(beginPoint, tmpPoint);
                currentBeginPoint = tmpPoint;
                beginIndex = i;
            }
            i += 1;
        });
        var currentEndPoint = null;
        distance = 20000000;
        i = 0;
        $.each(arrPath, function (k, listPoint) {
            var tempPoint = findNearestPoint(endPoint, listPoint);
            if (distance(endPoint, tempPoint) < distance) {
                distance = distance(endPoint, tempPoint);
                currentEndPoint = tempPoint;
                endIndex = i;
            }
            i += 1;
        });

        var arrRePoint = [];
        arrRePoint.push(listMainPoint1[0]);
        arrRePoint.push(listMainPoint2[0]);
        arrRePoint.push(listPath1[0]);
        arrRePoint.push(listPath2[0]);

        if (endIndex == beginIndex) {
            $.each(findPath(currentBeginPoint, currentEndPoint, arrPath[endIndex]), function (k, v) {
                arrPoint.push(v);
            });
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
            arrPoint.concat(findPath(currentBeginPoint, arrPath[beginIndex][arrPath[beginIndex].length - 1], arrPath[beginIndex]));
            arrPoint.concat(findPath(arrPath[beginIndex][arrPath[beginIndex].length - 1], arrPath[endIndex][arrPath[endIndex].length - 1]));
            arrPoint.concat(findPath(arrPath[endIndex][arrPath[endIndex].length - 1], currentEndPoint, arrPath[endIndex]));

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
            arrPoint.concat(findPath(currentBeginPoint, arrPath[beginIndex][arrPath[beginIndex].length - 1], arrPath[beginIndex]));
            arrPoint.concat(findPath(arrPath[beginIndex][arrPath[beginIndex].length - 1], currentEndPoint));

            if (JSON.stringify(point1) != JSON.stringify(beginPoint)) {
                var rtArrPoint = [];
                for (var j = arrPoint.length - 1; j > -1; j--) {
                    rtArrPoint.push(arrPoint[j]);
                }
                return rtArrPoint;
            }
            return arrPoint;
        }
        for (var j = beginIndex + 1; j > endIndex; j--) {
            arrPoint.concat(findPath((j == beginIndex + 1) ? currentBeginPoint : arrRePoint[j], (j == endIndex + 1) ? currentEndPoint : arrRePoint[j - 1], arrPath[j - 1]));

        }
        if (JSON.stringify(point1) != JSON.stringify(beginPoint)) {
            var rtArrPoint = [];

            for (var j = arrPoint.length - 1; j > -1; j--) {
                rtArrPoint.push(arrPoint[j]);
            }
            return rtArrPoint;
        }
        return arrPoint;
    }

    function distance(beginPoint, endPoint) {
        return (endPoint[0] - beginPoint[0]) * (endPoint[0] - beginPoint[0]) + (endPoint[1] - beginPoint[1]) * (endPoint[1] - beginPoint[1]);
    }

    function checkSmallPath(beginPoint, endPoint) {
        if (!isFirst) return ['POINTTYPE', 2];
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

        var CIRCLE = 3000;
        if (currentBeginPoint != null &&
            currentBeginPoint[0] == arrPath[beginIndex][arrPath[beginIndex].length - 1][0] &&
            currentBeginPoint[1] == arrPath[beginIndex][arrPath[beginIndex].length - 1][1] &&
            currentEndPoint != null &&
            currentEndPoint[0] == arrPath[endIndex][arrPath[endIndex].length - 1][0] &&
            currentEndPoint[1] == arrPath[endIndex][arrPath[endIndex].length - 1][1]) {

            return ['POINTTYPE', 2];
        }
        if (distance1 < CIRCLE && distance2 < CIRCLE && beginIndex == endIndex) {
            var arrpoint = findPath(currentBeginPoint, currentEndPoint, arrPath[beginIndex]);
            var smallpath = [];
            smallpath.push('POINTTYPE', 1);
            smallpath.push('LIST_POINT', arrpoint);
            return smallpath;
        }
        if (distance1 < CIRCLE && distance2 < CIRCLE) {
            arrPoint.concat(findPath(currentBeginPoint, arrPath[beginIndex][arrPath[beginIndex].length - 1], arrPath[beginIndex]));
            arrPoint.concat(findPath(arrPath[beginIndex][arrPath[beginIndex].length - 1], arrPath[endIndex][arrPath[endIndex].length - 1]));
            arrPoint.concat(findPath(arrPath[endIndex][arrPath[endIndex].length - 1], currentEndPoint, arrPath[endIndex]));
            var smallpath = [];
            smallpath.push('POINTTYPE', 1);
            smallpath.push('LIST_POINT', arrpoint);
            return smallpath;
        }
        if (distance1 < CIRCLE) {
            arrPoint.concat(findPath(currentBeginPoint, arrPath[beginIndex][arrPath[beginIndex].length - 1], arrPath[beginIndex]));
            arrPoint.concat(findPath(arrPath[beginIndex][arrPath[beginIndex].length - 1], endPoint));
            var smallpath = [];
            smallpath.push('POINTTYPE', 1);
            smallpath.push('LIST_POINT', arrpoint);
            return smallpath;
        }
        if (distance2 < CIRCLE) {
            arrPoint.concat(findPath(beginPoint, arrPath[endIndex][arrPath[endIndex].length - 1]));
            arrPoint.concat(findPath(arrPath[endIndex][arrPath[endIndex].length - 1], currentEndPoint, arrPath[endIndex]));
            var smallpath = [];
            smallpath.push('POINTTYPE', 1);
            smallpath.push('LIST_POINT', arrpoint);
            return smallpath;
        }
        var smallpath = [];
        smallpath.push('POINTTYPE', 2);
        return smallpath;
    }

    function generate_way() {
        var html = '', top, left;
        var all_way = list_node1.concat(list_node2).concat(list_path1).concat(list_path2).concat(list_path3).concat(list_path4).concat(list_path5)
            .concat(list_path6).concat(list_path7).concat(list_path8).concat(list_path9).concat(list_path10).concat(list_path11)
            .concat(list_path12).concat(list_path13);
        console.log(all_way);
        $.each(all_way, function (k, v) {
            left = parseFloat(v[0] / parseFloat(9798 / 2048)) - 8;
            top = parseFloat(v[1] / parseFloat(7046 / heightmap)) - 1038;
            html += '<div class="node_way" style="margin-top:' + top + 'px; margin-left:' + left + 'px"></div>';
        });
        $('#content2').append(html);
    }
});
