$(document).ready(function() {
    var userId = getCookie("prama-user");
    alert(JSON.stringify(userId));

    var locations = function () {
        var tmp = null;
        var url = null;

        if(userId== undefined )
            url = "http://localhost:8072/prama/sportingclay/facilities";
        else
            url = "http://localhost:8072/prama/sportingclay/facilities/"+userId;

        alert(JSON.stringify(url));

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
                window.location.replace("http://localhost:8072/prama/sportingclay/error");
              }
            });
            return tmp;
         }()
    var map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: 10,
        center: new google.maps.LatLng(41.5067, -90.515134),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var infoWindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    var marker, i;
    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[0][i][1], locations[0][i][2]),
            map: map,
            info: "<a href='http://localhost:8072/prama/sportingclay/facility/"+locations[0][i][0]+"'>"+locations[0][i][0]+"</a>"
        });
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(this.info);
                infoWindow.open(map, this);
            }
        })(marker, i));
        bounds.extend(marker.getPosition());
        map.fitBounds(bounds);
    }

    $('#newFac').click( function() {
    window.location.href="http://localhost:8072/prama/sportingclay/newFacility";
    });
});

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}