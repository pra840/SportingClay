$(document).ready(function() {
    $('#signIn').click( function() {
        var url =
            "http://localhost:8072/prama/sportingclay/shooter/auth?userId="
                + $("#userId").val()
                + "&pass="
                + $("#userPassword").val();
        window.open(url,"_self");
    });
});

