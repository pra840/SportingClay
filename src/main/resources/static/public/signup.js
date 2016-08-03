$(document).ready(function() {
    $('#signUp').click( function() {
        var url = "http://localhost:8072/prama/sportingclay/shooter/signup?"
        var userUrl = "http://localhost:8072/prama/sportingclay/shooter/auth?"
        $.ajax({
            type: 'POST',
              url: url,
              data:{
                'emailAddress' : $("#emailAddress").val(),
                'password' : $("#userPassword").val(),
                'shooterName' : $("#userName").val(),
                'phoneNum' : $("#phoneNumber").val(),
                'occupation' : $("#occupation").val(),
                'question' : $("#question").val(),
                'answer' : $("#answer").val()
              },
              success: function(resultData) {
                window.location.replace(userUrl);
              },
              error: function(){
                window.location.replace("http://localhost:8072/prama/sportingclay/error");
              }
        });
    });
});