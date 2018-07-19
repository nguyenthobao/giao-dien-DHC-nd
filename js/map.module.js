$(document).ready(function () {
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

    urlAndroid = 'https://play.google.com/store/apps/details?id=vn.anvui.dhc';
    urlIOs = 'https://itunes.apple.com/us/app/dhc-travel/id1381272202?l=vi&ls=1&mt=8';


    // $('#tab2').change(function () {
    //     if(isMobile.any() !== null) {
    //         if((isMobile.any()[0] == 'iPhone' || isMobile.any()[0] == 'iPad' || isMobile.any()[0] == 'iPod') && urlIOs != '')
    //         {
    //             window.location.href = urlIOs;
    //         } else {
    //             window.location.href = urlAndroid;
    //         }
    //     } else {
    //         window.location.href = urlAndroid;
    //     }
    // });
});