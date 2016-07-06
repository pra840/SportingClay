$(document).ready(function() {
    $('#signUp').click( function() {
        var url = "http://localhost:8072/prama/sportingclay/shooter/signup?"
                                   + "emailAddress="
                                   + $("#emailAddress").val()
                                   + "&password="
                                   + $("#userPassword").val()
                                   + "&shooterName="
                                   + $("#userName").val()
                                   + "&phoneNum="
                                   + $("#phoneNumber").val()
                                   + "&occupation="
                                   + $("#occupation").val()
                                   + "&question="
                                   + $("#question").val()
                                   + "&answer="
                                   + $("#answer").val();
        window.open(url, "_self");
    });
});

