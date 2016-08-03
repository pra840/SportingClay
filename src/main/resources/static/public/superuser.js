$(document).ready(function() {
    var userId = getCookie("prama-user");
    $('#fac').click( function() {
        window.location.href="http://localhost:8072/prama/sportingclay/facilitiesMapView";
    });
    $('#users').click(function(){
        window.location.href="http://localhost:8072/prama/sportingclay/user";
    });
});

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}
