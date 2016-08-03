$(document).ready(function() {
    $('#signIn').click( function() {
        var env = getCookie("env");
        alert('Cookie Found: '+ env);

        var homeUrl = "http://localhost:8072/prama/sportingclay/login";

        var url = "http://localhost:8072/prama/sportingclay/shooter/auth?";
        var userUrl = "http://localhost:8072/prama/sportingclay/user/" + $("#userId").val() + "/";
        var suUrl = "http://localhost:8072/prama/sportingclay/superuser/"+ $("#userId").val() + "/";

        $.ajax({
            type: 'POST',
              url: url,
              data:{
                'userId' : $("#userId").val(),
                'pass'   : $("#userPassword").val()
              },
              dataType: 'JSON',
              beforeSend: function (xhr) {
                  xhr.setRequestHeader ("Authorization", "Basic " + btoa(userId + ":" + userPassword));
              },
              success: function(resultData) {
                if(resultData.entity==null)
                    window.location.replace(homeUrl);
                else
                    if(resultData.entity.loginDataBean.role=="SUPER_USER")
                        window.location.replace(suUrl);
                else
                    window.location.replace(userUrl);
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