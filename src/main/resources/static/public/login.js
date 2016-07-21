$(document).ready(function() {
    $('#signIn').click( function() {
        var url = "http://localhost:8072/prama/sportingclay/shooter/auth?";

        var redirectWindowUrl = "http://localhost:8072/prama/sportingclay/shooter/id/" + $("#userId").val() + "/";
        var userUrl = "http://localhost:8072/public/user.html";
        var suUrl = "http://localhost:8072/prama/sportingclay/superuser";
        var adminUrl = "http://localhost:8072/prama/sportingclay/superuser";
        $.ajax({
            type: 'POST',
              url: url,
              data:{
                'userId' : $("#userId").val(),
                'pass' : $("#userPassword").val()
              },
              dataType: 'JSON',
              beforeSend: function (xhr) {
                  xhr.setRequestHeader ("Authorization", "Basic " + btoa(userId + ":" + userPassword));
              },
              success: function(resultData) {
                if(resultData.entity.loginDataBean.role=="SUPER_USER")
                    window.location.replace(suUrl);
                else
                    window.location.replace(userUrl);
              },
              error: function(){
                window.location.replace("http://localhost:8072/public/error.html");
              }
        });
    });
});