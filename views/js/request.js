$(document).ready(function () {
    $("#id_btn_restart").click(function () {
        $.get("http://localhost:8380/", function (data, status) {
            alert(status);
        })
    })
})