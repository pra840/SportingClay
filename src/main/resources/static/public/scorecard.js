$(document).ready(function(){
   $('#submitScore').click( function() {
       var url = "http://localhost:8072/prama/sportingclay/shooter/score?"

       $.ajax({
           type: 'POST',
             url: url,
             data:{
               'userId' : 65,
               'facilityId' : 129,
               'station1': '1-1,2-0,3-1,4-0,5-1',
               'station2': '1-0,2-1,3-1,4-1,5-0',
               ''
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