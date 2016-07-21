$(document).ready(function() {
    $('#register').click( function() {
        var url = "http://localhost:8072/prama/sportingclay/facility?"
                                   + "emailAddress="
                                   + $("#emailAddress").val()
                                   + "&phoneNumber="
                                   + $("#phoneNumber").val()
                                   + "&facilityName="
                                   + $("#facilityName").val()
                                   + "&longitude="
                                   + $("#longitude").val()
                                   + "&latitude="
                                   + $("#latitude").val();

        var redirectWindowUrl = "http://localhost:8072/public/error.html";
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

