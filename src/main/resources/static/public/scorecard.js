$(document).ready(function(){
    var userId = getCookie("prama-user");

    var facilities = function () {
        url = "http://localhost:8072/prama/sportingclay/facilities";

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
                    temp[i] = [resultData.facilityInfoBean[i].id, resultData.facilityInfoBean[i].name];
                }
                tmp = temp;
              },
              error: function(){
                window.location.replace("http://localhost:8072/prama/sportingclay/error");
              }
            });
            return tmp;
         }()

    $.each(facilities,function(key,value){
        var option = $('<option />').val(value[0]).text(value[1]);
        $("#ddFacility").append(option);
    });

   $('#submitScore').click( function() {
       var url = "http://localhost:8072/prama/sportingclay/shooter/score?"

       $.ajax({
           type: 'POST',
             url: url,
             data:{
               'userId' : 65,
               'facilityId' : 129,
               'station1': '1-1,2-0,3-1,4-0,5-1',
               'station2': '1-0,2-1,3-1,4-1,5-0'
             },
             success: function(resultData) {
               window.location.replace("http://www.facebook.com");
             },
             error: function(){
               window.location.replace("http://localhost:8072/prama/sportingclay/error");
             }
       });
   });
});

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}