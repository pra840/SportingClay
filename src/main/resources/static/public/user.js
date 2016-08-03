$(document).ready(function(){
   $('#myScores').click( function() {
        var userId = getCookie("prama-user");
        alert('Cookie Found User Id: '+ userId);
       var url = "http://localhost:8072/prama/sportingclay/shooter/65/scores?"
       var userUrl = "http://localhost:8072/prama/sportingclay/user/" + $userId + "/";

       $.ajax({
           type: 'GET',
             url: url,
             data:{
               'facilityId' : 129
             },
             dataType: "json",
             success: function(resultData) {
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
           var userId = getCookie("prama-user");
           alert(JSON.stringify('Cookie Found User Id: '+ userId));
        window.location.href="http://localhost:8072/prama/sportingclay/facilitiesMapView";
   });
});

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}


