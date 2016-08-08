$(document).ready(function() {
    var url = "http://localhost:8072/prama/sportingclay/users";

     $.ajax({
        type: 'GET',
        async: false,
        global: false,
        url: url,
        dataType: 'JSON',
        success: function(resultData) {
            for (var i = 0; i < resultData.length; i++) {
                $('#map_canvas').append("<p><a href='http://localhost:8072/prama/sportingclay/user/"+resultData[i].id+"/'>"+resultData[i].name+"</a></p>");
                }
        },
        error: function(){
            window.location.replace("http://localhost:8072/prama/sportingclay/error");
        }
     });
});