$(document).ready(function() {
    var userId = getCookie("prama-user");
    var url = "http://localhost:8072/prama/sportingclay/shooter/" + userId + "/scores?";

     $.ajax({
        type: 'GET',
        async: false,
        global: false,
        url: url,
        dataType: 'JSON',
        success: function(resultData) {
            if(resultData){
                for (var i = 0; i < resultData.scoreInfoBeanList.length; i++) {
                    $('#myScores').append("<p id='scoreById'><a href='http://localhost:8072/prama/sportingclay/shooter/score/"+resultData.scoreInfoBeanList[i].id+"/'"+"onclick="+getScoreByID(this)+">"+getScoreCardTime(resultData.scoreInfoBeanList[i].gameDate)+"</a></p>");
                }
            }
        },
        error: function(){
            window.location.replace("http://localhost:8072/prama/sportingclay/error");
        }
     });
});

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

function getScoreCardTime(time){
    var varDate = new Date(time);

    var textMonth = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    return textMonth[varDate.getMonth()].toString()+"-"+ varDate.getDate().toString()+"-"+ varDate.getFullYear().toString();
}

window.getScoreByID = function(obj) {
    alert(JSON.stringify(obj));
    document.getElementById('scoreById').innerHTML = obj.innerHTML;
}

function getScoreByID(scorecardId)
    $.ajax({
        type: 'GET',
        async: false,
        global: false,
        url: url,
        dataType: 'JSON',
        success: function(resultData) {
            if(resultData){
                for (var i = 0; i < resultData.scoreInfoBeanList.length; i++) {
                    $('#myScores').append("<p id='scoreById'><a href='http://localhost:8072/prama/sportingclay/shooter/score/"+resultData.scoreInfoBeanList[i].id+"/'"+"onclick="+getScoreByID(this)+">"+getScoreCardTime(resultData.scoreInfoBeanList[i].gameDate)+"</a></p>");
                }
            }
        },
        error: function(){
            window.location.replace("http://localhost:8072/prama/sportingclay/error");
        }
    });