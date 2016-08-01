$(document).ready(function(){
   $('#getScores').click( function() {
       var url = "http://localhost:8072/prama/sportingclay/shooter/65/scores?"

       $.ajax({
           type: 'GET',
             url: url,
             data:{
               'facilityId' : 129
             },
             success: function(resultData) {
                 alert(JSON.stringify(resultData));
                 alert(JSON.stringify(resultData.length));
                if(resultData){
                    var len = resultData.length;
                    alert(JSON.stringify(len));
                    var txt = "";
                    if(len > 0){
                        for(var i=0;i<len;i++){
                        alert(JSON.stringify(resultData[i]));

                            if(resultData[i].scorecard && resultData[i].cStatus){
                                txt += "<tr><td>"+resultData[i].city+"</td><td>"+resultData[i].cStatus+"</td></tr>";
                            }
                        }
                        if(txt != ""){
                            $("#table").append(txt).removeClass("hidden");
                        }
                    }
                }
             },
             error: function(){
               window.location.replace("http://localhost:8072/public/error.html");
             }
       });
   });
});