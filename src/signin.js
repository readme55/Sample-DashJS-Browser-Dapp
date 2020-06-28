


$(document).ready(function () {

    let username = sessionStorage.getItem('dash_username');
    if (username != null) {
        $("#inputUsername").val(username)
    }

    $("#submitBtn").click(function () {
        sessionStorage.setItem('dash_username', $("#inputUsername").val());
        console.log("username set: " + $("#inputUsername").val())
        window.location.href = "./index.html";
    });


});