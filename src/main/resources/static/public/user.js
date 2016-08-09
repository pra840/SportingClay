$(document).ready(function(){
   var userId = getCookie("prama-user");

   $('#myScores').click( function() {

       var url = "http://localhost:8072/prama/sportingclay/shooter/" + userId + "/scores?";
       var userUrl = "http://localhost:8072/prama/sportingclay/user/" + userId + "/";

       $.ajax({
           type: 'GET',
             url: url,
             data:{
               'userId' : userId
             },
             dataType: "json",
             success: function(resultData) {
                alert("resultdata::" +JSON.stringify(resultData));
                if(resultData){
                    var len = resultData.scoreInfoBeanList.length;
                    var txt = "<thead><h1>MY SCORECARD</h1>";
                    var orgTxtLen= txt.length;
                    if(len > 0){
                        for(var i=0;i<len;i++){
                            var scorecard = resultData.scoreInfoBeanList[i].scorecard;
                            var scorecardLen = scorecard.length;
                            if(scorecardLen > 0){
                                for(var j=0;j<scorecardLen;j++){
                                    if(scorecard[j]){
                                        txt += "<tr>Station:: "+ scorecard[j].station+"</tr>";
                                        txt += "<tr>Target::: "+ scorecard[j].target+"</tr>";
                                        txt += "<tr>Score:: "+ scorecard[j].score+"</tr>";
                                    }
                                }
                            }
                        }
                        alert(JSON.stringify(txt));
                        if(orgTxtLen != txt.length){
                            $("#scorecardTable").append(txt).removeClass("hidden");
                        }
                    }
                }
             },
             error: function(){
               window.location.replace("http://localhost:8072/prama/sportingclay/error");
             }
       });
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


