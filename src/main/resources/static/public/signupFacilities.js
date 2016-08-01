$(document).ready(function() {
    $('#register').click( function() {
        var url = "http://localhost:8072/prama/sportingclay/facility?";
        var redirectWindowUrl = "http://localhost:8072/public/facility_home.html";

        $.ajax({
            type: 'POST',
              url: url,
              data: {
                'emailAddress' : $("#emailAddress").val(),
                'facilityName' : $("#facilityName").val(),
                'phoneNumber' : $("#phoneNumber").val(),
                'longitude' : $("#longitude").val(),
                'latitude' : $("#latitude").val()
              },
              success: function(resultData) {
                window.location.replace(redirectWindowUrl);
              },
              error: function(){
                window.location.replace("http://localhost:8072/public/error.html");
              }
        });
    });
});

