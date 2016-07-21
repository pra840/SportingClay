$(document).ready(function() {
    var locations = function () {
        var tmp = null;
        var url = "http://localhost:8072/prama/sportingclay/facilities";

         $.ajax({
            type: 'GET',
            async: false,
            global: false,
            url: url,
              dataType: 'JSON',
              success: function(resultData) {
                var temp=[];
                temp = new Array(resultData.facilityInfoBean.length);
                for (var i = 0; i < resultData.facilityInfoBean.length; i++) {
                    temp[i] = new Array(resultData.facilityInfoBean.length);
                    for (var j = 0; j < resultData.facilityInfoBean.length; j++) {
                        temp[i][j] = [resultData.facilityInfoBean[j].name, resultData.facilityInfoBean[j].latitude, resultData.facilityInfoBean[j].longitude];
                    }
                }
                tmp = temp;
              },
              error: function(){
                window.location.replace("http://localhost:8072/public/error.html");
              }
            });
            return tmp;
         }()

    var map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: 10,
        center: new google.maps.LatLng(41.5067, -90.515134),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][0][1], locations[i][0][2]),
            map: map
        });
        var contentString = "<a href='http://localhost:8072/prama/sportingclay/facility/"+locations[i][0][0]+"'>"+locations[i][0][0]+"</a>"
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(contentString);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
});