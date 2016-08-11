$(document).ready(function(){
   var userId = getCookie("prama-user");

   $('#myScores').click( function() {
       window.location.href="http://localhost:8072/prama/sportingclay/shooter/scores";
   });
   $('#myFacilities').click( function() {
        window.location.href="http://localhost:8072/prama/sportingclay/userFacilitiesMapView/"+userId;
   });
   $('#newScore').click( function() {
        window.location.href="http://localhost:8072/prama/sportingclay/newScore";
   });
});

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}


